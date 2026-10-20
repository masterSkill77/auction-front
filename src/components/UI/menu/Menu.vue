<template>
	<div class="site-nav" :class="{ 'is-open': open }">
		<nav class="site-nav__bar" aria-label="Navigation principale">
			<router-link to="/" class="site-nav__brand" aria-label="Adebaka, accueil" @click="close">
				<BrandLogo inverse />
			</router-link>

			<ul id="site-nav-links" class="site-nav__links">
				<li v-for="item in links" :key="item.to">
					<router-link :to="item.to" class="site-nav__link" @click="close">
						{{ $t(item.key) }}
					</router-link>
				</li>
			</ul>

			<button
				type="button"
				class="site-nav__toggle"
				aria-controls="site-nav-links"
				:aria-expanded="open"
				:aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
				@click="open = !open">
				<span></span>
				<span></span>
				<span></span>
			</button>
		</nav>
	</div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import BrandLogo from '@/components/theme/BrandLogo.vue';

	const links = [
		{ to: '/', key: 'menu.home' },
		{ to: '/auctions', key: 'menu.auctions' },
		{ to: '/about', key: 'menu.about' },
		{ to: '/contact', key: 'menu.contact' },
	];

	const open = ref(false);
	const close = () => (open.value = false);

	const onKeydown = (event) => {
		if (event.key === 'Escape') close();
	};
	const onResize = () => {
		if (window.innerWidth >= 992) close();
	};

	onMounted(() => {
		window.addEventListener('keydown', onKeydown);
		window.addEventListener('resize', onResize);
	});
	onBeforeUnmount(() => {
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('resize', onResize);
	});
</script>

<style scoped>
	/* Barre pleine largeur, plus sombre que le hero, avec un filet doré pour la détacher */
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: linear-gradient(90deg, #0a0c24 0%, #0d104d 100%);
		border-bottom: 1px solid rgba(255, 175, 2, 0.35);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
	}

	.site-nav__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
		padding: 0 30px;
	}

	.site-nav__brand {
		text-decoration: none;
		flex-shrink: 0;
	}

	.site-nav__links {
		display: flex;
		align-items: center;
		gap: 36px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.site-nav__link {
		position: relative;
		display: inline-block;
		padding: 8px 0;
		font-size: 15px;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: rgba(255, 255, 255, 0.78);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	/* Soulignement doré : au survol, au focus et sur la page active */
	.site-nav__link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		border-radius: 2px;
		background: #ffaf02;
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 0.3s ease;
	}

	.site-nav__link:hover,
	.site-nav__link:focus-visible,
	.site-nav__link.router-link-exact-active {
		color: #ffffff;
		outline: none;
	}

	.site-nav__link:hover::after,
	.site-nav__link:focus-visible::after,
	.site-nav__link.router-link-exact-active::after {
		transform: scaleX(1);
	}

	/* Bouton mobile : trois traits blancs qui deviennent une croix */
	.site-nav__toggle {
		display: none;
		position: relative;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.08);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.site-nav__toggle:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.site-nav__toggle span {
		position: absolute;
		left: 12px;
		right: 12px;
		height: 2px;
		border-radius: 2px;
		background: #ffffff;
		transition: transform 0.3s ease, opacity 0.2s ease;
	}

	.site-nav__toggle span:nth-child(1) {
		top: 15px;
	}
	.site-nav__toggle span:nth-child(2) {
		top: 21px;
	}
	.site-nav__toggle span:nth-child(3) {
		top: 27px;
	}

	.site-nav__toggle:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	.site-nav.is-open .site-nav__toggle span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}
	.site-nav.is-open .site-nav__toggle span:nth-child(2) {
		opacity: 0;
	}
	.site-nav.is-open .site-nav__toggle span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	@media (max-width: 991px) {
		.site-nav__bar {
			padding: 0 16px;
		}

		.site-nav__toggle {
			display: block;
		}

		/* Panneau déroulant sous la barre, dans la même couleur */
		.site-nav__links {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 8px 0;
			background: #0d104d;
			border-top: 1px solid rgba(255, 255, 255, 0.06);
			box-shadow: 0 16px 30px rgba(13, 16, 77, 0.3);
			opacity: 0;
			visibility: hidden;
			transform: translateY(-8px);
			transition:
				opacity 0.25s ease,
				transform 0.25s ease,
				visibility 0.25s;
		}

		.site-nav.is-open .site-nav__links {
			opacity: 1;
			visibility: visible;
			transform: none;
		}

		.site-nav__link {
			display: block;
			padding: 14px 24px;
			font-size: 16px;
		}

		.site-nav__link::after {
			display: none;
		}

		.site-nav__link.router-link-exact-active {
			color: #ffaf02;
			background: rgba(255, 175, 2, 0.1);
			box-shadow: inset 3px 0 0 #ffaf02;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-nav__link,
		.site-nav__link::after,
		.site-nav__toggle,
		.site-nav__toggle span,
		.site-nav__links {
			transition: none;
		}
	}
</style>
