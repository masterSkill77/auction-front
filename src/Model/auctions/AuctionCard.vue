<template>
	<section class="auction" ref="root">
		<div v-if="loading" class="container auction__skeleton" aria-hidden="true">
			<div class="skel skel--media"></div>
			<div class="skel skel--text"></div>
		</div>

		<div v-else-if="notFound" class="container auction__state">
			<h1>{{ $t('auction_page.not_found') }}</h1>
			<router-link to="/auctions" class="btn-pill">{{ $t('auction_page.back') }}</router-link>
		</div>

		<div v-else-if="loadError" class="container auction__state" role="alert">
			<p>{{ $t('auction_page.load_error') }}</p>
		</div>

		<template v-else>
			<div class="container auction__grid">
				<!-- Visuel -->
				<figure class="auction__media" data-reveal>
					<img :src="auction.nft?.image_uri" :alt="auction.nft?.title ?? ''" />
				</figure>

				<!-- Informations et mise -->
				<div class="auction__panel" data-reveal>
					<div class="auction__status">
						<span class="badge" :class="`badge--${stateKey}`">{{ $t(`auction_page.state_${stateKey}`) }}</span>
					</div>

					<h1>{{ auction.nft?.title }}</h1>
					<p class="auction__desc">{{ auction.nft?.description }}</p>

					<div class="price">
						<span class="price__label">
							{{ auction.current_bid > 0 ? $t('auction_page.current_bid') : $t('auction_page.start_price') }}
						</span>
						<strong>{{ formatAmount(displayPrice) }}</strong>
						<small v-if="auction.current_bid > 0">
							{{ $t('auction_page.start_price') }} : {{ formatAmount(auction.start_price) }}
						</small>
					</div>

					<!-- Compte à rebours -->
					<div v-if="isActive" class="timer" role="timer" :aria-label="$t('auction_page.time_left')">
						<span class="timer__label">{{ $t('auction_page.time_left') }}</span>
						<div class="timer__units">
							<span v-for="unit in countdownUnits" :key="unit.key" class="timer__unit">
								<strong>{{ unit.value }}</strong>
								<small>{{ $t(`auction_page.unit_${unit.key}`) }}</small>
							</span>
						</div>
					</div>
					<p v-else class="ended-note">{{ $t('auction_page.ended') }}</p>

					<!-- Mise -->
					<form v-if="canBid" class="bid" novalidate @submit.prevent="placeBid">
						<label class="bid__field" :class="{ 'is-invalid': bidError }">
							<span>{{ $t('auction_page.your_bid') }}</span>
							<div class="bid__input">
								<span>{{ currency }}</span>
								<input v-model="bidAmount" type="number" :min="minBid" step="any" />
							</div>
							<small class="bid__hint">{{ $t('auction_page.min_bid', { amount: formatAmount(minBid) }) }}</small>
							<small v-if="bidError" class="bid__error">{{ bidError }}</small>
						</label>
						<button type="submit" class="btn-pill btn-pill--large" :disabled="submitting">
							<span v-if="submitting" class="spinner" aria-hidden="true"></span>
							{{ submitting ? $t('auction_page.sending') : $t('auction_page.place_bid') }}
						</button>
					</form>
					<p v-else-if="isOwner" class="note">{{ $t('auction_page.you_are_seller') }}</p>
					<p v-else-if="isActive && !isLogged" class="note">
						<router-link to="/login">{{ $t('auction_page.login_to_bid') }}</router-link>
					</p>

					<!-- Vendeur -->
					<dl class="facts">
						<div>
							<dt>{{ $t('auction_page.seller') }}</dt>
							<dd>
								{{ sellerName }}
								<router-link
									v-if="!isOwner && auction.owner?.id"
									:to="`/app/user/${auction.owner.id}`"
									class="facts__link">
									{{ $t('auction_page.view_profile') }}
								</router-link>
							</dd>
						</div>
						<div>
							<dt>{{ $t('auction_page.start') }}</dt>
							<dd>{{ formatDate(auction.start_date) }}</dd>
						</div>
						<div>
							<dt>{{ $t('auction_page.end') }}</dt>
							<dd>{{ formatDate(auction.end_date) }}</dd>
						</div>
						<div>
							<dt>{{ $t('auction_page.payment') }}</dt>
							<dd>{{ auction.payment === 'ETH' ? 'ETH' : 'USD' }}</dd>
						</div>
					</dl>
				</div>
			</div>

			<!-- Historique des offres -->
			<section class="container bids" data-reveal>
				<h2>{{ $t('auction_page.bids_title') }}</h2>
				<p v-if="!sortedBids.length" class="note">{{ $t('auction_page.no_bids') }}</p>
				<ol v-else class="bids__list">
					<li v-for="bid in sortedBids" :key="bid.id" class="bid-row">
						<span class="bid-row__avatar" aria-hidden="true">{{ initialOf(bid.bidder) }}</span>
						<div class="bid-row__who">
							<strong>{{ bidderName(bid.bidder) }}</strong>
							<span v-if="bid.bidder?.id === me.id" class="tag">{{ $t('auction_page.you') }}</span>
							<small>{{ relativeTime(bid.created_at) }}</small>
						</div>
						<span class="bid-row__amount">{{ formatAmount(bid.bid_amount) }}</span>
					</li>
				</ol>
			</section>
		</template>
	</section>
</template>

<script setup>
	import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { storeToRefs } from 'pinia';
	import { notify } from '@kyvg/vue3-notification';
	import { useAuctionStore } from '@/stores/auction';
	import { useAuthStore } from '@/stores/auth';
	import { useBidStore } from '@/stores/bid';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	const DOLLAR_PAYMENTS = ['USDT', 'USD'];

	const route = useRoute();
	const { t, locale } = useI18n();
	const { me, isAuthenticated } = storeToRefs(useAuthStore());

	const root = ref(null);
	const auctionId = route.params.auctionId;
	const auction = ref({ nft: {}, owner: {}, bids: [] });
	const loading = ref(true);
	const loadError = ref(false);
	const notFound = ref(false);
	const bidAmount = ref('');
	const bidError = ref('');
	const submitting = ref(false);
	const now = ref(Date.now());

	useReveal(root, computed(() => !loading.value));

	let ticker = null;
	const startTicker = () => {
		ticker = setInterval(() => (now.value = Date.now()), 1000);
	};

	const endTime = computed(() => new Date(auction.value.end_date).getTime());
	const hasEnded = computed(() => auction.value.status == 1 || endTime.value <= now.value);
	const isActive = computed(() => !hasEnded.value);
	const isOwner = computed(() => auction.value.owner?.id === me.value?.id);
	const isLogged = computed(() => isAuthenticated.value);
	const canBid = computed(() => isActive.value && isLogged.value && !isOwner.value);

	const stateKey = computed(() => (isActive.value ? 'active' : 'ended'));
	const currency = computed(() => (DOLLAR_PAYMENTS.includes(auction.value.payment) || !auction.value.payment ? 'CAD' : auction.value.payment));
	const displayPrice = computed(() =>
		auction.value.current_bid > 0 ? auction.value.current_bid : auction.value.start_price
	);
	// Prochain montant acceptable : au-dessus de l'offre actuelle, ou le prix de départ
	const minBid = computed(() => {
		const current = Number(auction.value.current_bid) || 0;
		return current > 0 ? current + 1 : Number(auction.value.start_price) || 0;
	});
	const sellerName = computed(() =>
		[auction.value.owner?.name, auction.value.owner?.lastname].filter(Boolean).join(' ') || '—'
	);

	const sortedBids = computed(() =>
		[...(auction.value.bids ?? [])].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)
	);

	const countdownUnits = computed(() => {
		const total = Math.max(0, Math.floor((endTime.value - now.value) / 1000));
		const days = Math.floor(total / 86400);
		const hours = Math.floor((total % 86400) / 3600);
		const minutes = Math.floor((total % 3600) / 60);
		const seconds = total % 60;
		return [
			{ key: 'day', value: days },
			{ key: 'hour', value: hours },
			{ key: 'minute', value: minutes },
			{ key: 'second', value: seconds },
		];
	});

	const formatAmount = (value) => {
		const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(Number(value) || 0);
		return currency.value === 'ETH' ? `${number} ETH` : `${number} CAD`;
	};

	const formatDate = (value) =>
		value
			? new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
			: '—';

	const relativeTime = (value) => {
		const diff = (new Date(value).getTime() - Date.now()) / 1000;
		const formatter = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' });
		const units = [
			['day', 86400],
			['hour', 3600],
			['minute', 60],
		];
		for (const [unit, seconds] of units) {
			if (Math.abs(diff) >= seconds) return formatter.format(Math.round(diff / seconds), unit);
		}
		return formatter.format(0, 'minute');
	};

	const bidderName = (bidder) => [bidder?.name, bidder?.lastname].filter(Boolean).join(' ') || '—';
	const initialOf = (bidder) => (bidder?.name ?? '?').charAt(0).toUpperCase();

	const placeBid = async () => {
		bidError.value = '';
		const amount = Number(bidAmount.value);
		if (!amount || amount < minBid.value) {
			bidError.value = t('auction_page.bid_too_low');
			return;
		}

		submitting.value = true;
		try {
			await useBidStore().makeBid({
				bidder_id: me.value.id,
				bid_amount: amount,
				auction_id: auctionId,
			});
			notify({ title: t('success.title'), text: t('success.bid'), type: 'success' });
			await refresh();
		} catch (error) {
			const code = error.response?.data?.error;
			notify({
				title: t('error.title'),
				text: code ? t(`error.${code}`) : t('error.contact-us'),
				type: 'error',
			});
		} finally {
			submitting.value = false;
		}
	};

	const refresh = async () => {
		const fresh = await useAuctionStore().fetchAuction(auctionId);
		auction.value = fresh;
		bidAmount.value = '';
	};

	watch(minBid, (value) => {
		if (!bidAmount.value) bidAmount.value = value || '';
	});

	let pollTimer = null;
	// Rafraîchit les offres sans toucher au montant en cours de saisie
	const refreshQuietly = async () => {
		if (hasEnded.value) return;
		try {
			auction.value = await useAuctionStore().fetchAuction(auctionId);
		} catch (error) {
			// On garde l'affichage actuel ; la prochaine tentative réessaiera
		}
	};

	onMounted(async () => {
		// Le store démarre avec le loader actif : cette page le retire elle-même
		useLoadingStore().setLoading(false);
		startTicker();
		try {
			await refresh();
			bidAmount.value = minBid.value || '';
		} catch (error) {
			if (error.response?.status === 404) notFound.value = true;
			else loadError.value = true;
		} finally {
			loading.value = false;
		}

		pollTimer = setInterval(refreshQuietly, 15000);

		// Mise à jour en direct quand l'enchère se termine (si le temps réel est disponible)
		window.Echo?.channel('auction').listen('.auction-done', () => refresh());
	});

	onBeforeUnmount(() => {
		clearInterval(ticker);
		clearInterval(pollTimer);
		window.Echo?.leave?.('auction');
	});
</script>

<style scoped>
	.auction {
		padding: 40px 0 60px;
		background: #f6f7fb;
		color: #0d104d;
	}

	.auction [data-reveal] {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.auction [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.auction__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: start;
	}

	.auction__media {
		position: sticky;
		top: 96px;
		margin: 0;
	}

	.auction__media img {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 22px;
		background: #ffffff;
		box-shadow: 0 24px 56px rgba(13, 16, 77, 0.14);
	}

	.auction__panel {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.auction__panel h1 {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		font-weight: 600;
		line-height: 1.2;
	}

	.auction__desc {
		margin: 0;
		font-size: 15px;
		line-height: 1.75;
		color: #4a4f6a;
		white-space: pre-line;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
	}

	.badge--active {
		background: #e7f7ee;
		color: #0f9d58;
	}

	.badge--ended {
		background: #f1f2f7;
		color: #5a5f78;
	}

	/* Prix */
	.price {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 22px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
	}

	.price__label {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #7a7f96;
	}

	.price strong {
		font-size: 2.2rem;
		font-weight: 700;
		color: #0d104d;
		font-variant-numeric: tabular-nums;
	}

	.price small {
		font-size: 13px;
		color: #7a7f96;
	}

	/* Compte à rebours */
	.timer {
		padding: 18px 22px;
		background: #0d104d;
		border-radius: 18px;
		color: #ffffff;
	}

	.timer__label {
		display: block;
		margin-bottom: 12px;
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}

	.timer__units {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
	}

	.timer__unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 6px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.07);
	}

	.timer__unit strong {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: #ffaf02;
	}

	.timer__unit small {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.7);
	}

	.ended-note,
	.note {
		margin: 0;
		font-size: 14px;
		color: #7a7f96;
	}

	.note a {
		color: #28408b;
		font-weight: 600;
	}

	/* Mise */
	.bid {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 22px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
	}

	.bid__field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bid__field > span {
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
	}

	.bid__input {
		display: flex;
		align-items: center;
		border: 1px solid #dfe2ee;
		border-radius: 12px;
		background: #fafbfd;
		overflow: hidden;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.bid__input:focus-within {
		border-color: #ffaf02;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.bid__input > span {
		padding: 12px 14px;
		background: #f1f2f7;
		font-weight: 600;
		color: #28408b;
	}

	.bid__input input {
		flex: 1;
		min-width: 0;
		padding: 12px 14px;
		border: 0;
		background: transparent;
		font-size: 16px;
		color: #0d104d;
		outline: none;
	}

	.bid__hint {
		font-size: 12px;
		color: #9aa0b8;
	}

	.bid__error {
		font-size: 12px;
		font-weight: 600;
		color: #d93025;
	}

	.bid__field.is-invalid .bid__input {
		border-color: #d93025;
	}

	.btn-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 9px 18px;
		border: 0;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
	}

	.btn-pill--large {
		justify-content: center;
		padding: 14px 24px;
		font-size: 15px;
		background: linear-gradient(135deg, #0d104d, #28408b);
		box-shadow: 0 12px 26px rgba(13, 16, 77, 0.25);
	}

	.btn-pill:hover:not(:disabled),
	.btn-pill:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		transform: translateY(-2px);
		outline: none;
	}

	.btn-pill:disabled {
		opacity: 0.75;
		cursor: wait;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: auction-spin 0.8s linear infinite;
	}

	/* Vendeur */
	.facts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px 24px;
		margin: 0;
		padding: 22px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
	}

	.facts dt {
		font-size: 12px;
		color: #7a7f96;
		margin-bottom: 2px;
	}

	.facts dd {
		margin: 0;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.facts__link {
		margin-left: 8px;
		font-size: 12px;
		color: #28408b;
	}

	/* Historique */
	.bids {
		margin-top: 56px;
	}

	.bids h2 {
		margin: 0 0 18px;
		font-size: 1.4rem;
		font-weight: 600;
	}

	.bids__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bid-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 16px;
	}

	.bid-row__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: 50%;
		background: linear-gradient(135deg, #0d104d, #28408b);
		color: #ffaf02;
		font-weight: 600;
	}

	.bid-row__who {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 10px;
		min-width: 0;
	}

	.bid-row__who small {
		width: 100%;
		font-size: 12px;
		color: #7a7f96;
	}

	.tag {
		padding: 2px 8px;
		border-radius: 999px;
		background: #fff3d6;
		color: #a86a00;
		font-size: 11px;
		font-weight: 600;
	}

	.bid-row__amount {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	/* États */
	.auction__state {
		padding: 80px 0;
		text-align: center;
	}

	.auction__state h1 {
		margin: 0 0 18px;
		font-size: 1.6rem;
	}

	.auction__state p {
		color: #7a7f96;
	}

	.auction__skeleton {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
	}

	.skel {
		border-radius: 22px;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: auction-shimmer 1.4s linear infinite;
	}

	.skel--media {
		aspect-ratio: 1 / 1;
	}

	.skel--text {
		min-height: 420px;
	}

	@keyframes auction-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes auction-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 991px) {
		.auction__grid,
		.auction__skeleton {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.auction__media {
			position: static;
		}
	}

	@media (max-width: 575px) {
		.timer__units {
			grid-template-columns: repeat(2, 1fr);
		}
		.facts {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.auction [data-reveal],
		.skel,
		.spinner,
		.btn-pill {
			transition: none;
			animation: none;
		}
	}
</style>
