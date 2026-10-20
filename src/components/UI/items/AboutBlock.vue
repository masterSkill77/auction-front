<template>
	<section class="about-block" ref="root">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-12 col-md-6">
					<figure class="about-block__media" data-reveal>
						<img src="/public/img/bg-img/about.png" alt="" loading="lazy" />
					</figure>
				</div>
				<div class="col-12 col-md-6">
					<div class="about-block__content" data-reveal>
						<h3 class="about-block__title" v-html="$t('banner.2')"></h3>
						<p class="about-block__text">{{ $t('banner.text-banner-2') }}</p>
						<router-link to="/login" class="btn cryptos-btn about-block__cta">
							{{ $t('readmore') }}
							<span aria-hidden="true">&rarr;</span>
						</router-link>
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
	.about-block {
		padding: 110px 0;
		background: #f6f7fb;
	}

	.about-block [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.about-block [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.about-block__media {
		position: relative;
		margin: 0;
	}

	/* Halo doré derrière l'image */
	.about-block__media::before {
		content: '';
		position: absolute;
		inset: -18px -18px 18px 18px;
		border-radius: 24px;
		background: #ffaf02;
		opacity: 0.18;
		z-index: 0;
	}

	.about-block__media img {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		border-radius: 16px;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.18);
		transition: transform 0.6s ease;
	}

	.about-block__media:hover img {
		transform: scale(1.02);
	}

	.about-block__content {
		padding-left: 24px;
	}

	.about-block__title {
		font-size: clamp(1.9rem, 3.2vw, 2.75rem);
		font-weight: 300;
		line-height: 1.2;
		color: #0d104d;
		margin-bottom: 22px;
	}

	.about-block__title :deep(span) {
		font-weight: 600;
		color: #0d104d;
		background: linear-gradient(transparent 62%, rgba(255, 175, 2, 0.45) 62%);
	}

	.about-block__text {
		font-size: 1.05rem;
		line-height: 1.85;
		color: #4a4f6a;
		margin-bottom: 36px;
		max-width: 540px;
	}

	.about-block__cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		transition: gap 0.25s ease;
	}

	.about-block__cta:hover {
		gap: 16px;
	}

	@media (max-width: 767px) {
		.about-block {
			padding: 72px 0;
		}
		.about-block__content {
			padding-left: 0;
			margin-top: 40px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.about-block [data-reveal],
		.about-block__media img,
		.about-block__cta {
			transition: none;
		}
	}
</style>
