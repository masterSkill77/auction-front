<template>
	<div class="dash-home">
		<!-- Carte de bienvenue -->
		<section class="dash-hero">
			<div class="dash-hero__identity">
				<img v-if="avatar" class="dash-hero__avatar-img" :src="avatar" alt="" />
				<span v-else class="dash-hero__avatar" aria-hidden="true">{{ initial }}</span>
				<div>
					<p class="dash-hero__greeting">{{ $t('dashboard.greeting', { name: fullName }) }}</p>
					<div class="dash-hero__meta">
						<span v-if="pack" class="dash-hero__pack">{{ pack }}</span>
						<router-link v-if="pack" to="/app/packs" class="dash-hero__upgrade">
							{{ $t('dashboard.upgrade') }} →
						</router-link>
					</div>
				</div>
			</div>

			<div class="dash-hero__balance">
				<span class="dash-hero__label">{{ $t('dashboard.balance') }}</span>
				<strong v-if="balanceReady" class="dash-hero__amount">
					{{ formatEth(balance) }} <small>ETH</small>
				</strong>
				<strong v-else-if="balanceError" class="dash-hero__amount dash-hero__amount--muted">
					{{ $t('dashboard.balance_error') }}
				</strong>
				<span v-else class="dash-hero__skeleton" aria-hidden="true"></span>

				<button
					v-if="address"
					type="button"
					class="dash-hero__address"
					:title="address"
					@click="copyAddress">
					<span>{{ shortAddress }}</span>
					<span class="dash-hero__copy">{{ copied ? $t('dashboard.copied') : $t('dashboard.copy') }}</span>
				</button>
			</div>
		</section>

		<!-- Quotas : restant sur le maximum du pack -->
		<section class="dash-stats" :aria-label="$t('dashboard.stats_title')">
			<article v-for="quota in quotas" :key="quota.key" class="dash-stat">
				<span class="dash-stat__icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" v-html="quota.icon"></svg>
				</span>
				<div class="dash-stat__body">
					<div class="dash-stat__value">
						<strong>{{ format(quota.left) }}</strong>
						<span v-if="quota.max">/ {{ format(quota.max) }}</span>
					</div>
					<span class="dash-stat__label">{{ $t(quota.label) }}</span>
					<div v-if="quota.max" class="dash-stat__bar" role="presentation">
						<span :style="{ width: quota.percent + '%' }"></span>
					</div>
				</div>
			</article>
		</section>

		<!-- Enchères et NFT -->
		<section class="dash-lists">
			<article class="dash-card">
				<header class="dash-card__head">
					<h3>{{ $t('dashboard.auctions_title') }}</h3>
					<span v-if="wonCount" class="dash-card__badge">
						{{ $t('dashboard.won', { count: wonCount }) }}
					</span>
				</header>

				<p v-if="auctionsError" class="dash-card__state">{{ $t('dashboard.list_error') }}</p>
				<ul v-else-if="auctionsLoading" class="dash-rows" aria-hidden="true">
					<li v-for="n in 3" :key="n" class="dash-row dash-row--skeleton"></li>
				</ul>
				<p v-else-if="!ownAuctions.length" class="dash-card__state">
					{{ $t('dashboard.empty_auctions') }}
				</p>
				<ul v-else class="dash-rows">
					<li v-for="auction in ownAuctions" :key="auction.id ?? auction.auction_uuid">
						<router-link :to="'/auction/' + auction.auction_uuid" class="dash-row">
							<span class="dash-row__title">{{ auctionTitle(auction) }}</span>
							<span class="dash-row__side">
								<strong>{{ formatEth(auction.current_bid ?? auction.start_price) }} ETH</strong>
								<small>{{ $t('dashboard.ends') }} {{ formatDate(auction.end_date) }}</small>
							</span>
						</router-link>
					</li>
				</ul>
				<router-link to="/app/auctions" class="dash-card__more">
					{{ $t('dashboard.view_all') }} →
				</router-link>
			</article>

			<article class="dash-card">
				<header class="dash-card__head">
					<h3>{{ $t('dashboard.nfts_title') }}</h3>
				</header>

				<p v-if="nftsError" class="dash-card__state">{{ $t('dashboard.list_error') }}</p>
				<div v-else-if="nftsLoading" class="dash-grid" aria-hidden="true">
					<span v-for="n in 4" :key="n" class="dash-thumb dash-thumb--skeleton"></span>
				</div>
				<div v-else-if="!nfts.length" class="dash-card__empty">
					<p class="dash-card__state">{{ $t('dashboard.empty_nfts') }}</p>
					<router-link to="/app/create/nft" class="dash-card__cta">
						{{ $t('dashboard.act_create_nft') }}
					</router-link>
				</div>
				<div v-else class="dash-grid">
					<router-link
						v-for="nft in nfts"
						:key="nft.id ?? nft.token_id"
						to="/app/nfts"
						class="dash-thumb"
						:title="nft.title">
						<img :src="nft.image_uri" :alt="nft.title ?? ''" loading="lazy" />
						<span>{{ nft.title }}</span>
					</router-link>
				</div>
				<router-link to="/app/nfts" class="dash-card__more">
					{{ $t('dashboard.view_all') }} →
				</router-link>
			</article>
		</section>

		<!-- Raccourcis -->
		<section class="dash-actions">
			<h3>{{ $t('dashboard.actions_title') }}</h3>
			<div class="dash-actions__grid">
				<router-link
					v-for="action in quickActions"
					:key="action.to"
					:to="action.to"
					class="dash-action">
					<span class="dash-action__media">
						<img :src="action.image" alt="" loading="lazy" />
					</span>
					<span class="dash-action__body">
						<span class="dash-action__title">{{ $t(action.title) }}</span>
						<span class="dash-action__desc">{{ $t(action.desc) }}</span>
						<span class="dash-action__go">{{ $t('dashboard.open') }} →</span>
					</span>
				</router-link>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
	import { storeToRefs } from 'pinia';
	import axios from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';

	const { me } = storeToRefs(useAuthStore());

	// Solde ETH
	const balance = ref(0);
	const balanceReady = ref(false);
	const balanceError = ref(false);
	const copied = ref(false);

	// Enchères et NFT
	const ownAuctions = ref([]);
	const wonCount = ref(0);
	const auctionsLoading = ref(true);
	const auctionsError = ref(false);
	const nfts = ref([]);
	const nftsLoading = ref(true);
	const nftsError = ref(false);

	const quickActions = [
		{
			to: '/app/create/nft',
			title: 'dashboard.act_create_nft',
			desc: 'dashboard.act_create_nft_desc',
			image: '/public/img/dashboard/create-nft.png',
		},
		{
			to: '/app/create/auction',
			title: 'dashboard.act_create_auction',
			desc: 'dashboard.act_create_auction_desc',
			image: '/public/img/dashboard/auction.jpg',
		},
		{
			to: '/app/auctions',
			title: 'dashboard.act_my_auctions',
			desc: 'dashboard.act_my_auctions_desc',
			image: '/public/img/dashboard/my-auctions.jpg',
		},
		{
			to: '/app/nfts',
			title: 'dashboard.act_my_nfts',
			desc: 'dashboard.act_my_nfts_desc',
			image: '/public/img/dashboard/my-nfts.jpg',
		},
	];

	const address = computed(() => me.value?.etherum_adress ?? '');
	const shortAddress = computed(() =>
		address.value ? `${address.value.slice(0, 6)}…${address.value.slice(-4)}` : ''
	);
	const fullName = computed(() => [me.value?.name, me.value?.lastname].filter(Boolean).join(' '));
	const initial = computed(() => (me.value?.name ?? '?').charAt(0).toUpperCase());
	const pack = computed(() => me.value?.pack?.pack_name ?? '');

	// Photo de profil : lue sans risque, sinon initiale
	const avatar = computed(() => {
		try {
			const images = JSON.parse(me.value?.configuration?.profile_image ?? 'null');
			return images?.[0]?.content ?? null;
		} catch (e) {
			return null;
		}
	});

	// Quotas : restant, maximum du pack et pourcentage restant
	const quotas = computed(() => {
		const user = me.value ?? {};
		const packInfo = user.pack ?? {};
		const build = (key, left, max, label, icon) => {
			const hasMax = Number(max) > 0;
			return {
				key,
				left: Number(left) || 0,
				max: hasMax ? Number(max) : 0,
				percent: hasMax ? Math.min(100, Math.round(((Number(left) || 0) / Number(max)) * 100)) : 0,
				label,
				icon,
			};
		};
		return [
			build(
				'nft',
				user.current_allow_nft,
				packInfo.pack_max_nft_creation,
				'dashboard.nft_left',
				'<path d="M4 5h16v14H4z M4 16l5-5 4 4 2-2 5 5" /><circle cx="9" cy="9.5" r="1.5" />'
			),
			build(
				'auction',
				user.current_allow_auction,
				packInfo.pack_max_auction_creation,
				'dashboard.auction_left',
				'<path d="M14 4l6 6-8 8-6-6z M4 20l4-4" />'
			),
			build(
				'bid',
				user.current_allow_bid,
				packInfo.pack_max_bid,
				'dashboard.bid_left',
				'<circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />'
			),
		];
	});

	const format = (value) => new Intl.NumberFormat().format(value ?? 0);
	const formatEth = (value) =>
		new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(Number(value) || 0);
	const formatDate = (value) =>
		value ? new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short' }).format(new Date(value)) : '—';
	const auctionTitle = (auction) =>
		auction.nft?.title ?? `#${String(auction.auction_uuid ?? auction.id ?? '').slice(0, 8)}`;

	const loadBalance = async () => {
		if (!address.value) return;
		try {
			const { data } = await axios.get(`/blockchain/me/${address.value}`);
			balance.value = data;
			balanceReady.value = true;
		} catch (e) {
			balanceError.value = true;
		}
	};

	const loadAuctions = async () => {
		try {
			const { data } = await axios.get('/mine/auctions');
			ownAuctions.value = (data.data?.own_auctions ?? []).slice(0, 4);
			wonCount.value = (data.data?.win_auctions ?? []).length;
		} catch (e) {
			auctionsError.value = true;
		} finally {
			auctionsLoading.value = false;
		}
	};

	const loadNfts = async () => {
		try {
			const { data } = await axios.get('/mine/nft', { params: { perPage: 4 } });
			nfts.value = (data.data?.data ?? []).slice(0, 4);
		} catch (e) {
			nftsError.value = true;
		} finally {
			nftsLoading.value = false;
		}
	};

	const copyAddress = async () => {
		try {
			await navigator.clipboard.writeText(address.value);
			copied.value = true;
			setTimeout(() => (copied.value = false), 2000);
		} catch (e) {
			copied.value = false;
		}
	};

	onMounted(() => {
		loadBalance();
		loadAuctions();
		loadNfts();
	});
</script>

<style scoped>
	.dash-home {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding-bottom: 40px;
		color: #0d104d;
	}

	/* Carte de bienvenue */
	.dash-hero {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 30px 34px;
		border-radius: 20px;
		background:
			radial-gradient(circle at 90% 0%, rgba(255, 175, 2, 0.16), transparent 45%),
			linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		box-shadow: 0 20px 44px rgba(13, 16, 77, 0.22);
	}

	.dash-hero__identity {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.dash-hero__avatar,
	.dash-hero__avatar-img {
		width: 64px;
		height: 64px;
		flex-shrink: 0;
		border-radius: 50%;
	}

	.dash-hero__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #ffaf02;
		color: #0d104d;
		font-size: 24px;
		font-weight: 700;
	}

	.dash-hero__avatar-img {
		object-fit: cover;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.dash-hero__greeting {
		margin: 0 0 8px;
		font-size: 1.4rem;
		font-weight: 600;
		color: #ffffff;
	}

	.dash-hero__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.dash-hero__pack {
		display: inline-block;
		padding: 3px 12px;
		border-radius: 999px;
		background: rgba(255, 175, 2, 0.18);
		color: #ffaf02;
		font-size: 12px;
		font-weight: 600;
	}

	.dash-hero__upgrade {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
	}

	.dash-hero__upgrade:hover,
	.dash-hero__upgrade:focus-visible {
		color: #ffaf02;
		outline: none;
	}

	.dash-hero__balance {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
		text-align: right;
	}

	.dash-hero__label {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}

	.dash-hero__amount {
		font-size: 2rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: #ffffff;
	}

	.dash-hero__amount small {
		font-size: 0.9rem;
		font-weight: 600;
		color: #ffaf02;
	}

	.dash-hero__amount--muted {
		font-size: 1rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}

	.dash-hero__skeleton {
		display: block;
		width: 160px;
		height: 34px;
		border-radius: 10px;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.08) 75%);
		background-size: 200% 100%;
		animation: dash-shimmer 1.4s linear infinite;
	}

	.dash-hero__address {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 5px 12px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.85);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.dash-hero__address:hover,
	.dash-hero__address:focus-visible {
		border-color: #ffaf02;
		outline: none;
	}

	.dash-hero__copy {
		color: #ffaf02;
		font-weight: 600;
	}

	/* Quotas */
	.dash-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}

	.dash-stat {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 22px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
		transition: transform 0.25s ease, border-color 0.25s ease;
	}

	.dash-stat:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 175, 2, 0.6);
	}

	.dash-stat__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: #f1f2f7;
	}

	.dash-stat__icon svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: #28408b;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.dash-stat__body {
		flex: 1;
		min-width: 0;
	}

	.dash-stat__value {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-variant-numeric: tabular-nums;
	}

	.dash-stat__value strong {
		font-size: 1.5rem;
		font-weight: 700;
		color: #0d104d;
	}

	.dash-stat__value span {
		font-size: 14px;
		color: #7a7f96;
	}

	.dash-stat__label {
		display: block;
		margin-top: 2px;
		font-size: 13px;
		color: #7a7f96;
	}

	.dash-stat__bar {
		height: 6px;
		margin-top: 12px;
		border-radius: 999px;
		background: #f1f2f7;
		overflow: hidden;
	}

	.dash-stat__bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #28408b, #ffaf02);
		transition: width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	/* Listes */
	.dash-lists {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}

	.dash-card {
		display: flex;
		flex-direction: column;
		padding: 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
	}

	.dash-card__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 16px;
	}

	.dash-card__head h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #0d104d;
	}

	.dash-card__badge {
		padding: 3px 10px;
		border-radius: 999px;
		background: #e7f7ee;
		color: #0f9d58;
		font-size: 12px;
		font-weight: 600;
	}

	.dash-card__state {
		margin: 0 0 12px;
		font-size: 14px;
		color: #7a7f96;
	}

	.dash-card__empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.dash-card__cta {
		padding: 8px 18px;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
	}

	.dash-card__cta:hover,
	.dash-card__cta:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		outline: none;
	}

	.dash-card__more {
		margin-top: auto;
		padding-top: 16px;
		font-size: 13px;
		font-weight: 600;
		color: #28408b;
		text-decoration: none;
	}

	.dash-card__more:hover,
	.dash-card__more:focus-visible {
		color: #ffaf02;
		outline: none;
	}

	.dash-rows {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.dash-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 14px;
		border-radius: 12px;
		background: #f6f7fb;
		color: #0d104d;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.dash-row:hover,
	.dash-row:focus-visible {
		background: #fff8e6;
		outline: none;
	}

	.dash-row__title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
	}

	.dash-row__side {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		flex-shrink: 0;
	}

	.dash-row__side strong {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.dash-row__side small {
		font-size: 12px;
		color: #7a7f96;
	}

	.dash-row--skeleton {
		height: 52px;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: dash-shimmer 1.4s linear infinite;
	}

	.dash-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.dash-thumb {
		position: relative;
		display: block;
		aspect-ratio: 1 / 1;
		border-radius: 12px;
		overflow: hidden;
		background: #f1f2f7;
	}

	.dash-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.dash-thumb span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 18px 10px 8px;
		background: linear-gradient(transparent, rgba(13, 16, 77, 0.85));
		color: #ffffff;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dash-thumb:hover img,
	.dash-thumb:focus-visible img {
		transform: scale(1.05);
	}

	.dash-thumb--skeleton {
		display: block;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: dash-shimmer 1.4s linear infinite;
	}

	/* Raccourcis */
	.dash-actions h3 {
		margin: 0 0 14px;
		font-size: 1.1rem;
		font-weight: 600;
		color: #0d104d;
	}

	.dash-actions__grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;
	}

	.dash-action {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 26px rgba(13, 16, 77, 0.06);
		color: #0d104d;
		text-decoration: none;
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.dash-action:hover,
	.dash-action:focus-visible {
		transform: translateY(-4px);
		border-color: rgba(255, 175, 2, 0.6);
		box-shadow: 0 18px 36px rgba(13, 16, 77, 0.14);
		outline: none;
	}

	.dash-action__media {
		display: block;
		height: 128px;
		overflow: hidden;
		background: #f1f2f7;
	}

	.dash-action__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.dash-action:hover .dash-action__media img,
	.dash-action:focus-visible .dash-action__media img {
		transform: scale(1.06);
	}

	.dash-action__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 6px;
		padding: 16px 18px 18px;
	}

	.dash-action__title {
		font-size: 1rem;
		font-weight: 600;
		color: #0d104d;
	}

	.dash-action__desc {
		flex: 1;
		font-size: 13px;
		line-height: 1.55;
		color: #7a7f96;
	}

	.dash-action__go {
		margin-top: 4px;
		font-size: 13px;
		font-weight: 600;
		color: #28408b;
		transition: color 0.2s ease;
	}

	.dash-action:hover .dash-action__go {
		color: #ffaf02;
	}

	@keyframes dash-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 1199px) {
		.dash-stats {
			grid-template-columns: repeat(3, 1fr);
		}
		.dash-actions__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 991px) {
		.dash-lists {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 575px) {
		.dash-hero {
			padding: 24px 22px;
		}
		.dash-hero__balance {
			align-items: flex-start;
			text-align: left;
		}
		.dash-stats,
		.dash-actions__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dash-hero__skeleton,
		.dash-row--skeleton,
		.dash-thumb--skeleton,
		.dash-stat,
		.dash-action,
		.dash-action__media img,
		.dash-stat__bar span,
		.dash-thumb img {
			animation: none;
			transition: none;
		}
	}
</style>
