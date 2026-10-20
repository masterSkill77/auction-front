<template>
	<Transition name="preloader">
		<div
			v-if="loading"
			class="preloader"
			role="status"
			aria-live="polite"
			aria-label="Chargement en cours">
			<div class="preloader__content">
				<div class="preloader__mark">
					<span class="preloader__ring" aria-hidden="true"></span>
					<svg viewBox="0 0 32 32" aria-hidden="true">
						<circle cx="16" cy="16" r="16" fill="#ffaf02" />
						<path d="M9 23 16 9l7 14h-3.4L16 15.8 12.4 23z" fill="#292929" />
					</svg>
				</div>

				<p class="preloader__name">Adebaka</p>

				<span class="preloader__bar" aria-hidden="true"><span></span></span>
			</div>
		</div>
	</Transition>
</template>

<script setup>
	import { storeToRefs } from 'pinia';
	import { useLoadingStore } from '@/stores/loading';

	const { loading } = storeToRefs(useLoadingStore());
</script>

<style scoped>
	.preloader {
		position: fixed;
		inset: 0;
		z-index: 5147483650;
		display: flex;
		align-items: center;
		justify-content: center;
		background:
			radial-gradient(circle at 30% 20%, rgba(255, 175, 2, 0.14), transparent 50%),
			linear-gradient(135deg, #0d104d, #28408b);
	}

	.preloader__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 22px;
	}

	.preloader__mark {
		position: relative;
		width: 104px;
		height: 104px;
		display: grid;
		place-items: center;
	}

	/* Anneau doré qui tourne autour de la marque */
	.preloader__ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 3px solid rgba(255, 255, 255, 0.12);
		border-top-color: #ffaf02;
		animation: preloader-spin 1.1s linear infinite;
	}

	.preloader__mark svg {
		width: 56px;
		height: 56px;
		animation: preloader-breathe 1.6s ease-in-out infinite;
	}

	.preloader__name {
		margin: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #ffffff;
	}

	/* Barre de progression indéterminée */
	.preloader__bar {
		position: relative;
		width: 140px;
		height: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.15);
		overflow: hidden;
	}

	.preloader__bar span {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 40%;
		border-radius: inherit;
		background: #ffaf02;
		animation: preloader-slide 1.4s ease-in-out infinite;
	}

	.preloader-leave-active {
		transition: opacity 0.4s ease;
	}

	.preloader-leave-to {
		opacity: 0;
	}

	@keyframes preloader-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes preloader-breathe {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.08);
		}
	}

	@keyframes preloader-slide {
		from {
			left: -40%;
		}
		to {
			left: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preloader__ring,
		.preloader__mark svg,
		.preloader__bar span {
			animation: none;
		}
		.preloader__bar span {
			left: 30%;
		}
		.preloader-leave-active {
			transition: none;
		}
	}
</style>
