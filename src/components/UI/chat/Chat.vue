<template>
	<section class="chat" :class="{ 'has-selection': selected }">
		<!-- Liste des amis -->
		<aside class="chat__list" aria-label="Amis">
			<header class="chat__list-head">
				<h2>{{ $t('chat_page.title') }}</h2>
				<span class="status" :class="connected ? 'is-online' : 'is-offline'">
					{{ connected ? $t('chat_page.online') : $t('chat_page.connecting') }}
				</span>
			</header>

			<input
				v-model="search"
				class="chat__search"
				type="search"
				:placeholder="$t('chat_page.search')"
				:aria-label="$t('chat_page.search')" />

			<p v-if="friendsLoading" class="chat__hint">{{ $t('chat_page.loading') }}</p>
			<p v-else-if="!friends.length" class="chat__hint">{{ $t('chat_page.no_friends') }}</p>
			<p v-else-if="!filteredFriends.length" class="chat__hint">{{ $t('chat_page.no_match') }}</p>

			<ul v-else class="friends">
				<li v-for="friend in filteredFriends" :key="friend.id">
					<button
						type="button"
						class="friend"
						:class="{ 'is-active': selected?.id === friend.id }"
						:aria-current="selected?.id === friend.id"
						@click="select(friend)">
						<span class="friend__avatar" aria-hidden="true">{{ initialOf(friend) }}</span>
						<span class="friend__text">
							<strong>{{ nameOf(friend) }}</strong>
							<small>@{{ friend.username }}</small>
						</span>
						<span v-if="unread[friend.id]" class="friend__badge" :aria-label="$t('chat_page.unread', { count: unread[friend.id] })">
							{{ unread[friend.id] }}
						</span>
					</button>
				</li>
			</ul>
		</aside>

		<!-- Conversation -->
		<div v-if="selected" class="chat__conversation">
			<header class="conv-head">
				<button type="button" class="conv-head__back" :aria-label="$t('chat_page.back')" @click="selected = null">
					←
				</button>
				<span class="friend__avatar" aria-hidden="true">{{ initialOf(selected) }}</span>
				<div class="conv-head__who">
					<strong>{{ nameOf(selected) }}</strong>
					<small>@{{ selected.username }}</small>
				</div>
				<router-link :to="`/app/user/${selected.id}`" class="conv-head__profile">
					{{ $t('chat_page.view_profile') }}
				</router-link>
			</header>

			<div ref="thread" class="thread" role="log" aria-live="polite">
				<p v-if="historyLoading" class="thread__state">{{ $t('chat_page.loading') }}</p>
				<p v-else-if="historyError" class="thread__state" role="alert">
					{{ $t('chat_page.history_error') }}
					<button type="button" class="link" @click="loadHistory">{{ $t('chat_page.retry') }}</button>
				</p>
				<p v-else-if="!messages.length" class="thread__state">{{ $t('chat_page.empty') }}</p>

				<template v-for="group in groupedMessages" :key="group.key">
					<div class="day"><span>{{ group.label }}</span></div>
					<div
						v-for="message in group.items"
						:key="message._id"
						class="bubble-row"
						:class="{ 'is-mine': isMine(message) }">
						<div class="bubble" :class="{ 'is-pending': message.pending, 'is-failed': message.failed }">
							<p>{{ message.content }}</p>
							<small>
								<template v-if="message.failed">{{ $t('chat_page.failed') }}</template>
								<template v-else-if="message.pending">{{ $t('chat_page.pending') }}</template>
								<template v-else>{{ formatTime(message.time) }}</template>
							</small>
						</div>
					</div>
				</template>
			</div>

			<form class="composer" @submit.prevent="send">
				<textarea
					v-model="draft"
					rows="1"
					:placeholder="$t('chat_page.placeholder')"
					:aria-label="$t('chat_page.placeholder')"
					@keydown.enter.exact.prevent="send" />
				<button type="submit" class="composer__send" :disabled="!draft.trim()" :aria-label="$t('chat_page.send')">
					➤
				</button>
			</form>
			<p class="composer__hint">{{ $t('chat_page.hint') }}</p>
		</div>

		<div v-else class="chat__empty">
			<p>{{ $t('chat_page.select') }}</p>
		</div>
	</section>
</template>

<script setup>
	import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
	import { useRoute } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { storeToRefs } from 'pinia';
	import { notify } from '@kyvg/vue3-notification';
	import axios from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';

	const route = useRoute();
	const { t, locale } = useI18n();
	const { me } = storeToRefs(useAuthStore());

	const friends = ref([]);
	const friendsLoading = ref(true);
	const search = ref('');
	const selected = ref(null);
	const messages = ref([]);
	const historyLoading = ref(false);
	const historyError = ref(false);
	const draft = ref('');
	const connected = ref(false);
	const unread = reactive({});
	const thread = ref(null);

	let socket = null;
	let tempCounter = 0;

	const nameOf = (user) => [user.name, user.lastname].filter(Boolean).join(' ') || user.username;
	const initialOf = (user) => (user.name ?? user.username ?? '?').charAt(0).toUpperCase();
	const isMine = (message) => message.from == me.value?.id;

	const filteredFriends = computed(() => {
		const query = search.value.trim().toLowerCase();
		if (!query) return friends.value;
		return friends.value.filter((friend) =>
			`${nameOf(friend)} ${friend.username}`.toLowerCase().includes(query)
		);
	});

	const formatTime = (value) =>
		new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit' }).format(new Date(Number(value)));

	// Séparateurs de date : aujourd'hui, hier, puis la date
	const dayKey = (value) => {
		const date = new Date(Number(value));
		return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	};
	const dayLabel = (value) => {
		const date = new Date(Number(value));
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);
		if (dayKey(value) === dayKey(today.getTime())) return t('chat_page.today');
		if (dayKey(value) === dayKey(yesterday.getTime())) return t('chat_page.yesterday');
		return new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
	};

	const groupedMessages = computed(() => {
		const groups = [];
		for (const message of messages.value) {
			const key = dayKey(message.time);
			const last = groups[groups.length - 1];
			if (last && last.key === key) last.items.push(message);
			else groups.push({ key, label: dayLabel(message.time), items: [message] });
		}
		return groups;
	});

	const scrollToEnd = () =>
		nextTick(() => {
			if (thread.value) thread.value.scrollTop = thread.value.scrollHeight;
		});

	const sortByTime = (list) => [...list].sort((a, b) => Number(a.time) - Number(b.time));

	const loadFriends = async () => {
		friendsLoading.value = true;
		try {
			const { data } = await axios.get('/users/friends');
			friends.value = Array.isArray(data) ? data : [];
		} catch (e) {
			friends.value = [];
		} finally {
			friendsLoading.value = false;
		}
		// Ouverture directe depuis un profil : /app/chat?with=ID
		const requested = route.query.with;
		if (requested) {
			const friend = friends.value.find((f) => String(f.id) === String(requested));
			if (friend) select(friend);
		}
	};

	const loadHistory = async () => {
		if (!selected.value) return;
		historyLoading.value = true;
		historyError.value = false;
		try {
			const { data } = await axios.get(`/chat/${me.value.id}/${selected.value.id}`);
			messages.value = sortByTime(
				(Array.isArray(data) ? data : []).map((m) => ({ ...m, _id: m._id ?? m.id }))
			);
			scrollToEnd();
		} catch (e) {
			historyError.value = true;
		} finally {
			historyLoading.value = false;
		}
	};

	const select = (friend) => {
		selected.value = friend;
		unread[friend.id] = 0;
		draft.value = '';
		messages.value = [];
		loadHistory();
	};

	const send = () => {
		const text = draft.value.trim();
		if (!text || !selected.value) return;
		draft.value = '';

		const tempId = `tmp-${Date.now()}-${tempCounter++}`;
		const pending = {
			_id: tempId,
			from: me.value.id,
			to: selected.value.id,
			content: text,
			time: Date.now(),
			pending: true,
		};
		messages.value.push(pending);
		scrollToEnd();

		const markFailed = () => {
			const index = messages.value.findIndex((m) => m._id === tempId);
			if (index !== -1) messages.value[index] = { ...messages.value[index], pending: false, failed: true };
		};

		if (!socket || !connected.value) {
			markFailed();
			return;
		}

		socket.emit('send_message', { toUser: { id: selected.value.id }, message: text }, (response) => {
			if (!response?.ok) {
				markFailed();
				return;
			}
			const index = messages.value.findIndex((m) => m._id === tempId);
			const saved = { ...response.message, _id: response.message._id ?? response.message.id };
			if (index !== -1) messages.value[index] = saved;
			else messages.value.push(saved);
		});
	};

	const onIncoming = (payload) => {
		const sender = payload.from;
		const message = { ...payload.message, _id: payload.message._id ?? payload.message.id };

		if (selected.value && String(sender.id) === String(selected.value.id)) {
			if (!messages.value.some((m) => m._id === message._id)) messages.value.push(message);
			scrollToEnd();
			return;
		}

		unread[sender.id] = (unread[sender.id] ?? 0) + 1;
		notify({
			title: t('chat_page.new_message', { name: nameOf(sender) }),
			text: message.content.slice(0, 80),
			type: 'success',
		});
	};

	const connect = () => {
		if (!window.io) return;
		socket = window.io(import.meta.env.VITE_APP_SOCKET_URL, {
			auth: { token: localStorage.getItem('auction_token') },
		});
		socket.on('connect', () => {
			connected.value = true;
			socket.emit('client_join');
		});
		socket.on('disconnect', () => (connected.value = false));
		socket.on('connect_error', () => (connected.value = false));
		socket.on('message_received', onIncoming);
	};

	// Le fil s'ouvre en bas et le composeur reste utilisable
	watch(messages, scrollToEnd, { deep: false });

	onMounted(() => {
		connect();
		loadFriends();
	});

	onBeforeUnmount(() => {
		socket?.off('message_received', onIncoming);
		socket?.disconnect();
	});
</script>

<style scoped>
	.chat {
		display: grid;
		grid-template-columns: 300px 1fr;
		height: calc(100vh - 150px);
		min-height: 520px;
		max-width: 1200px;
		margin: 0 auto;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 22px;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.08);
		color: #0d104d;
	}

	/* Liste des amis */
	.chat__list {
		display: flex;
		flex-direction: column;
		min-height: 0;
		border-right: 1px solid #eef0f6;
		background: #f6f7fb;
	}

	.chat__list-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 20px 12px;
	}

	.chat__list-head h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.status {
		font-size: 11px;
		font-weight: 600;
	}

	.status.is-online {
		color: #0f9d58;
	}

	.status.is-offline {
		color: #9aa0b8;
	}

	.chat__search {
		margin: 0 16px 12px;
		padding: 10px 14px;
		border: 1px solid #dfe2ee;
		border-radius: 12px;
		background: #ffffff;
		font-size: 14px;
		color: #0d104d;
		outline: none;
	}

	.chat__search:focus {
		border-color: #ffaf02;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.chat__hint {
		margin: 12px 20px;
		font-size: 13px;
		line-height: 1.6;
		color: #7a7f96;
	}

	.friends {
		flex: 1;
		margin: 0;
		padding: 0 10px 12px;
		overflow-y: auto;
		list-style: none;
	}

	.friend {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 10px 12px;
		border: 0;
		border-radius: 14px;
		background: transparent;
		color: #0d104d;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.friend:hover,
	.friend:focus-visible {
		background: rgba(13, 16, 77, 0.05);
		outline: none;
	}

	.friend.is-active {
		background: #0d104d;
		color: #ffffff;
	}

	.friend__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		flex-shrink: 0;
		border-radius: 50%;
		background: #ffaf02;
		color: #0d104d;
		font-weight: 700;
	}

	.friend__text {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
	}

	.friend__text strong,
	.friend__text small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.friend__text small {
		font-size: 12px;
		opacity: 0.65;
	}

	.friend__badge {
		min-width: 22px;
		height: 22px;
		padding: 0 7px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0d104d;
		font-size: 12px;
		font-weight: 700;
		line-height: 22px;
		text-align: center;
	}

	/* Conversation */
	.chat__conversation {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}

	.chat__empty {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #7a7f96;
	}

	.conv-head {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px 22px;
		border-bottom: 1px solid #eef0f6;
	}

	.conv-head__back {
		display: none;
		border: 0;
		background: transparent;
		font-size: 20px;
		color: #0d104d;
		cursor: pointer;
	}

	.conv-head__who {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
	}

	.conv-head__who small {
		color: #7a7f96;
	}

	.conv-head__profile {
		padding: 7px 14px;
		border-radius: 999px;
		background: #f1f2f7;
		color: #0d104d;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.conv-head__profile:hover,
	.conv-head__profile:focus-visible {
		background: #ffaf02;
		outline: none;
	}

	.thread {
		flex: 1;
		min-height: 0;
		padding: 18px 26px;
		overflow-y: auto;
		background: #fafbfd;
	}

	.thread__state {
		margin: 20px 0;
		text-align: center;
		color: #7a7f96;
	}

	.link {
		border: 0;
		background: none;
		color: #28408b;
		font-weight: 600;
		text-decoration: underline;
		cursor: pointer;
	}

	.day {
		display: flex;
		justify-content: center;
		margin: 16px 0 10px;
	}

	.day span {
		padding: 4px 12px;
		border-radius: 999px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		font-size: 12px;
		color: #7a7f96;
	}

	.bubble-row {
		display: flex;
		margin-bottom: 8px;
	}

	.bubble-row.is-mine {
		justify-content: flex-end;
	}

	.bubble {
		max-width: 68%;
		padding: 10px 14px 8px;
		border-radius: 18px 18px 18px 6px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		box-shadow: 0 4px 12px rgba(13, 16, 77, 0.05);
	}

	.is-mine .bubble {
		border-radius: 18px 18px 6px 18px;
		background: linear-gradient(135deg, #0d104d, #28408b);
		border-color: transparent;
		color: #ffffff;
	}

	.bubble p {
		margin: 0;
		color: inherit;
		font-size: 15px;
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.bubble small {
		display: block;
		margin-top: 4px;
		font-size: 11px;
		opacity: 0.6;
		text-align: right;
	}

	.bubble.is-pending {
		opacity: 0.6;
	}

	.bubble.is-failed {
		border-color: #d93025;
	}

	.bubble.is-failed small {
		color: #d93025;
		opacity: 1;
	}

	/* Composeur */
	.composer {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		padding: 14px 20px 6px;
		border-top: 1px solid #eef0f6;
	}

	.composer textarea {
		flex: 1;
		max-height: 140px;
		padding: 12px 16px;
		border: 1px solid #dfe2ee;
		border-radius: 16px;
		background: #fafbfd;
		font-family: inherit;
		font-size: 15px;
		color: #0d104d;
		resize: none;
		outline: none;
	}

	.composer textarea:focus {
		border-color: #ffaf02;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.composer__send {
		width: 46px;
		height: 46px;
		flex-shrink: 0;
		border: 0;
		border-radius: 50%;
		background: #ffaf02;
		color: #0d104d;
		font-size: 18px;
		cursor: pointer;
		transition: transform 0.2s ease, background-color 0.2s ease;
	}

	.composer__send:hover:not(:disabled),
	.composer__send:focus-visible {
		transform: translateY(-1px);
		background: #ffd166;
		outline: none;
	}

	.composer__send:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.composer__hint {
		margin: 0;
		padding: 0 20px 12px;
		font-size: 11px;
		color: #9aa0b8;
	}

	/* Mobile : liste, puis conversation */
	@media (max-width: 767px) {
		.chat {
			grid-template-columns: 1fr;
			height: calc(100vh - 110px);
			border-radius: 16px;
		}
		.chat:not(.has-selection) .chat__conversation,
		.chat:not(.has-selection) .chat__empty {
			display: none;
		}
		.chat.has-selection .chat__list {
			display: none;
		}
		.conv-head__back {
			display: inline-block;
		}
		.bubble {
			max-width: 85%;
		}
	}
</style>
