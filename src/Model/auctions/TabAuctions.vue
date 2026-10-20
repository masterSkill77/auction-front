<template>
	<section class="listing" ref="root">
		<header class="listing__hero">
			<div class="container">
				<h1>{{ $t('auctions_list.title') }}</h1>
				<p>{{ $t('auctions_list.subtitle') }}</p>
				<span class="listing__count" v-if="!loading && !error">
					{{ $t('auctions_list.total', { count: total }) }}
				</span>
			</div>
		</header>

		<div class="container listing__body">
			<!-- Barre de filtres et de tri -->
			<div class="toolbar" v-if="!error">
				<div class="chips" role="group" :aria-label="$t('auctions_list.filter_label')">
					<button
						v-for="filter in FILTERS"
						:key="filter.value"
						type="button"
						class="chip"
						:class="{ 'is-active': activeFilter === filter.value }"
						:aria-pressed="activeFilter === filter.value"
						@click="activeFilter = filter.value">
						{{ $t(filter.label) }}
					</button>
				</div>
				<label class="sort">
					<span>{{ $t('auctions_list.sort_label') }}</span>
					<select v-model="sortBy">
						<option v-for="option in SORTS" :key="option.value" :value="option.value">
							{{ $t(option.label) }}
						</option>
					</select>
				</label>
			</div>

			<p v-if="error" class="listing__state" role="alert">
				{{ $t('auctions_list.error') }}
				<button type="button" class="link" @click="load">{{ $t('auctions_list.retry') }}</button>
			</p>

			<div v-else-if="loading" class="grid" aria-hidden="true">
				<div v-for="n in 8" :key="n" class="card card--skeleton"></div>
			</div>

			<p v-else-if="!items.length" class="listing__state">{{ $t('auctions_list.empty') }}</p>

			<p v-else-if="!visible.length" class="listing__state">{{ $t('auctions_list.empty_filter') }}</p>

			<div v-else class="grid">
				<article v-for="auction in visible" :key="auction.auction_uuid" class="card" data-reveal>
					<div class="card__media">
						<img :src="auction.nft?.image_uri" :alt="auction.nft?.title ?? ''" loading="lazy" />
						<span class="badge" :class="isEnded(auction) ? 'badge--ended' : 'badge--active'">
							{{ isEnded(auction) ? $t('auctions_list.status_ended') : $t('auctions_list.status_active') }}
						</span>
						<span class="pay">{{ auction.payment === 'ETH' ? 'ETH' : 'USD' }}</span>
					</div>

					<div class="card__body">
						<h2>{{ auction.nft?.title }}</h2>
						<p class="card__desc">{{ auction.nft?.description }}</p>

						<div class="card__price">
							<div>
								<span>{{ $t('auctions_list.current_bid') }}</span>
								<strong>{{ formatAmount(auction.current_bid || auction.start_price, auction.payment) }}</strong>
							</div>
							<div class="card__time" :class="{ 'is-ended': isEnded(auction) }">
								{{ isEnded(auction) ? $t('auctions_list.ended_label') : formatRemaining(auction.end_date) }}
							</div>
						</div>

						<router-link :to="`/auction/${auction.auction_uuid}`" class="btn-pill">
							{{ $t('auctions_list.view') }}
						</router-link>
					</div>
				</article>
			</div>

			<nav v-if="!loading && !error && lastPage > 1" class="pagination" :aria-label="$t('auctions_list.pagination')">
				<button type="button" class="page-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
					←
				</button>
				<button
					v-for="page in pageNumbers"
					:key="page"
					type="button"
					class="page-btn"
					:class="{ 'is-active': page === currentPage }"
					:aria-current="page === currentPage ? 'page' : undefined"
					:disabled="typeof page !== 'number'"
					@click="changePage(page)">
					{{ page }}
				</button>
				<button type="button" class="page-btn" :disabled="currentPage >= lastPage" @click="changePage(currentPage + 1)">
					→
				</button>
			</nav>
		</div>
	</section>
</template>

<script setup>
	import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { storeToRefs } from 'pinia';
	import { useAuctionStore } from '@/stores/auction';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	const FILTERS = [
		{ value: 'all', label: 'auctions_list.filter_all' },
		{ value: 'active', label: 'auctions_list.filter_active' },
	];
	const SORTS = [
		{ value: 'ending', label: 'auctions_list.sort_ending' },
		{ value: 'highest', label: 'auctions_list.sort_highest' },
		{ value: 'lowest', label: 'auctions_list.sort_lowest' },
	];

	const { t } = useI18n();
	const auctionStore = useAuctionStore();
	const { auctions } = storeToRefs(auctionStore);

	const root = ref(null);
	const loading = ref(true);
	const error = ref(false);
	const activeFilter = ref('all');
	const sortBy = ref('ending');
	const now = ref(Date.now());
	let ticker = null;

	const ready = computed(() => !loading.value);
	useReveal(root, ready);

	const items = computed(() => auctions.value?.data ?? []);
	const currentPage = computed(() => auctions.value?.current_page ?? 1);
	const lastPage = computed(() => auctions.value?.last_page ?? 1);
	// Numéros de page affichés : au plus 7, autour de la page courante
	const pageNumbers = computed(() => {
		const count = lastPage.value;
		if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
		const start = Math.min(Math.max(currentPage.value - 2, 1), count - 4);
		return [1, ...(start > 2 ? ['…'] : []), ...Array.from({ length: 5 }, (_, i) => start + i).filter((n) => n > 1 && n < count), count];
	});
	const total = computed(() => auctions.value?.total ?? items.value.length);

	const isEnded = (auction) =>
		auction.status == 1 || new Date(auction.end_date).getTime() <= now.value;

	const amountOf = (auction) => Number(auction.current_bid || auction.start_price) || 0;

	// Filtre et tri appliqués à la page chargée
	const visible = computed(() => {
		let list = items.value.filter((auction) => {
			if (activeFilter.value === 'active') return !isEnded(auction);
			if (activeFilter.value === 'ended') return isEnded(auction);
			return true;
		});
		list = [...list];
		if (sortBy.value === 'ending') {
			list.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
		} else if (sortBy.value === 'highest') {
			list.sort((a, b) => amountOf(b) - amountOf(a));
		} else {
			list.sort((a, b) => amountOf(a) - amountOf(b));
		}
		return list;
	});

	const formatAmount = (value, payment) => {
		const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(Number(value) || 0);
		return payment === 'ETH' ? `${number} ETH` : `$${number}`;
	};

	// Temps restant en forme compacte : « 2 j 3 h », « 3 h 5 min », « 42 min »
	const formatRemaining = (endDate) => {
		const seconds = Math.max(0, Math.floor((new Date(endDate).getTime() - now.value) / 1000));
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (days > 0) return `${days} ${t('auctions_list.unit_day')} ${hours} ${t('auctions_list.unit_hour')}`;
		if (hours > 0) return `${hours} ${t('auctions_list.unit_hour')} ${minutes} ${t('auctions_list.unit_minute')}`;
		return `${minutes} ${t('auctions_list.unit_minute')}`;
	};

	const load = async () => {
		loading.value = true;
		error.value = false;
		try {
			await auctionStore.fetchAuctions();
		} catch (e) {
			error.value = true;
		} finally {
			loading.value = false;
		}
	};

	const changePage = async (page) => {
		if (page < 1 || page > lastPage.value || page === currentPage.value) return;
		loading.value = true;
		try {
			await auctionStore.fetchAuctionPage(page);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (e) {
			error.value = true;
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		// Le store démarre avec le loader actif : cette page le retire elle-même
		useLoadingStore().setLoading(false);
		ticker = setInterval(() => (now.value = Date.now()), 30000);
		load();
		// Rafraîchissement quand une enchère se termine (si le temps réel est disponible)
		window.Echo?.channel('auction').listen('.auction-done', () => load());
	});

	onBeforeUnmount(() => {
		clearInterval(ticker);
		window.Echo?.leave?.('auction');
	});
</script>

<style scoped>
	.listing {
		background: #f6f7fb;
		color: #0d104d;
		min-height: 70vh;
	}

	.listing [data-reveal] {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.listing [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	/* Bandeau */
	.listing__hero {
		padding: 72px 0 64px;
		background:
			radial-gradient(circle at 85% 10%, rgba(255, 175, 2, 0.14), transparent 45%),
			linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
	}

	.listing__hero h1 {
		margin: 0 0 10px;
		color: #ffffff;
		font-size: clamp(2rem, 4vw, 2.8rem);
		font-weight: 600;
	}

	.listing__hero p {
		max-width: 620px;
		margin: 0 0 18px;
		color: rgba(255, 255, 255, 0.82);
		line-height: 1.7;
	}

	.listing__count {
		display: inline-block;
		padding: 5px 14px;
		border-radius: 999px;
		background: rgba(255, 175, 2, 0.18);
		color: #ffaf02;
		font-size: 13px;
		font-weight: 600;
	}

	.listing__body {
		padding-top: 32px;
		padding-bottom: 60px;
	}

	/* Filtres */
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 26px;
	}

	.chips {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
	}

	.chip {
		padding: 7px 16px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.chip:hover {
		color: #0d104d;
	}

	.chip.is-active {
		background: #0d104d;
		color: #ffffff;
	}

	.chip:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	.sort {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: #7a7f96;
	}

	.sort select {
		padding: 8px 12px;
		border: 1px solid #dfe2ee;
		border-radius: 10px;
		background: #ffffff;
		font-size: 13px;
		color: #0d104d;
		cursor: pointer;
	}

	/* Grille */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 22px;
	}

	.card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		border-color: rgba(255, 175, 2, 0.6);
		box-shadow: 0 20px 40px rgba(13, 16, 77, 0.12);
	}

	.card__media {
		position: relative;
		aspect-ratio: 4 / 3;
		background: #f1f2f7;
		overflow: hidden;
	}

	.card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.card:hover .card__media img {
		transform: scale(1.05);
	}

	.badge,
	.pay {
		position: absolute;
		top: 12px;
		padding: 4px 11px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
	}

	.badge {
		left: 12px;
	}

	.badge--active {
		background: rgba(231, 247, 238, 0.95);
		color: #0f9d58;
	}

	.badge--ended {
		background: rgba(241, 242, 247, 0.95);
		color: #5a5f78;
	}

	.pay {
		right: 12px;
		background: rgba(13, 16, 77, 0.85);
		color: #ffaf02;
	}

	.card__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 12px;
		padding: 18px 20px 20px;
	}

	.card__body h2 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card__desc {
		margin: 0;
		font-size: 13px;
		line-height: 1.6;
		color: #7a7f96;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card__price {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 10px;
		margin-top: auto;
		padding-top: 12px;
		border-top: 1px solid #eef0f6;
	}

	.card__price span {
		display: block;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #7a7f96;
	}

	.card__price strong {
		font-size: 1.15rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.card__time {
		padding: 4px 10px;
		border-radius: 999px;
		background: #fff3d6;
		color: #a86a00;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
	}

	.card__time.is-ended {
		background: #f1f2f7;
		color: #7a7f96;
	}

	.btn-pill {
		display: block;
		padding: 10px 16px;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
		text-align: center;
		text-decoration: none;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.btn-pill:hover,
	.btn-pill:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		outline: none;
	}

	.card--skeleton {
		min-height: 380px;
		border: 0;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: listing-shimmer 1.4s linear infinite;
	}

	.listing__state {
		padding: 60px 0;
		text-align: center;
		color: #7a7f96;
	}

	.link {
		margin-left: 6px;
		padding: 0;
		border: 0;
		background: none;
		color: #28408b;
		font-weight: 600;
		text-decoration: underline;
		cursor: pointer;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin-top: 40px;
	}

	.page-btn {
		min-width: 40px;
		height: 40px;
		padding: 0 12px;
		border: 1px solid #dfe2ee;
		border-radius: 12px;
		background: #ffffff;
		font-size: 14px;
		font-weight: 600;
		color: #0d104d;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.page-btn:hover:not(:disabled),
	.page-btn:focus-visible {
		border-color: #ffaf02;
		outline: none;
	}

	.page-btn.is-active {
		background: #0d104d;
		border-color: #0d104d;
		color: #ffffff;
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}

	@keyframes listing-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 575px) {
		.listing__hero {
			padding: 52px 0 46px;
		}
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}
		.sort {
			justify-content: space-between;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.listing [data-reveal],
		.card,
		.card__media img,
		.card--skeleton {
			transition: none;
			animation: none;
		}
	}
</style>
