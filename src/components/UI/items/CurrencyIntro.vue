<template>
	<section class="currency-intro" ref="root">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-12 col-lg-6">
					<div class="currency-intro__head" data-reveal>
						<h3 class="currency-intro__title">{{ $t('banner.currency-title') }}</h3>
						<span class="currency-intro__rule" aria-hidden="true"></span>
						<h5 class="currency-intro__lead">{{ $t('banner.text-banner-4') }}</h5>
					</div>
				</div>

				<div class="col-12 col-lg-6">
					<div class="currency-intro__card" data-reveal>
						<!-- Courbe décorative, sans donnée réelle -->
						<svg class="currency-intro__chart" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
							<defs>
								<linearGradient id="chart-stroke" x1="0" x2="1" y1="0" y2="0">
									<stop offset="0" stop-color="#ffaf02" stop-opacity="0.2" />
									<stop offset="1" stop-color="#ffaf02" />
								</linearGradient>
							</defs>
							<path d="M0 90 L40 70 L80 80 L120 45 L160 60 L200 30 L240 50 L280 20 L320 40 L360 14 L400 26" pathLength="1" fill="none" stroke="url(#chart-stroke)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<p>{{ $t('banner.text-banner-5') }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref } from 'vue';
	import { useReveal } from '@/composables/useReveal';

	const root = ref(null);
	useReveal(root);
</script>

<style scoped>
	.currency-intro {
		position: relative;
		padding: 120px 0;
		background-image:
			linear-gradient(180deg, rgba(10, 12, 18, 0.92), rgba(13, 16, 77, 0.88)),
			url('/public/img/bg-img/bg-2.jpg');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		overflow: hidden;
	}

	/* Halo doré discret, pour la profondeur */
	.currency-intro::before {
		content: '';
		position: absolute;
		top: -220px;
		left: -160px;
		width: 620px;
		height: 620px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 175, 2, 0.14), transparent 60%);
		pointer-events: none;
	}

	.currency-intro .container {
		position: relative;
		z-index: 1;
	}

	.currency-intro [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.currency-intro [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.currency-intro__title {
		font-size: clamp(2.2rem, 4.2vw, 3.4rem);
		font-weight: 600;
		line-height: 1.15;
		color: #ffffff;
		margin-bottom: 18px;
	}

	.currency-intro__rule {
		display: block;
		width: 64px;
		height: 3px;
		margin: 0 0 26px;
		border-radius: 999px;
		background: #ffaf02;
	}

	.currency-intro__lead {
		font-size: 1.15rem;
		font-weight: 400;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.88);
		margin: 0;
	}

	.currency-intro__card {
		position: relative;
		padding: 36px 40px 40px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 20px;
		backdrop-filter: blur(10px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
			border-color 0.3s ease;
	}

	.currency-intro__card:hover {
		border-color: rgba(255, 175, 2, 0.45);
	}

	.currency-intro__chart {
		display: block;
		width: 100%;
		height: 110px;
		margin-bottom: 22px;
	}

	.currency-intro__chart path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}

	.currency-intro__card.is-visible .currency-intro__chart path {
		animation: draw-chart 2.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.4s forwards;
	}

	@keyframes draw-chart {
		to {
			stroke-dashoffset: 0;
		}
	}

	.currency-intro__card p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.85;
		color: rgba(255, 255, 255, 0.85);
	}

	@media (max-width: 991px) {
		.currency-intro {
			padding: 90px 0;
		}
		.currency-intro__card {
			margin-top: 48px;
		}
	}

	@media (max-width: 767px) {
		.currency-intro {
			padding: 72px 0;
			background-attachment: scroll;
		}
		.currency-intro__card {
			padding: 26px 24px 30px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.currency-intro [data-reveal],
		.currency-intro__card {
			transition: none;
		}
		.currency-intro__card.is-visible .currency-intro__chart path {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
