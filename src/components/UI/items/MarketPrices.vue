<template>
	<section class="market" ref="root">
		<div class="container">
			<header class="market__head" data-reveal>
				<h3>{{ $t('market.prices_title') }}</h3>
				<span class="market__rule" aria-hidden="true"></span>
			</header>

			<div class="market__card" data-reveal>
				<div class="market__toolbar">
					<div class="market__group" role="group" aria-label="Paire">
						<button
							v-for="item in PAIRS"
							:key="item.symbol"
							type="button"
							class="market__btn"
							:class="{ 'is-active': item.symbol === pair.symbol }"
							:aria-pressed="item.symbol === pair.symbol"
							@click="pair = item">
							{{ item.base }}
						</button>
					</div>
					<div class="market__group" role="group" aria-label="Période">
						<button
							v-for="key in Object.keys(RANGES)"
							:key="key"
							type="button"
							class="market__btn"
							:class="{ 'is-active': key === range }"
							:aria-pressed="key === range"
							@click="range = key">
							{{ $t(`market.range_${key}`) }}
						</button>
					</div>
				</div>

				<div v-if="ready" class="market__stats">
					<div>
						<span>{{ $t('market.last') }}</span>
						<strong>{{ formatPrice(lastPrice) }}</strong>
					</div>
					<div>
						<span>{{ $t('market.change') }}</span>
						<strong :class="trend">{{ formatChange(changePct) }}</strong>
					</div>
					<div>
						<span>{{ $t('market.high') }}</span>
						<strong>{{ formatPrice(high) }}</strong>
					</div>
					<div>
						<span>{{ $t('market.low') }}</span>
						<strong>{{ formatPrice(low) }}</strong>
					</div>
				</div>

				<p v-if="error" class="market__state" role="alert">
					{{ $t('market.error') }}
				</p>

				<p v-else-if="!loading && !candles.length" class="market__state">
					{{ $t('market.empty') }}
				</p>

				<div v-else class="market__chart">
					<div
						ref="plotRef"
						class="market__plot"
						:class="{ 'is-loading': loading }"
						@pointermove="onPointerMove"
						@pointerleave="hoverIndex = null">
						<svg
							v-if="ready"
							class="market__svg"
							viewBox="0 0 1000 300"
							preserveAspectRatio="none"
							aria-hidden="true">
							<defs>
								<linearGradient id="market-area" x1="0" x2="0" y1="0" y2="1">
									<stop offset="0" stop-color="#ffaf02" stop-opacity="0.3" />
									<stop offset="1" stop-color="#ffaf02" stop-opacity="0" />
								</linearGradient>
							</defs>
							<path class="market__area" :d="areaPath" fill="url(#market-area)" />
							<path class="market__line" :d="linePath" vector-effect="non-scaling-stroke" />
						</svg>

						<template v-if="hoverPoint">
							<span class="market__cursor" :style="{ left: hoverPoint.left + '%' }"></span>
							<span
								class="market__dot"
								:style="{ left: hoverPoint.left + '%', top: hoverPoint.top + '%' }"></span>
							<div class="market__tip" :style="{ left: hoverPoint.left + '%' }">
								<strong>{{ formatPrice(hoverCandle.close) }}</strong>
								<small>{{ formatTime(hoverCandle.time, true) }}</small>
							</div>
						</template>

						<span v-if="ready" class="market__y market__y--top">{{ formatPrice(high) }}</span>
						<span v-if="ready" class="market__y market__y--bottom">{{ formatPrice(low) }}</span>
					</div>

					<div v-if="ready" class="market__axis">
						<span>{{ formatTime(candles[0].time) }}</span>
						<span>{{ formatTime(candles[candles.length - 1].time) }}</span>
					</div>
				</div>
			</div>

			<p class="market__note" data-reveal>{{ $t('market.note') }}</p>
		</div>
	</section>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from 'vue';
	import axios from '@/src/axios';
	import { useReveal } from '@/composables/useReveal';

	// Paires cotées en dollar uniquement, pour que le symbole $ soit exact
	const PAIRS = [
		{ symbol: 'BTCUSDT', base: 'BTC' },
		{ symbol: 'ETHUSDT', base: 'ETH' },
		{ symbol: 'BNBUSDT', base: 'BNB' },
		{ symbol: 'SOLUSDT', base: 'SOL' },
		{ symbol: 'XRPUSDT', base: 'XRP' },
		{ symbol: 'ADAUSDT', base: 'ADA' },
		{ symbol: 'DOGEUSDT', base: 'DOGE' },
		{ symbol: 'AVAXUSDT', base: 'AVAX' },
		{ symbol: 'LINKUSDT', base: 'LINK' },
		{ symbol: 'LTCUSDT', base: 'LTC' },
	];
	const RANGES = {
		'24h': { interval: '1h', limit: 24 },
		'7d': { interval: '4h', limit: 42 },
	};

	const W = 1000;
	const H = 300;
	const PAD = 24;

	const root = ref(null);
	const plotRef = ref(null);
	const pair = ref(PAIRS[0]);
	const range = ref('24h');
	const candles = ref([]);
	const loading = ref(true);
	const error = ref(false);
	const hoverIndex = ref(null);

	useReveal(root);

	// Ignore les réponses périmées si l'utilisateur change de paire pendant un chargement
	let lastRequest = 0;
	const load = async () => {
		const request = ++lastRequest;
		const { interval, limit } = RANGES[range.value];
		loading.value = true;
		error.value = false;
		hoverIndex.value = null;
		try {
			const { data } = await axios.get('/ticker/history', {
				params: { symbol: pair.value.symbol, interval, limit },
			});
			if (request !== lastRequest) return;
			candles.value = Array.isArray(data) ? data : [];
		} catch (e) {
			if (request !== lastRequest) return;
			error.value = true;
			candles.value = [];
		} finally {
			if (request === lastRequest) loading.value = false;
		}
	};

	watch([pair, range], load);
	onMounted(load);

	const ready = computed(() => !loading.value && !error.value && candles.value.length > 0);

	const first = computed(() => candles.value[0]);
	const last = computed(() => candles.value[candles.value.length - 1]);
	const lastPrice = computed(() => (last.value ? last.value.close : 0));
	const high = computed(() => Math.max(0, ...candles.value.map((c) => c.high)));
	const low = computed(() =>
		candles.value.length ? Math.min(...candles.value.map((c) => c.low)) : 0
	);
	const changePct = computed(() => {
		if (!first.value || !first.value.open) return 0;
		return ((last.value.close - first.value.open) / first.value.open) * 100;
	});
	const trend = computed(() => (changePct.value >= 0 ? 'is-up' : 'is-down'));

	// Échelle verticale : la courbe occupe la hauteur, avec une marge en haut et en bas
	const scale = computed(() => {
		const closes = candles.value.map((c) => c.close);
		const min = Math.min(...closes);
		const max = Math.max(...closes);
		const margin = (max - min || max || 1) * 0.08;
		return { min: min - margin, max: max + margin };
	});

	const points = computed(() => {
		const n = candles.value.length;
		const { min, max } = scale.value;
		return candles.value.map((c, i) => ({
			x: n > 1 ? (i / (n - 1)) * W : W / 2,
			y: PAD + (1 - (c.close - min) / (max - min)) * (H - 2 * PAD),
		}));
	});

	// Courbe de Bézier (Catmull-Rom) : passe par chaque point, sans angles vifs
	const smoothPath = (pts) => {
		if (pts.length < 2) return '';
		let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[i - 1] || pts[i];
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p3 = pts[i + 2] || p2;
			const c1x = p1.x + (p2.x - p0.x) / 6;
			const c1y = p1.y + (p2.y - p0.y) / 6;
			const c2x = p2.x - (p3.x - p1.x) / 6;
			const c2y = p2.y - (p3.y - p1.y) / 6;
			d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
		}
		return d;
	};

	const linePath = computed(() => smoothPath(points.value));
	const areaPath = computed(() =>
		points.value.length ? `${linePath.value} L${W} ${H} L0 ${H} Z` : ''
	);

	// Survol : bougie la plus proche du curseur
	const onPointerMove = (event) => {
		if (!plotRef.value || !candles.value.length) return;
		const rect = plotRef.value.getBoundingClientRect();
		const ratio = (event.clientX - rect.left) / rect.width;
		const index = Math.round(ratio * (candles.value.length - 1));
		hoverIndex.value = Math.min(Math.max(index, 0), candles.value.length - 1);
	};

	const hoverCandle = computed(() =>
		hoverIndex.value === null ? null : candles.value[hoverIndex.value]
	);
	const hoverPoint = computed(() => {
		if (hoverIndex.value === null) return null;
		const point = points.value[hoverIndex.value];
		return { left: (point.x / W) * 100, top: (point.y / H) * 100 };
	});

	const formatPrice = (value) =>
		new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: value >= 1 ? 2 : 6,
		}).format(value);

	const changeFormat = new Intl.NumberFormat(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		signDisplay: 'always',
	});
	const formatChange = (value) => `${changeFormat.format(value)} %`;

	const formatTime = (time, detailed = false) => {
		const options =
			range.value === '24h' && !detailed
				? { hour: '2-digit', minute: '2-digit' }
				: { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
		return new Intl.DateTimeFormat(undefined, options).format(new Date(time));
	};
</script>

<style scoped>
	.market {
		padding: 100px 0 60px;
		background: #f6f7fb;
	}

	.market [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.market [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.market__head {
		text-align: center;
		margin-bottom: 40px;
	}

	.market__head h3 {
		font-size: clamp(1.9rem, 3.2vw, 2.5rem);
		font-weight: 600;
		color: #0d104d;
		margin-bottom: 16px;
	}

	.market__rule {
		display: block;
		width: 56px;
		height: 3px;
		margin: 0 auto;
		border-radius: 999px;
		background: #ffaf02;
	}

	.market__card {
		max-width: 1000px;
		margin: 0 auto;
		padding: 28px 32px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.08);
	}

	.market__toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 24px;
	}

	.market__group {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 4px;
		background: #f1f2f7;
		border-radius: 999px;
	}

	.market__btn {
		padding: 6px 16px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.market__btn:hover {
		color: #0d104d;
	}

	.market__btn.is-active {
		background: #0d104d;
		color: #ffffff;
	}

	.market__btn:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	.market__stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-bottom: 20px;
	}

	.market__stats span {
		display: block;
		margin-bottom: 2px;
		font-size: 12px;
		color: #7a7f96;
	}

	.market__stats strong {
		font-size: 17px;
		font-weight: 600;
		color: #0d104d;
		font-variant-numeric: tabular-nums;
	}

	.market__stats strong.is-up {
		color: #0f9d58;
	}

	.market__stats strong.is-down {
		color: #d93025;
	}

	.market__state {
		margin: 0;
		padding: 60px 0;
		text-align: center;
		color: #7a7f96;
	}

	.market__plot {
		position: relative;
		height: 300px;
		cursor: crosshair;
		touch-action: pan-y;
	}

	.market__plot.is-loading::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 25%, rgba(13, 16, 77, 0.05) 50%, transparent 75%);
		background-size: 200% 100%;
		animation: market-shimmer 1.4s linear infinite;
	}

	.market__svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.market__line {
		fill: none;
		stroke: #0d104d;
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.market__cursor {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: #c9ccdb;
		transform: translateX(-50%);
		pointer-events: none;
	}

	.market__dot {
		position: absolute;
		width: 12px;
		height: 12px;
		margin: -6px 0 0 -6px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		background: #ffaf02;
		box-shadow: 0 2px 8px rgba(13, 16, 77, 0.25);
		pointer-events: none;
	}

	.market__tip {
		position: absolute;
		top: 8px;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6px 10px;
		border-radius: 8px;
		background: #0d104d;
		color: #ffffff;
		white-space: nowrap;
		pointer-events: none;
	}

	.market__tip strong {
		font-size: 13px;
		font-variant-numeric: tabular-nums;
	}

	.market__tip small {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.7);
	}

	.market__y {
		position: absolute;
		left: 0;
		font-size: 11px;
		color: #9aa0b8;
		font-variant-numeric: tabular-nums;
		pointer-events: none;
	}

	.market__y--top {
		top: 0;
	}

	.market__y--bottom {
		bottom: 0;
	}

	.market__axis {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px solid #eef0f6;
		font-size: 12px;
		color: #7a7f96;
		font-variant-numeric: tabular-nums;
	}

	.market__note {
		max-width: 1000px;
		margin: 18px auto 0;
		font-size: 12px;
		color: #7a7f96;
		text-align: right;
	}

	@keyframes market-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 767px) {
		.market__card {
			padding: 20px 16px 18px;
		}
		.market__stats {
			grid-template-columns: repeat(2, 1fr);
		}
		.market__plot {
			height: 240px;
		}
		.market__btn {
			padding: 6px 12px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.market [data-reveal] {
			transition: none;
		}
		.market__plot.is-loading::after {
			animation: none;
		}
	}
</style>
