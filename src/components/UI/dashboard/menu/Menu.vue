<template>
	<nav class="side-nav" aria-label="Menu du tableau de bord">
		<p class="side-nav__section">{{ $t('menu.section_main') }}</p>
		<ul class="side-nav__list">
			<li v-for="item in mainLinks" :key="item.to">
				<router-link
					:to="item.to"
					:exact-active-class="item.exact ? 'is-active' : undefined"
					:active-class="item.exact ? undefined : 'is-active'"
					class="side-nav__link">
					<span class="side-nav__icon dw" :class="item.icon" aria-hidden="true"></span>
					<span>{{ $t(item.label) }}</span>
				</router-link>
			</li>
		</ul>

		<p class="side-nav__section">{{ $t('menu.section_manage') }}</p>
		<ul class="side-nav__list">
			<li v-for="item in manageLinks" :key="item.to">
				<router-link :to="item.to" active-class="is-active" class="side-nav__link">
					<span class="side-nav__icon dw" :class="item.icon" aria-hidden="true"></span>
					<span>{{ $t(item.label) }}</span>
				</router-link>
			</li>
				<li>
					<button type="button" class="side-nav__link side-nav__link--danger" @click="logout">
						<span class="side-nav__icon dw dw-logout-1" aria-hidden="true"></span>
						<span>{{ $t('menu.logout') }}</span>
					</button>
				</li>
		</ul>

		<div class="side-nav__footer">
			<div class="side-nav__lang" role="group" aria-label="Langue">
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
	</nav>
</template>

<script setup>
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { useAuthStore } from '@/stores/auth';
	import { useI18nStore } from '@/stores/i18n';
	import { useLoadingStore } from '@/stores/loading';

	const LANGUAGES = ['fr', 'en'];

	const router = useRouter();
	const { locale } = useI18n();

	// Le store démarre avec le chargement actif : on le retire une fois le tableau de bord affiché
	setTimeout(() => useLoadingStore().setLoading(false), 1500);

	const mainLinks = [
		{ to: '/app', label: 'menu.home', icon: 'dw-house-1', exact: true },
		{ to: '/app/nfts', label: 'menu.mynft', icon: 'dw-folder-2' },
		{ to: '/app/auctions', label: 'menu.myauctions', icon: 'dw-shopping-basket-1' },
	];

	const manageLinks = [
		{ to: '/app/chat', label: 'menu.chat', icon: 'dw-chat3' },
		{ to: '/app/create', label: 'menu.create', icon: 'dw-diagram' },
		{ to: '/app/packs', label: 'menu.pack', icon: 'dw-shopping-cart2' },
		{ to: '/app/settings', label: 'menu.settings', icon: 'dw-settings' },
	];

	const logout = () => {
		useLoadingStore().setLoading(true);
		useAuthStore().logout();
		router.push('/login');
		setTimeout(() => useLoadingStore().setLoading(false), 1500);
	};

	// Change la langue sur place, sans quitter la page
	const setLocale = (code) => {
		locale.value = code;
		localStorage.setItem('auction-local', code);
		useI18nStore().changeLanguage(code);
	};
</script>

<style scoped>
	/* Occupe la place sous le logo ; défile si le contenu déborde */
	.side-nav {
		display: flex;
		flex: 1 1 auto;
		min-height: 0;
		flex-direction: column;
		overflow-y: auto;
		padding: 10px 0 16px;
		color: #ffffff;
	}

	.side-nav__section {
		margin: 14px 24px 6px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
	}

	.side-nav__section:first-child {
		margin-top: 4px;
	}

	.side-nav__list {
		margin: 0;
		padding: 0 12px;
		list-style: none;
	}

	.side-nav__link {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		height: 40px;
		padding: 0 14px;
		border: 0;
		border-radius: 12px;
		background: transparent;
		color: rgba(255, 255, 255, 0.78);
		font-family: inherit;
		font-size: 15px;
		font-weight: 500;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.side-nav__link:hover,
	.side-nav__link:focus-visible {
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
		outline: none;
	}

	/* Page active : fond doré translucide et barre dorée à gauche */
	.side-nav__link.is-active {
		background: rgba(255, 175, 2, 0.14);
		color: #ffaf02;
	}

	.side-nav__link.is-active::before {
		content: '';
		position: absolute;
		left: -12px;
		top: 10px;
		bottom: 10px;
		width: 3px;
		border-radius: 0 3px 3px 0;
		background: #ffaf02;
	}

	.side-nav__icon {
		width: 22px;
		flex-shrink: 0;
		font-size: 19px;
		text-align: center;
		color: inherit;
	}

	.side-nav__footer {
		margin-top: auto;
		padding: 14px 24px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.side-nav__lang {
		display: flex;
		width: fit-content;
		margin: 0 auto 14px;
		padding: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
	}

	.side-nav__lang button {
		padding: 4px 14px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.side-nav__lang button.is-active {
		background: #ffaf02;
		color: #0a0c24;
	}

	.side-nav__lang button:focus-visible {
		outline: 2px solid #ffaf02;
		outline-offset: 2px;
	}

	/* Déconnexion : même place que les autres liens, en rouge */
	.side-nav__link--danger {
		color: #ff8a80;
	}

	.side-nav__link--danger:hover,
	.side-nav__link--danger:focus-visible {
		background: rgba(217, 48, 37, 0.16);
		color: #ff6b5e;
	}

	@media (prefers-reduced-motion: reduce) {
		.side-nav__link,
		.side-nav__lang button {
			transition: none;
		}
	}
</style>
