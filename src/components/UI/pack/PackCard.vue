<template>
	<article class="pack-card" :class="{ 'is-featured': featured }">
		<span v-if="featured" class="pack-card__badge">{{ $t('packs_public.featured') }}</span>

		<h3 class="pack-card__name">{{ pack.pack_name }}</h3>

		<p class="pack-card__price">
			<span class="pack-card__amount">{{ format(pack.pack_price) }}</span>
			<span class="pack-card__currency">{{ $t('pack.currency') }}</span>
			<span class="pack-card__licence">{{ $t('pack.licence') }}</span>
		</p>

		<ul class="pack-card__features">
			<li>
				<span>{{ $t('pack.nft_creation') }}</span>
				<strong>{{ format(pack.pack_max_nft_creation) }}</strong>
			</li>
			<li>
				<span>{{ $t('pack.auction_creation') }}</span>
				<strong>{{ format(pack.pack_max_auction_creation) }}</strong>
			</li>
			<li>
				<span>{{ $t('pack.max_bid') }}</span>
				<strong>{{ format(pack.pack_max_bid) }}</strong>
			</li>
		</ul>

		<div class="pack-card__action">
			<slot />
		</div>
	</article>
</template>

<script setup>
	import { useI18n } from 'vue-i18n';

	defineProps({
		pack: { type: Object, required: true },
		featured: { type: Boolean, default: false },
	});

	const { locale } = useI18n();
	const format = (value) => new Intl.NumberFormat(locale.value === 'en' ? 'en-GB' : 'fr-FR').format(value ?? 0);
</script>

<style scoped>
	.pack-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 16px;
		height: 100%;
		padding: 28px 26px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 16px 40px rgba(13, 16, 77, 0.07);
		color: #0d104d;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.pack-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 22px 48px rgba(13, 16, 77, 0.12);
	}

	.pack-card.is-featured {
		border: 2px solid #ffaf02;
	}

	.pack-card__badge {
		position: absolute;
		top: -12px;
		left: 26px;
		padding: 4px 12px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0d104d;
		font-size: 12px;
		font-weight: 700;
	}

	.pack-card__name {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
	}

	.pack-card__price {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 6px;
		margin: 0;
	}

	.pack-card__amount {
		color: #0d104d;
		font-size: 2.4rem;
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.pack-card__currency {
		color: #0d104d;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.pack-card__licence {
		width: 100%;
		font-size: 13px;
		color: #7a7f96;
	}

	.pack-card__features {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pack-card__features li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-top: 1px solid #eef0f6;
		font-size: 14px;
	}

	.pack-card__features strong {
		font-variant-numeric: tabular-nums;
	}

	.pack-card__action {
		margin-top: auto;
	}

	.pack-card__action :deep(.cta-btn) {
		width: 100%;
		justify-content: center;
	}
</style>
