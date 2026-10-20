<template>
	<div class="guide" ref="root">
		<!-- Définition du NFT -->
		<section class="guide-intro">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-12 col-lg-6">
						<div class="guide-intro__text" data-reveal>
							<h2>{{ $t('guide.crypto_about_area.title') }}</h2>
							<span class="guide-rule" aria-hidden="true"></span>
							<p>{{ $t('guide.crypto_about_area.description_1') }}</p>
							<p>{{ $t('guide.crypto_about_area.description_2') }}</p>
						</div>
					</div>
					<div class="col-12 col-lg-6">
						<figure class="guide-intro__media" data-reveal>
							<img src="/public/img/bg-img/about.png" alt="" loading="lazy" />
						</figure>
					</div>
				</div>

				<blockquote class="guide-quote" data-reveal>
					{{ $t('guide.crypto_about_area.description_3') }}
				</blockquote>
			</div>
		</section>

		<!-- Utilisation de la plateforme -->
		<section class="guide-steps">
			<div class="container">
				<header class="guide-steps__head" data-reveal>
					<h2>{{ $t('guide.plateforme_area.title') }}</h2>
					<span class="guide-rule" aria-hidden="true"></span>
					<p>{{ $t('guide.plateforme_area.description') }}</p>
				</header>

				<ol class="guide-steps__list">
					<li
						v-for="(step, index) in steps"
						:key="step"
						class="guide-step"
						data-reveal
						:style="{ transitionDelay: `${index * 120}ms` }">
						<span class="guide-step__num">{{ String(index + 1).padStart(2, '0') }}</span>
						<h3>{{ $t(`guide.plateforme_area.${step}.title`) }}</h3>
						<p>{{ $t(`guide.plateforme_area.${step}.description`) }}</p>
					</li>
				</ol>
			</div>
		</section>

		<!-- Appel à l'action et vidéo -->
		<section class="guide-cta">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-12 col-lg-6">
						<div class="guide-cta__text" data-reveal>
							<h2>{{ $t('guide.about_start_area.title') }}</h2>
							<p>{{ $t('guide.about_start_area.description') }}</p>
							<router-link to="/register" class="btn cryptos-btn">
								{{ $t('guide.join') }}
							</router-link>
						</div>
					</div>
					<div class="col-12 col-lg-6">
						<a
							class="guide-video"
							href="https://www.youtube.com/watch?v=f5BBJ4ySgpo"
							target="_blank"
							rel="noopener"
							:aria-label="$t('guide.watch_video')"
							data-reveal>
							<img src="/public/img/bg-img/bg-4.jpg" alt="" loading="lazy" />
							<span class="guide-video__play" aria-hidden="true"></span>
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	const root = ref(null);
	const steps = ['action_1', 'action_2', 'action_3'];

	useReveal(root);

	useLoadingStore().setLoading(true);
	setTimeout(() => useLoadingStore().setLoading(false), 1500);
</script>

<style scoped>
	.guide [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.guide [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.guide-rule {
		display: block;
		width: 56px;
		height: 3px;
		margin: 18px 0 24px;
		border-radius: 999px;
		background: #ffaf02;
	}

	/* Définition */
	.guide-intro {
		padding: 110px 0 80px;
		background: #f6f7fb;
	}

	.guide-intro h2 {
		font-size: clamp(2rem, 3.6vw, 2.9rem);
		font-weight: 600;
		line-height: 1.2;
		color: #0d104d;
		margin: 0;
	}

	.guide-intro p {
		font-size: 1.05rem;
		line-height: 1.85;
		color: #4a4f6a;
		margin-bottom: 18px;
	}

	.guide-intro__media {
		margin: 0;
	}

	.guide-intro__media img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		border-radius: 20px;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.18);
	}

	.guide-quote {
		position: relative;
		max-width: 880px;
		margin: 64px auto 0;
		padding: 32px 40px 32px 44px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-left: 4px solid #ffaf02;
		border-radius: 16px;
		font-size: 1.15rem;
		line-height: 1.8;
		font-style: italic;
		color: #0d104d;
		box-shadow: 0 12px 30px rgba(13, 16, 77, 0.06);
	}

	/* Étapes */
	.guide-steps {
		position: relative;
		padding: 100px 0;
		background:
			linear-gradient(180deg, rgba(10, 12, 18, 0.93), rgba(13, 16, 77, 0.9)),
			url('/public/img/bg-img/bg-3.jpg');
		background-size: cover;
		background-position: center;
		color: #ffffff;
	}

	.guide-steps__head {
		max-width: 680px;
		margin: 0 auto 56px;
		text-align: center;
	}

	.guide-steps__head h2 {
		font-size: clamp(2rem, 3.6vw, 2.9rem);
		font-weight: 600;
		color: #ffffff;
		margin: 0;
	}

	.guide-steps__head .guide-rule {
		margin: 18px auto 22px;
	}

	.guide-steps__head p {
		font-size: 1.05rem;
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
	}

	.guide-steps__list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: step;
	}

	.guide-step {
		position: relative;
		padding: 32px 28px 30px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 20px;
		backdrop-filter: blur(8px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
			border-color 0.3s ease;
	}

	.guide-step:hover {
		border-color: rgba(255, 175, 2, 0.5);
	}

	.guide-step__num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: 22px;
		border-radius: 50%;
		background: #ffaf02;
		color: #0d104d;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.guide-step h3 {
		font-size: 1.2rem;
		font-weight: 600;
		line-height: 1.35;
		color: #ffffff;
		margin-bottom: 14px;
	}

	.guide-step p {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.78);
	}

	/* Appel à l'action */
	.guide-cta {
		padding: 110px 0;
		background: #f6f7fb;
	}

	.guide-cta h2 {
		font-size: clamp(2rem, 3.6vw, 2.9rem);
		font-weight: 600;
		line-height: 1.2;
		color: #0d104d;
		margin-bottom: 18px;
	}

	.guide-cta p {
		font-size: 1.05rem;
		line-height: 1.85;
		color: #4a4f6a;
		margin-bottom: 32px;
		max-width: 540px;
	}

	.guide-video {
		position: relative;
		display: block;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.2);
	}

	.guide-video img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.guide-video:hover img {
		transform: scale(1.03);
	}

	.guide-video::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 40%, rgba(13, 16, 77, 0.45));
	}

	/* Bouton lecture */
	.guide-video__play {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 1;
		width: 84px;
		height: 84px;
		margin: -42px 0 0 -42px;
		border-radius: 50%;
		background: #ffaf02;
		box-shadow: 0 0 0 12px rgba(255, 175, 2, 0.25);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.guide-video__play::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 54%;
		transform: translate(-50%, -50%);
		border-left: 22px solid #0d104d;
		border-top: 14px solid transparent;
		border-bottom: 14px solid transparent;
	}

	.guide-video:hover .guide-video__play,
	.guide-video:focus-visible .guide-video__play {
		transform: scale(1.08);
		box-shadow: 0 0 0 18px rgba(255, 175, 2, 0.2);
	}

	.guide-video:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 4px;
	}

	@media (max-width: 991px) {
		.guide-steps__list {
			grid-template-columns: 1fr;
		}
		.guide-intro,
		.guide-steps,
		.guide-cta {
			padding: 80px 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.guide [data-reveal],
		.guide-step,
		.guide-video img,
		.guide-video__play {
			transition: none;
		}
	}
</style>
