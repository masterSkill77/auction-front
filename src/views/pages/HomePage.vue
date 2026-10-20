<template>
	<HomeCaroussel />

	<AboutBlock />

	<!-- ##### Currency Area Start ##### -->
	<CurrencyIntro />
	<!-- ##### Currency Area End ##### -->

	<!-- ##### Blog Area Start ##### -->
	<MarketPrices />

	<section class="newsletter-section">
		<div class="container">
			<div class="newsletter-card">
				<div class="newsletter-card__text">
					<h3 v-html="$t('newsletter.title')"></h3>
					<p>{{ $t('newsletter.text') }}</p>
				</div>
				<form class="newsletter-card__form" action="#" method="post">
					<input
						type="email"
						name="email"
						:placeholder="$t('newsletter.placeholder')" />
					<button type="submit">{{ $t('newsletter.button') }}</button>
				</form>
			</div>
		</div>
	</section>
</template>
<script setup>
	import HomeCaroussel from '../../components/UI/caroussel/HomeCaroussel.vue';
	import AboutBlock from '../../components/UI/items/AboutBlock.vue';
	import CurrencyIntro from '../../components/UI/items/CurrencyIntro.vue';
	import Explaination from '../../components/UI/items/Explaination.vue';
	import Millestone from '../../components/UI/items/Millestone.vue';
	import MarketPrices from '../../components/UI/items/MarketPrices.vue';
	import { useLoadingStore } from '../../stores/loading';
	import { storeToRefs } from 'pinia';
	setTimeout(() => useLoadingStore().setLoading(false), 1700);
</script>

<style scoped>
	.newsletter-section {
		padding: 0 0 110px;
		background: #f6f7fb;
	}
	.newsletter-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 40px;
		padding: 48px 52px;
		border-radius: 20px;
		background: linear-gradient(120deg, #0d104d, #28408b);
		box-shadow: 0 24px 50px rgba(13, 16, 77, 0.25);
	}
	.newsletter-card__text h3 {
		font-size: 28px;
		font-weight: 600;
		color: #ffffff;
		margin-bottom: 10px;
	}
	.newsletter-card__text p {
		margin: 0;
		max-width: 520px;
		font-size: 15px;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
	}
	.newsletter-card__form {
		display: flex;
		flex: 0 0 auto;
		gap: 10px;
		padding: 6px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
	}
	.newsletter-card__form input {
		width: 300px;
		max-width: 100%;
		padding: 12px 20px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: #ffffff;
		outline: none;
	}
	.newsletter-card__form input::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}
	.newsletter-card__form button {
		padding: 12px 28px;
		border: 0;
		border-radius: 999px;
		background: #ffaf02;
		color: #0d104d;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}
	.newsletter-card__form button:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 20px rgba(255, 175, 2, 0.35);
	}
	@media (max-width: 991px) {
		.newsletter-card {
			flex-direction: column;
			align-items: stretch;
			padding: 36px 28px;
		}
	}
	@media (max-width: 575px) {
		.newsletter-card__form {
			flex-direction: column;
			border-radius: 16px;
		}
		.newsletter-card__form input {
			width: 100%;
		}
	}
</style>
