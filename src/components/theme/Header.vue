<template>
	<header v-if="!$route.path.startsWith('/app')" class="site-header" :class="{ 'is-open': open }">
		<div class="site-header__bar">
			<router-link to="/" class="site-header__brand" aria-label="Adebaka, accueil" @click="close">
				<BrandLogo inverse />
			</router-link>

			<nav class="site-header__nav" aria-label="Navigation principale">
				<ul id="site-nav-links" class="site-header__links">
					<li v-for="item in links" :key="item.to">
						<router-link :to="item.to" class="site-header__link" @click="close">
							{{ $t(item.key) }}
						</router-link>
					</li>
				</ul>
			</nav>

			<div class="site-header__ad">
				<AdSlot />
			</div>

			<div class="site-header__actions">
				<div class="site-header__lang" role="group" :aria-label="$t('header.language')">
					<button
						v-for="code in LANGUAGES"
						:key="code"
						type="button"
						:class="{ 'is-active': locale === code }"
						:aria-pressed="locale === code"
						@click="setLocale(code)">
						{{ code.toUpperCase() }}
					</button>
				</div>

				<template v-if="!isLogged">
					<router-link to="/login" class="site-header__link site-header__link--plain" @click="close">
						{{ $t('menu.login') }}
					</router-link>
					<router-link to="/register" class="site-header__pill" @click="close">{{ $t('menu.register') }}</router-link>
				</template>

				<template v-else>
					<router-link to="/app" class="site-header__link site-header__link--plain" @click="close">
						<span class="site-header__avatar" aria-hidden="true">{{ initial }}</span>
						{{ $t('header.profile') }}
					</router-link>
					<a href="/logout" class="site-header__link site-header__link--plain" @click.prevent="logout()">
						{{ $t('menu.logout') }}
					</a>
				</template>
			</div>

			<button
				type="button"
				class="site-header__toggle"
				aria-controls="site-nav-links"
				:aria-expanded="open"
				:aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
				@click="open = !open">
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>

		<!-- Mobile : la publicité passe dans le panneau déplié -->
		<div class="site-header__panel-ad">
			<AdSlot />
		</div>
	</header>
</template>

<script setup>
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useI18n } from 'vue-i18n';
	import { useAuthStore } from '@/stores/auth';
	import { useI18nStore } from '@/stores/i18n';
	import { useLoadingStore } from '@/stores/loading';
	import BrandLogo from '@/components/theme/BrandLogo.vue';
	import AdSlot from '@/components/theme/AdSlot.vue';
	import router from '@/router/index';

	const LANGUAGES = ['fr', 'en'];
	const links = [
		{ to: '/', key: 'menu.home' },
		{ to: '/auctions', key: 'menu.auctions' },
		{ to: '/about', key: 'header.guide' },
		{ to: '/contact', key: 'menu.contact' },
	];

	const { locale } = useI18n();
	const { isAuthenticated, me } = storeToRefs(useAuthStore());
	const isLogged = isAuthenticated;
	const initial = computed(() => (me.value?.name ?? '?').charAt(0).toUpperCase());

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

	const logout = () => {
		close();
		useLoadingStore().setLoading(true);
		useAuthStore().logout();
		setTimeout(() => {
			useLoadingStore().setLoading(false);
			router.push('/login');
		}, 1500);
	};

	// Change la langue sur place, sans quitter la page
	const setLocale = (code) => {
		locale.value = code;
		localStorage.setItem('auction-local', code);
		useI18nStore().changeLanguage(code);
	};
</script>

<style scoped>
	/* Une seule barre noire, collée en haut de la page */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: linear-gradient(90deg, #0a0c24 0%, #0d104d 100%);
		border-bottom: 1px solid rgba(255, 175, 2, 0.35);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
		color: #ffffff;
	}

	.site-header__bar {
		display: grid;
		grid-template-columns: auto 1fr minmax(0, 360px) auto;
		align-items: center;
		gap: 24px;
		height: 64px;
		padding: 0 30px;
	}

	.site-header__brand {
		text-decoration: none;
	}

	.site-header__links {
		display: flex;
		align-items: center;
		gap: 28px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.site-header__link {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 0;
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	/* Soulignement doré au survol, au focus et sur la page active */
	.site-header__link::after {
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

	.site-header__link:hover,
	.site-header__link:focus-visible,
	.site-header__link.router-link-active {
		color: #ffffff;
		outline: none;
	}

	.site-header__link:hover::after,
	.site-header__link:focus-visible::after,
	.site-header__link.router-link-active::after {
		transform: scaleX(1);
	}

	.site-header__link--plain::after {
		display: none;
	}

	.site-header__link--plain:hover {
		color: #ffaf02;
	}

	.site-header__nav {
		min-width: 0;
	}

	.site-header__ad {
		min-width: 0;
	}

	.site-header__actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.site-header__pill {
		padding: 6px 16px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0a0c24;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.site-header__pill:hover,
	.site-header__pill:focus-visible {
		background: #ffd166;
		transform: translateY(-1px);
		outline: none;
	}

	.site-header__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #ffaf02;
		color: #0a0c24;
		font-size: 12px;
		font-weight: 600;
	}

	/* Sélecteur de langue : le choix actif est doré */
	.site-header__lang {
		display: inline-flex;
		padding: 2px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
	}

	.site-header__lang button {
		padding: 3px 10px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
	}

	.site-header__lang button:hover {
		color: #ffffff;
	}

	.site-header__lang button.is-active {
		background: #ffaf02;
		color: #0a0c24;
	}

	.site-header__lang button:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	.site-header__toggle {
		display: none;
		width: 42px;
		height: 42px;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.site-header__toggle span {
		display: block;
		width: 22px;
		height: 2px;
		margin: 5px auto;
		border-radius: 2px;
		background: #ffffff;
		transition: transform 0.25s ease, opacity 0.25s ease;
	}

	.site-header__panel-ad {
		display: none;
	}

	/* Écrans étroits : liens et actions passent dans un panneau déplié */
	@media (max-width: 1199px) {
		.site-header__bar {
			grid-template-columns: auto 1fr auto;
		}
		.site-header__ad {
			display: none;
		}
	}

	@media (max-width: 991px) {
		.site-header__bar {
			grid-template-columns: auto 1fr;
			height: auto;
			min-height: 64px;
			padding: 0 20px;
		}
		.site-header__brand {
			grid-column: 1;
			grid-row: 1;
		}
		.site-header__toggle {
			display: block;
			grid-column: 2;
			grid-row: 1;
			justify-self: end;
		}
		.site-header__nav,
		.site-header__actions {
			display: none;
		}
		.site-header.is-open .site-header__nav,
		.site-header.is-open .site-header__actions {
			display: flex;
		}
		.site-header.is-open .site-header__nav {
			grid-column: 1 / -1;
		}
		.site-header__nav {
			grid-column: 1 / -1;
		}
		.site-header__links {
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			width: 100%;
		}
		.site-header__links .site-header__link {
			padding: 12px 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		}
		.site-header__actions .site-header__link {
			padding: 8px 0;
		}
		.site-header__actions {
			grid-column: 1 / -1;
			flex-wrap: wrap;
			padding-bottom: 14px;
		}
		.site-header.is-open .site-header__panel-ad {
			display: block;
			padding: 0 20px 16px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-header__link::after,
		.site-header__link,
		.site-header__pill {
			transition: none;
		}
	}
</style>
