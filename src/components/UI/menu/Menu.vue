<template>
	<div class="site-nav" :class="{ 'is-open': open }">
		<nav class="site-nav__bar container" aria-label="Navigation principale">
			<router-link to="/" class="site-nav__brand" aria-label="Adebaka, accueil" @click="close">
				<BrandLogo />
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
		{ to: '/news', key: 'menu.news' },
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
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: #ffffff;
		border-bottom: 1px solid #eef0f6;
		box-shadow: 0 6px 20px rgba(13, 16, 77, 0.04);
	}

	.site-nav__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
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
		color: #4a4f6a;
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
		color: #0d104d;
		outline: none;
	}

	.site-nav__link:hover::after,
	.site-nav__link:focus-visible::after,
	.site-nav__link.router-link-exact-active::after {
		transform: scaleX(1);
	}

	/* Bouton mobile : trois traits qui deviennent une croix */
	.site-nav__toggle {
		display: none;
		position: relative;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.site-nav__toggle span {
		position: absolute;
		left: 11px;
		right: 11px;
		height: 2px;
		border-radius: 2px;
		background: #0d104d;
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
		border-radius: 8px;
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
		.site-nav__toggle {
			display: block;
		}

		/* Panneau déroulant sous la barre */
		.site-nav__links {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 8px 0;
			background: #ffffff;
			border-bottom: 1px solid #eef0f6;
			box-shadow: 0 16px 30px rgba(13, 16, 77, 0.1);
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
			color: #0d104d;
			background: #fff8e6;
			box-shadow: inset 3px 0 0 #ffaf02;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-nav__link,
		.site-nav__link::after,
		.site-nav__toggle span,
		.site-nav__links {
			transition: none;
		}
	}
</style>
