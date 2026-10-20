<template>
	<div class="user-view" ref="root">
		<!-- Chargement -->
		<div v-if="loading" class="user-view__skeleton" aria-hidden="true">
			<div class="skel skel--hero"></div>
			<div class="skel skel--grid"></div>
		</div>

		<div v-else-if="notFound" class="user-view__state">
			<h1>{{ $t('profile_view.not_found') }}</h1>
			<router-link to="/app" class="btn-pill">{{ $t('profile_view.back') }}</router-link>
		</div>

		<div v-else-if="loadError" class="user-view__state" role="alert">
			<p>{{ sessionExpired ? $t('profile_view.session_expired') : $t('profile_view.error') }}</p>
			<router-link v-if="sessionExpired" to="/login" class="btn-pill">{{ $t('login_page.submit') }}</router-link>
			<button v-else type="button" class="btn-pill" @click="load">{{ $t('profile_view.retry') }}</button>
		</div>

		<template v-else>
			<!-- Carte d'identité -->
			<section class="hero" data-reveal>
				<div class="hero__identity">
					<img v-if="avatar" :src="avatar" alt="" class="hero__avatar-img" />
					<span v-else class="hero__avatar" aria-hidden="true">{{ initial }}</span>
					<div>
						<h1>{{ fullName }}</h1>
						<p class="hero__username">@{{ user.username }}</p>
						<p class="hero__since">{{ $t('profile_view.member_since', { date: formatDate(user.created_at) }) }}</p>
						<button v-if="user.etherum_adress" type="button" class="wallet" :title="user.etherum_adress" @click="copyWallet">
							<span>{{ shortWallet }}</span>
							<span class="wallet__copy">{{ copied ? $t('profile_view.copied') : $t('profile_view.copy') }}</span>
						</button>
					</div>
				</div>

				<div class="hero__actions">
					<template v-if="isMe">
						<p class="hero__note">{{ $t('profile_view.own_profile') }}</p>
						<router-link to="/app/settings" class="btn-pill">{{ $t('profile_view.edit_profile') }}</router-link>
					</template>
					<template v-else>
						<span v-if="isFriend" class="tag">{{ $t('profile_view.friends') }}</span>
						<button
							v-else
							type="button"
							class="btn-pill"
							:disabled="addingFriend"
							@click="addFriend">
							{{ addingFriend ? $t('profile_view.adding') : $t('profile_view.add_friend') }}
						</button>
						<router-link
							v-if="isFriend"
							:to="`/app/chat?with=${user.id}`"
							class="btn-pill btn-pill--ghost">
							{{ $t('profile_view.message') }}
						</router-link>
					</template>
				</div>

				<dl class="stats">
					<div>
						<dt>{{ $t('profile_view.stat_nfts') }}</dt>
						<dd>{{ nfts.length }}</dd>
					</div>
					<div>
						<dt>{{ $t('profile_view.stat_auctions') }}</dt>
						<dd>{{ auctions.length }}</dd>
					</div>
				</dl>
			</section>

			<!-- Enchères en cours -->
			<section class="block" data-reveal>
				<h2>{{ $t('profile_view.auctions_title') }}</h2>
				<p v-if="!auctions.length" class="empty">{{ $t('profile_view.empty_auctions') }}</p>
				<div v-else class="auction-list">
					<router-link
						v-for="auction in auctions"
						:key="auction.auction_uuid"
						:to="`/auction/${auction.auction_uuid}`"
						class="auction-item">
						<img :src="auction.nft?.image_uri" alt="" loading="lazy" />
						<span class="auction-item__title">{{ auction.nft?.title }}</span>
						<span class="auction-item__bid">
							{{ formatAmount(auction.current_bid || auction.start_price, auction.payment) }}
						</span>
					</router-link>
				</div>
			</section>

			<!-- NFT -->
			<section class="block" data-reveal>
				<h2>{{ $t('profile_view.nfts_title') }}</h2>
				<p v-if="!nfts.length" class="empty">{{ $t('profile_view.empty_nfts') }}</p>
				<div v-else class="nft-grid">
					<div v-for="nft in nfts" :key="nft.id" class="nft" :title="nft.title">
						<img :src="nft.image_uri" :alt="nft.title" loading="lazy" />
						<span>{{ nft.title }}</span>
					</div>
				</div>
			</section>
		</template>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { storeToRefs } from 'pinia';
	import { notify } from '@kyvg/vue3-notification';
	import axios from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';
	import { useReveal } from '@/composables/useReveal';

	const route = useRoute();
	const { t, locale } = useI18n();
	const { me } = storeToRefs(useAuthStore());

	const user = ref({});
	const nfts = ref([]);
	const auctions = ref([]);
	const friendIds = ref([]);
	const loading = ref(true);
	const loadError = ref(false);
	const sessionExpired = ref(false);
	const notFound = ref(false);
	const addingFriend = ref(false);
	const copied = ref(false);

	const root = ref(null);
	useReveal(root, computed(() => !loading.value));

	const isMe = computed(() => user.value.id === me.value?.id);
	const isFriend = computed(() => friendIds.value.includes(user.value.id));
	const fullName = computed(() => [user.value.name, user.value.lastname].filter(Boolean).join(' '));
	const initial = computed(() => (user.value.name ?? '?').charAt(0).toUpperCase());
	const shortWallet = computed(() => {
		const address = user.value.etherum_adress ?? '';
		return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';
	});

	// Photo de profil lue sans risque : sinon l'initiale
	const avatar = computed(() => {
		try {
			const images = JSON.parse(user.value.configuration?.profile_image ?? 'null');
			return images?.[0]?.content ?? null;
		} catch (e) {
			return null;
		}
	});

	const formatDate = (value) =>
		value ? new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(new Date(value)) : '—';

	const formatAmount = (value, payment) => {
		const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(Number(value) || 0);
		return payment === 'ETH' ? `${number} ETH` : `$${number}`;
	};

	const load = async () => {
		const id = route.params.id;
		loading.value = true;
		loadError.value = false;
		notFound.value = false;
		try {
			const [info, friends, allAuctions, allNfts] = await Promise.allSettled([
				axios.get(`/users/info/${id}`),
				axios.get('/users/friends'),
				axios.get('/auction'),
				axios.get('/nft', { params: { perPage: 100 } }),
			]);

			if (info.status === 'rejected') throw info.reason;
			if (!info.value.data?.id) {
				notFound.value = true;
				return;
			}
			user.value = info.value.data;

			friendIds.value = friends.status === 'fulfilled' ? friends.value.data.map((f) => f.id) : [];

			// Listes filtrées côté client sur le propriétaire
			const ownerId = user.value.id;
			auctions.value =
				allAuctions.status === 'fulfilled'
					? (allAuctions.value.data.data?.data ?? []).filter((a) => a.owner_id === ownerId || a.owner?.id === ownerId)
					: [];
			nfts.value =
				allNfts.status === 'fulfilled'
					? (allNfts.value.data.data?.data ?? []).filter((nft) => nft.owner_id === ownerId)
					: [];
		} catch (e) {
			console.error('Profil utilisateur :', e);
			if (e.response?.status === 404) notFound.value = true;
			else {
				loadError.value = true;
				sessionExpired.value = e.response?.status === 401;
			}
		} finally {
			loading.value = false;
		}
	};

	const addFriend = async () => {
		addingFriend.value = true;
		try {
			await axios.post('/users/friends', { friendId: user.value.id });
			friendIds.value = [...friendIds.value, user.value.id];
			notify({ title: t('success.title'), text: t('profile_view.friend_added'), type: 'success' });
		} catch (e) {
			notify({ title: t('error.title'), text: t('error.contact-us'), type: 'error' });
		} finally {
			addingFriend.value = false;
		}
	};

	const copyWallet = async () => {
		try {
			await navigator.clipboard.writeText(user.value.etherum_adress);
			copied.value = true;
			setTimeout(() => (copied.value = false), 2000);
		} catch (e) {
			copied.value = false;
		}
	};

	// En quittant la page, l'identifiant disparaît : on ne recharge que si la route en a un
	watch(
		() => route.params.id,
		(id) => {
			if (id) load();
		}
	);
	onMounted(load);
</script>

<style scoped>
	.user-view {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding-bottom: 40px;
		color: #0d104d;
	}

	.user-view [data-reveal] {
		opacity: 0;
		transform: translateY(18px);
		transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.user-view [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	/* Carte d'identité */
	.hero {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 22px;
		padding: 30px 34px;
		border-radius: 20px;
		background:
			radial-gradient(circle at 90% 0%, rgba(255, 175, 2, 0.16), transparent 45%),
			linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		box-shadow: 0 20px 44px rgba(13, 16, 77, 0.22);
	}

	.hero__identity {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.hero__avatar,
	.hero__avatar-img {
		width: 84px;
		height: 84px;
		flex-shrink: 0;
		border-radius: 50%;
	}

	.hero__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #ffaf02;
		color: #0d104d;
		font-size: 34px;
		font-weight: 700;
	}

	.hero__avatar-img {
		object-fit: cover;
		border: 3px solid rgba(255, 255, 255, 0.3);
	}

	.hero h1 {
		margin: 0 0 4px;
		font-size: 1.6rem;
		font-weight: 600;
		color: #ffffff;
	}

	.hero__username {
		margin: 0 0 4px;
		color: #ffaf02;
		font-weight: 600;
	}

	.hero__since {
		margin: 0 0 10px;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
	}

	.wallet {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 4px 12px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.85);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.wallet:hover,
	.wallet:focus-visible {
		border-color: #ffaf02;
		outline: none;
	}

	.wallet__copy {
		color: #ffaf02;
		font-weight: 600;
	}

	.hero__actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12px;
	}

	.hero__note {
		margin: 0;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.75);
	}

	.tag {
		padding: 6px 14px;
		border-radius: 999px;
		background: rgba(15, 157, 88, 0.2);
		color: #5ee0a0;
		font-size: 13px;
		font-weight: 600;
	}

	.stats {
		display: flex;
		gap: 26px;
		margin: 0;
		width: 100%;
	}

	.stats div {
		padding-top: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		min-width: 120px;
	}

	.stats dt {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.65);
	}

	.stats dd {
		margin: 2px 0 0;
		font-size: 1.4rem;
		font-weight: 700;
		color: #ffffff;
	}

	.btn-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 20px;
		border: 0;
		border-radius: 999px;
		background: #ffaf02;
		color: #0d104d;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
	}

	.btn-pill:hover:not(:disabled),
	.btn-pill:focus-visible {
		background: #ffd166;
		transform: translateY(-1px);
		outline: none;
	}

	.btn-pill:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.btn-pill--ghost {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
	}

	.btn-pill--ghost:hover,
	.btn-pill--ghost:focus-visible {
		background: rgba(255, 255, 255, 0.2);
		color: #ffffff;
	}

	/* Blocs */
	.block {
		padding: 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
	}

	.block h2 {
		margin: 0 0 16px;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.empty {
		margin: 0;
		color: #7a7f96;
	}

	.auction-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.auction-item {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		align-items: center;
		gap: 14px;
		padding: 10px 14px;
		border-radius: 14px;
		background: #f6f7fb;
		color: #0d104d;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.auction-item:hover,
	.auction-item:focus-visible {
		background: #fff8e6;
		outline: none;
	}

	.auction-item img {
		width: 56px;
		height: 56px;
		object-fit: cover;
		border-radius: 10px;
	}

	.auction-item__title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
	}

	.auction-item__bid {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.nft-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 14px;
	}

	.nft {
		position: relative;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 14px;
		background: #f1f2f7;
	}

	.nft img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.nft:hover img {
		transform: scale(1.05);
	}

	.nft span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 16px 10px 8px;
		background: linear-gradient(transparent, rgba(13, 16, 77, 0.85));
		color: #ffffff;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-view__state {
		padding: 40px 0;
		text-align: center;
	}

	.user-view__state h1 {
		margin: 0 0 16px;
		font-size: 1.5rem;
	}

	.user-view__state p {
		color: #7a7f96;
	}

	.skel {
		border-radius: 20px;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: user-shimmer 1.4s linear infinite;
	}

	.skel--hero {
		height: 220px;
	}

	.skel--grid {
		height: 300px;
	}

	@keyframes user-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 767px) {
		.hero {
			padding: 24px 22px;
		}
		.hero__actions {
			align-items: flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.user-view [data-reveal],
		.skel,
		.nft img {
			transition: none;
			animation: none;
		}
	}
</style>
