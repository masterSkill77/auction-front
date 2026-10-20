<template>
	<header class="header-area" v-if="!$route.path.startsWith('/app')">
		<div class="top-bar">
			<div class="top-bar__inner">
				<p class="top-bar__welcome">
					{{ $t('header.welcome') }} <span>Adebaka</span>
				</p>

				<div class="top-bar__right">
					<router-link to="/about" class="top-bar__link">{{ $t('header.guide') }}</router-link>

					<template v-if="!isLogged">
						<router-link to="/login" class="top-bar__link">{{ $t('menu.login') }}</router-link>
						<router-link to="/register" class="top-bar__pill">{{ $t('menu.register') }}</router-link>
					</template>

					<template v-else>
						<router-link to="/app" class="top-bar__link top-bar__user">
							<span class="top-bar__avatar" aria-hidden="true">{{ initial }}</span>
							{{ $t('header.profile') }}
						</router-link>
						<a href="/logout" class="top-bar__link" @click.prevent="logout()">
							{{ $t('menu.logout') }}
						</a>
					</template>

					<div class="top-bar__lang" role="group" :aria-label="$t('header.language')">
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
				</div>
			</div>
		</div>
	</header>
	<Menu v-if="!$route.path.startsWith('/app')" />
</template>

<script setup>
	import { computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useI18n } from 'vue-i18n';
	import { useAuthStore } from '@/stores/auth';
	import Menu from '@/components/UI/menu/Menu.vue';
	import router from '@/router/index';
	import { useI18nStore } from '@/stores/i18n';
	import { useLoadingStore } from '@/stores/loading';

	const LANGUAGES = ['fr', 'en'];

	const { locale } = useI18n();
	const { isAuthenticated, me } = storeToRefs(useAuthStore());
	const isLogged = isAuthenticated;

	const initial = computed(() => (me.value?.name ?? '?').charAt(0).toUpperCase());

	const logout = () => {
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
	.top-bar {
		height: 40px;
		background: #0a0c24;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
	}

	/* Texte d'accueil à gauche, liens et langue à droite */
	.top-bar__inner {
		width: 100%;
		height: 100%;
		padding: 0 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.top-bar__welcome {
		margin: 0;
		white-space: nowrap;
	}

	.top-bar__welcome span {
		font-weight: 500;
		color: #ffaf02;
	}

	.top-bar__right {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.top-bar__link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.top-bar__link:hover,
	.top-bar__link:focus-visible {
		color: #ffaf02;
		outline: none;
	}

	.top-bar__pill {
		padding: 4px 14px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0a0c24;
		font-weight: 500;
		text-decoration: none;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.top-bar__pill:hover,
	.top-bar__pill:focus-visible {
		background: #ffd166;
		transform: translateY(-1px);
		outline: none;
	}

	.top-bar__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #ffaf02;
		color: #0a0c24;
		font-size: 11px;
		font-weight: 600;
	}

	/* Sélecteur de langue : deux boutons, celui de la langue active est doré */
	.top-bar__lang {
		display: inline-flex;
		padding: 2px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
	}

	.top-bar__lang button {
		padding: 3px 10px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.top-bar__lang button:hover {
		color: #ffffff;
	}

	.top-bar__lang button.is-active {
		background: #ffaf02;
		color: #0a0c24;
	}

	.top-bar__lang button:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	@media (max-width: 767px) {
		.top-bar {
			height: auto;
			padding: 6px 0;
		}
		.top-bar__inner {
			flex-wrap: wrap;
			justify-content: flex-end;
		}
		.top-bar__welcome {
			display: none;
		}
		.top-bar__right {
			gap: 12px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.top-bar__link,
		.top-bar__pill,
		.top-bar__lang button {
			transition: none;
		}
	}
</style>
