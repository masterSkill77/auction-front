<template>
	<div class="my-auctions">
		<header class="my-auctions__head">
			<h1>{{ $t('menu.myauctions') }}</h1>
			<p>{{ $t('auctions_page.subtitle') }}</p>
		</header>

		<!-- Compteurs -->
		<section class="my-auctions__stats" aria-label="Résumé">
			<div class="stat">
				<strong>{{ ownAuctions.length }}</strong>
				<span>{{ $t('auctions_page.stat_on_sale') }}</span>
			</div>
			<div class="stat">
				<strong>{{ activeCount }}</strong>
				<span>{{ $t('auctions_page.stat_active') }}</span>
			</div>
			<div class="stat">
				<strong>{{ wonAuctions.length }}</strong>
				<span>{{ $t('auctions_page.stat_won') }}</span>
			</div>
			<div class="stat" :class="{ 'is-alert': toPayCount > 0 }">
				<strong>{{ toPayCount }}</strong>
				<span>{{ $t('auctions_page.stat_to_pay') }}</span>
			</div>
		</section>

		<p v-if="error" class="my-auctions__state" role="alert">{{ $t('auctions_page.error') }}</p>

		<template v-else>
			<!-- Mises en vente -->
			<section class="block">
				<h2>{{ $t('auctions_page.section_sale') }}</h2>
				<div v-if="loading" class="cards">
					<div v-for="n in 3" :key="n" class="card card--skeleton"></div>
				</div>
				<div v-else-if="!ownAuctions.length" class="empty">
					<p>{{ $t('auctions_page.empty_sale') }}</p>
					<router-link to="/app/create/auction" class="btn-pill">
						{{ $t('auctions_page.create_cta') }}
					</router-link>
				</div>
				<div v-else class="cards">
					<article v-for="auction in ownAuctions" :key="auction.auction_uuid" class="card">
						<img :src="auction.nft?.image_uri" alt="" loading="lazy" />
						<div class="card__body">
							<div class="card__top">
								<h3>{{ auction.nft?.title }}</h3>
								<span class="badge" :class="`badge--${statusOf(auction)}`">
									{{ $t(`auctions_page.status_${statusOf(auction)}`) }}
								</span>
							</div>
							<dl>
								<div>
									<dt>{{ $t('auctions_page.current') }}</dt>
									<dd>{{ formatAmount(auction.current_bid || auction.start_price, auction.payment) }}</dd>
								</div>
								<div>
									<dt>{{ $t('auctions_page.ends') }}</dt>
									<dd>{{ formatDate(auction.end_date) }}</dd>
								</div>
							</dl>
							<router-link :to="`/auction/${auction.auction_uuid}`" class="card__link">
								{{ $t('auctions_page.view') }} →
							</router-link>
						</div>
					</article>
				</div>
			</section>

			<!-- Enchères gagnées -->
			<section class="block">
				<h2>{{ $t('auctions_page.section_won') }}</h2>
				<div v-if="loading" class="cards">
					<div v-for="n in 2" :key="n" class="card card--skeleton"></div>
				</div>
				<p v-else-if="!wonAuctions.length" class="empty-line">{{ $t('auctions_page.empty_won') }}</p>
				<div v-else class="cards">
					<article v-for="auction in wonAuctions" :key="auction.auction_uuid" class="card">
						<img :src="auction.nft?.image_uri" alt="" loading="lazy" />
						<div class="card__body">
							<div class="card__top">
								<h3>{{ auction.nft?.title }}</h3>
								<span class="badge" :class="`badge--${statusOf(auction)}`">
									{{ $t(`auctions_page.status_${statusOf(auction)}`) }}
								</span>
							</div>
							<dl>
								<div>
									<dt>{{ $t('auctions_page.won_for') }}</dt>
									<dd>{{ formatAmount(auction.current_bid, auction.payment) }}</dd>
								</div>
							</dl>
							<div class="card__actions">
								<router-link
									v-if="!auction.is_paid"
									:to="`/app/paiement/${auction.auction_uuid}`"
									class="btn-pill">
									{{ $t('auctions_page.pay') }}
								</router-link>
								<router-link :to="`/auction/${auction.auction_uuid}`" class="card__link">
									{{ $t('auctions_page.view') }} →
								</router-link>
							</div>
						</div>
					</article>
				</div>
			</section>

			<!-- Mes offres -->
			<section class="block">
				<h2>{{ $t('auctions_page.section_bids') }}</h2>
				<div v-if="loading" class="rows">
					<div v-for="n in 3" :key="n" class="row row--skeleton"></div>
				</div>
				<p v-else-if="!bids.length" class="empty-line">{{ $t('auctions_page.empty_bids') }}</p>
				<ul v-else class="rows">
					<li v-for="bid in bids" :key="bid.id">
						<router-link :to="`/auction/${bid.auction?.auction_uuid}`" class="row">
							<span class="row__title">{{ bid.auction?.nft?.title ?? bid.auction?.auction_uuid }}</span>
							<span class="row__amount">
								{{ formatAmount(bid.bid_amount, bid.auction?.payment) }}
							</span>
						</router-link>
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
	import { useAuctionStore } from '@/stores/auction';
	import { useBidStore } from '@/stores/bid';

	const ownAuctions = ref([]);
	const wonAuctions = ref([]);
	const bids = ref([]);
	const loading = ref(true);
	const error = ref(false);

	const hasEnded = (auction) =>
		auction.status == 1 || new Date(auction.end_date).getTime() <= Date.now();

	// Statut affiché : à payer et payée pour les gagnées, sinon en cours ou terminée
	const statusOf = (auction) => {
		if (wonAuctions.value.includes(auction)) return auction.is_paid ? 'paid' : 'to_pay';
		return hasEnded(auction) ? 'ended' : 'active';
	};

	const activeCount = computed(() => ownAuctions.value.filter((a) => !hasEnded(a)).length);
	const toPayCount = computed(() => wonAuctions.value.filter((a) => !a.is_paid).length);

	const formatAmount = (value, payment) => {
		const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
			Number(value) || 0
		);
		return payment === 'ETH' ? `${number} ETH` : `$${number}`;
	};

	const formatDate = (value) =>
		value
			? new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
					new Date(value)
				)
			: '—';

	onMounted(async () => {
		try {
			const [mine, myBids] = await Promise.all([
				useAuctionStore().fetchMyAuctions().then(() => useAuctionStore().myAuctions),
				useBidStore().getMyBids(),
			]);
			ownAuctions.value = mine.own_auctions ?? [];
			wonAuctions.value = mine.win_auctions ?? [];
			bids.value = Array.isArray(myBids) ? myBids : [];
		} catch (e) {
			error.value = true;
		} finally {
			loading.value = false;
		}
	});
</script>

<style scoped>
	.my-auctions {
		max-width: 1100px;
		margin: 0 auto;
		padding: 8px 0 60px;
		color: #0d104d;
	}

	.my-auctions__head {
		margin-bottom: 24px;
	}

	.my-auctions__head h1 {
		margin: 0 0 6px;
		font-size: 2rem;
		font-weight: 600;
	}

	.my-auctions__head p {
		margin: 0;
		color: #7a7f96;
	}

	.my-auctions__stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 36px;
	}

	.stat {
		padding: 18px 20px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 16px;
		box-shadow: 0 8px 20px rgba(13, 16, 77, 0.05);
	}

	.stat strong {
		display: block;
		font-size: 1.6rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.stat span {
		font-size: 13px;
		color: #7a7f96;
	}

	.stat.is-alert {
		border-color: rgba(255, 175, 2, 0.6);
		background: #fff8e6;
	}

	.block {
		margin-bottom: 40px;
	}

	.block h2 {
		margin: 0 0 16px;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 18px;
	}

	.card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
		transition: transform 0.25s ease, border-color 0.25s ease;
	}

	.card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 175, 2, 0.6);
	}

	.card img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		background: #f1f2f7;
	}

	.card__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 12px;
		padding: 16px 18px 18px;
	}

	.card__top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.card__top h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.badge {
		flex-shrink: 0;
		padding: 3px 10px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge--active {
		background: #e7f7ee;
		color: #0f9d58;
	}
	.badge--ended {
		background: #f1f2f7;
		color: #5a5f78;
	}
	.badge--to_pay {
		background: #fff3d6;
		color: #a86a00;
	}
	.badge--paid {
		background: #e7f7ee;
		color: #0f9d58;
	}

	.card dl {
		display: grid;
		gap: 8px;
		margin: 0;
	}

	.card dl div {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 13px;
	}

	.card dt {
		color: #7a7f96;
	}

	.card dd {
		margin: 0;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.card__actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: auto;
	}

	.card__link {
		font-size: 13px;
		font-weight: 600;
		color: #28408b;
		text-decoration: none;
	}

	.card__link:hover {
		color: #ffaf02;
	}

	.card--skeleton {
		min-height: 260px;
		border: 0;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: auctions-shimmer 1.4s linear infinite;
	}

	.btn-pill {
		display: inline-block;
		padding: 8px 18px;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.btn-pill:hover,
	.btn-pill:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		outline: none;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 24px;
		background: #ffffff;
		border: 1px dashed #dfe2ee;
		border-radius: 16px;
	}

	.empty p,
	.empty-line {
		margin: 0;
		color: #7a7f96;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 18px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 14px;
		color: #0d104d;
		text-decoration: none;
		transition: background-color 0.2s ease, border-color 0.2s ease;
	}

	.row:hover {
		background: #fff8e6;
		border-color: rgba(255, 175, 2, 0.6);
	}

	.row__title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
	}

	.row__amount {
		flex-shrink: 0;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.row--skeleton {
		height: 52px;
		border: 0;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: auctions-shimmer 1.4s linear infinite;
	}

	.my-auctions__state {
		padding: 40px 0;
		text-align: center;
		color: #7a7f96;
	}

	@keyframes auctions-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 767px) {
		.my-auctions__stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.card--skeleton,
		.row--skeleton {
			transition: none;
			animation: none;
		}
	}
</style>
