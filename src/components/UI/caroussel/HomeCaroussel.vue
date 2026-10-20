<template>
	<section
		class="hero-slider"
		role="region"
		aria-roledescription="carousel"
		aria-label="Présentation"
		tabindex="0"
		@mouseenter="pause"
		@mouseleave="resume"
		@focusin="pause"
		@focusout="resume"
		@keydown.left.prevent="prev"
		@keydown.right.prevent="next"
		@touchstart.passive="onTouchStart"
		@touchend.passive="onTouchEnd">
		<div class="hero-slider__track">
			<div
				v-for="(slide, index) in slides"
				:key="slide"
				class="hero-slider__slide"
				:class="{ 'is-active': index === current }"
				role="group"
				aria-roledescription="slide"
				:aria-label="`${index + 1} sur ${slides.length}`"
				:aria-hidden="index !== current">
				<div class="container">
					<div class="row align-items-center">
						<div class="col-12 col-md-7">
							<div class="hero-slider__content">
								<h2>{{ $t(`slider.slider_${slide}.title`) }}</h2>
								<p>{{ $t(`slider.slider_${slide}.description`) }}</p>
								<a href="#" class="btn cryptos-btn">{{ $t('readmore') }}</a>
							</div>
						</div>
						<div class="col-12 col-md-5">
							<div class="hero-slider__media">
								<img :src="images[slide].src" :style="{ objectPosition: images[slide].position }" alt="" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<button
			type="button"
			class="hero-slider__nav hero-slider__nav--prev"
			aria-label="Diapositive précédente"
			@click="prev">
			&#8249;
		</button>
		<button
			type="button"
			class="hero-slider__nav hero-slider__nav--next"
			aria-label="Diapositive suivante"
			@click="next">
			&#8250;
		</button>

		<div class="hero-slider__dots">
			<button
				v-for="slide in slides"
				:key="slide"
				type="button"
				class="hero-slider__dot"
				:class="{ 'is-active': slide - 1 === current }"
				:aria-label="`Aller à la diapositive ${slide}`"
				:aria-current="slide - 1 === current"
				@click="goTo(slide - 1)"></button>
		</div>

		<div class="hero-slider__progress" aria-hidden="true">
			<span
				:key="`${current}-${cycle}`"
				:class="{ 'is-paused': isPaused }"
				:style="{ animationDuration: `${INTERVAL}ms` }"></span>
		</div>
	</section>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue';

	const INTERVAL = 6000;
	const slides = [1, 2, 3];

	// Une image par diapositive, recadrée en carré
	const images = {
		1: { src: '/public/img/concept-nft-futuriste-plat_23-2148936480.jpg', position: 'center' },
		2: { src: '/public/img/bg-img/bg-1.jpg', position: '30% center' },
		3: { src: '/public/img/bg-img/bg-3.jpg', position: 'center' },
	};

	const current = ref(0);
	const cycle = ref(0);
	const isPaused = ref(false);
	let timer = null;
	let touchStartX = null;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	const stop = () => {
		clearTimeout(timer);
		timer = null;
	};

	const start = () => {
		stop();
		cycle.value += 1;
		if (isPaused.value || reducedMotion.matches) return;
		timer = setTimeout(next, INTERVAL);
	};

	const goTo = (index) => {
		current.value = (index + slides.length) % slides.length;
		start();
	};
	const next = () => goTo(current.value + 1);
	const prev = () => goTo(current.value - 1);

	const pause = () => {
		isPaused.value = true;
		stop();
	};
	const resume = () => {
		isPaused.value = false;
		start();
	};

	const onTouchStart = (event) => {
		touchStartX = event.changedTouches[0].clientX;
	};
	const onTouchEnd = (event) => {
		if (touchStartX === null) return;
		const delta = event.changedTouches[0].clientX - touchStartX;
		touchStartX = null;
		if (Math.abs(delta) < 50) return;
		delta < 0 ? next() : prev();
	};

	onMounted(start);
	onBeforeUnmount(stop);
</script>

<style scoped>
	.hero-slider {
		position: relative;
		width: 100%;
		padding: 80px 0 110px;
		overflow: hidden;
		background: linear-gradient(to right, #0d104d, #28408b);
		outline: none;
	}

	.hero-slider__track {
		display: grid;
	}

	/* Toutes les diapositives partagent la même cellule : la hauteur suit la plus grande */
	.hero-slider__slide {
		grid-area: 1 / 1;
		opacity: 0;
		visibility: hidden;
		transform: translateX(32px);
		transition:
			opacity 0.7s ease,
			transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
			visibility 0.7s;
	}

	.hero-slider__slide.is-active {
		opacity: 1;
		visibility: visible;
		transform: none;
	}

	.hero-slider__content > * {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	.hero-slider__slide.is-active .hero-slider__content > * {
		opacity: 1;
		transform: none;
	}

	.hero-slider__slide.is-active .hero-slider__content > :nth-child(1) {
		transition-delay: 0.15s;
	}
	.hero-slider__slide.is-active .hero-slider__content > :nth-child(2) {
		transition-delay: 0.3s;
	}
	.hero-slider__slide.is-active .hero-slider__content > :nth-child(3) {
		transition-delay: 0.45s;
	}

	.hero-slider__content h2 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 600;
		line-height: 1.15;
		color: #ffffff;
		margin-bottom: 24px;
	}

	.hero-slider__content p {
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: 36px;
		max-width: 620px;
	}

	.hero-slider__media {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero-slider__media img {
		width: 100%;
		max-width: 460px;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 16px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
	}

	.hero-slider__nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		font-size: 28px;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			color 0.25s ease;
	}

	.hero-slider__nav:hover,
	.hero-slider__nav:focus-visible {
		background: #ffaf02;
		border-color: #ffaf02;
		color: #0d104d;
		outline: none;
	}

	.hero-slider__nav--prev {
		left: 24px;
	}

	.hero-slider__nav--next {
		right: 24px;
	}

	.hero-slider__dots {
		position: absolute;
		left: 50%;
		bottom: 36px;
		transform: translateX(-50%);
		z-index: 2;
		display: flex;
		gap: 10px;
	}

	.hero-slider__dot {
		width: 10px;
		height: 10px;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.4);
		cursor: pointer;
		transition:
			width 0.3s ease,
			background-color 0.3s ease;
	}

	.hero-slider__dot.is-active {
		width: 28px;
		background: #ffaf02;
	}

	.hero-slider__dot:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 3px;
	}

	.hero-slider__progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.12);
		z-index: 2;
	}

	.hero-slider__progress span {
		display: block;
		height: 100%;
		background: #ffaf02;
		transform-origin: left center;
		animation-name: hero-slider-progress;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	.hero-slider__progress span.is-paused {
		animation-play-state: paused;
	}

	@keyframes hero-slider-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@media (max-width: 991px) {
		.hero-slider {
			padding: 60px 0 100px;
		}
		.hero-slider__nav {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.hero-slider__media img {
			max-width: 260px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-slider__slide,
		.hero-slider__content > *,
		.hero-slider__dot,
		.hero-slider__nav {
			transition: none;
		}
		.hero-slider__progress {
			display: none;
		}
	}
</style>
