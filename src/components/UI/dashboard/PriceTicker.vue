<template>
	<div class="price-ticker" role="region" :aria-label="$t('dashboard.ticker_label')">
		<span class="price-ticker__label">{{ $t('dashboard.ticker_label') }}</span>

		<div class="price-ticker__viewport">
			<p v-if="error" class="price-ticker__state" role="alert">
				{{ $t('market.error') }}
			</p>

			<ul v-else-if="loading" class="price-ticker__static" aria-hidden="true">
				<li v-for="n in 6" :key="n" class="price-ticker__chip price-ticker__chip--skeleton"></li>
			</ul>

			<p v-else-if="!items.length" class="price-ticker__state">
				{{ $t('market.empty') }}
			</p>

			<div v-else class="price-ticker__track" :style="{ '--duration': duration }">
				<ul class="price-ticker__group">
					<li v-for="item in items" :key="item.symbol" class="price-ticker__chip" :class="trend(item)">
						<span class="price-ticker__coin" aria-hidden="true"></span>
						<span class="price-ticker__pair">{{ item.base }}<small>/{{ item.quote }}</small></span>
						<span class="price-ticker__price">{{ formatPrice(item) }}</span>
						<span class="price-ticker__change">{{ arrow(item) }} {{ formatChange(item) }}</span>
					</li>
				</ul>
				<!-- Copie identique pour une boucle sans à-coup -->
				<ul class="price-ticker__group" aria-hidden="true">
					<li v-for="item in items" :key="`copy-${item.symbol}`" class="price-ticker__chip" :class="trend(item)">
						<span class="price-ticker__coin" aria-hidden="true"></span>
						<span class="price-ticker__pair">{{ item.base }}<small>/{{ item.quote }}</small></span>
						<span class="price-ticker__price">{{ formatPrice(item) }}</span>
						<span class="price-ticker__change">{{ arrow(item) }} {{ formatChange(item) }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
	import axios from '@/src/axios';

	const LIMIT = 12;
	const SECONDS_PER_ITEM = 3;
	const QUOTES = ['USDT', 'BUSD', 'USDC', 'FDUSD', 'BTC', 'ETH', 'BNB'];
	const DOLLAR_QUOTES = ['USDT', 'BUSD', 'USDC', 'FDUSD'];

	const raw = ref([]);
	const loading = ref(true);
	const error = ref(false);

	const toNumber = (value) => Number(value) || 0;

	const splitSymbol = (symbol) => {
		const quote = QUOTES.find((q) => symbol.endsWith(q));
		return quote
			? { base: symbol.slice(0, -quote.length), quote }
			: { base: symbol, quote: '' };
	};

	// Paires actives uniquement, les plus échangées en premier
	const items = computed(() =>
		raw.value
			.filter((c) => toNumber(c.lastPrice) > 0)
			.map((c) => ({
				...splitSymbol(c.symbol),
				symbol: c.symbol,
				last: toNumber(c.lastPrice),
				change: toNumber(c.priceChangePercent),
				volume: toNumber(c.quoteVolume),
			}))
			.sort((a, b) => b.volume - a.volume)
			.slice(0, LIMIT)
	);

	// Durée d'un cycle complet, proportionnelle au nombre de pastilles
	const duration = computed(() => `${Math.max(items.value.length, 1) * SECONDS_PER_ITEM}s`);

	const formatPrice = (item) => {
		if (DOLLAR_QUOTES.includes(item.quote)) {
			return new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 2,
				maximumFractionDigits: item.last >= 1 ? 2 : 6,
			}).format(item.last);
		}
		const amount = new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }).format(item.last);
		return `${amount} ${item.quote}`;
	};

	const changeFormat = new Intl.NumberFormat(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const formatChange = (item) => `${changeFormat.format(Math.abs(item.change))} %`;

	const trend = (item) => {
		if (item.change > 0) return 'is-up';
		if (item.change < 0) return 'is-down';
		return 'is-flat';
	};

	const arrow = (item) => {
		if (item.change > 0) return '▲';
		if (item.change < 0) return '▼';
		return '•';
	};

	const load = async () => {
		loading.value = true;
		error.value = false;
		try {
			const { data } = await axios.get('/ticker');
			raw.value = Array.isArray(data) ? data : [];
		} catch (e) {
			error.value = true;
		} finally {
			loading.value = false;
		}
	};

	onMounted(load);
</script>

<style scoped>
	.price-ticker {
		display: flex;
		align-items: center;
		gap: 14px;
		flex: 1;
		min-width: 0;
		height: 100%;
		padding: 4px 10px 4px 8px;
		background: #f6f7fb;
		border: 1px solid #eef0f6;
		border-radius: 14px;
	}

	.price-ticker__label {
		flex-shrink: 0;
		padding: 4px 10px;
		border-radius: 999px;
		background: #0d104d;
		color: #ffaf02;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* Zone de défilement : fondus sur les bords */
	.price-ticker__viewport {
		position: relative;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
	}

	.price-ticker__track {
		display: flex;
		width: max-content;
		animation: price-ticker-scroll var(--duration) linear infinite;
	}

	.price-ticker__track:hover {
		animation-play-state: paused;
	}

	.price-ticker__group {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		padding: 0 10px 0 0;
		list-style: none;
	}

	.price-ticker__static {
		display: flex;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.price-ticker__chip {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 6px 14px 6px 8px;
		border: 1px solid #e6e8f2;
		border-radius: 999px;
		background: #ffffff;
		font-size: 13px;
		white-space: nowrap;
	}

	.price-ticker__coin {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffaf02, #ffd166);
	}

	.price-ticker__pair {
		font-weight: 600;
		color: #0d104d;
	}

	.price-ticker__pair small {
		font-weight: 400;
		color: #7a7f96;
	}

	.price-ticker__price {
		font-weight: 500;
		color: #0d104d;
		font-variant-numeric: tabular-nums;
	}

	.price-ticker__change {
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: #7a7f96;
		background: #f1f2f7;
	}

	.price-ticker__chip.is-up .price-ticker__change {
		color: #0f9d58;
		background: #e7f7ee;
	}

	.price-ticker__chip.is-down .price-ticker__change {
		color: #d93025;
		background: #fdecea;
	}

	.price-ticker__chip--skeleton {
		width: 150px;
		height: 34px;
		border: 0;
		background: linear-gradient(90deg, #f1f2f7 25%, #fafbff 50%, #f1f2f7 75%);
		background-size: 200% 100%;
		animation: price-ticker-shimmer 1.4s linear infinite;
	}

	.price-ticker__state {
		margin: 0;
		font-size: 13px;
		color: #7a7f96;
		white-space: nowrap;
	}

	@keyframes price-ticker-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes price-ticker-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 767px) {
		.price-ticker__label {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.price-ticker__viewport {
			overflow-x: auto;
			mask-image: none;
			-webkit-mask-image: none;
		}
		.price-ticker__track,
		.price-ticker__chip--skeleton {
			animation: none;
		}
		.price-ticker__group[aria-hidden='true'] {
			display: none;
		}
	}
</style>
