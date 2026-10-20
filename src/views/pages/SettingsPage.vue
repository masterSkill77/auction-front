<template>
	<div ref="root" class="settings">
		<header class="settings__head" data-reveal>
			<h1>{{ $t('settings_page.title') }}</h1>
			<p>{{ $t('settings_page.lead') }}</p>
		</header>

		<div class="settings__grid">
			<!-- Informations personnelles -->
			<section class="block" data-reveal>
				<h2>{{ $t('settings_page.profile_title') }}</h2>
				<form class="form" novalidate @submit.prevent="saveProfile">
					<div class="field">
						<label for="settings-name">{{ $t('settings_page.name') }}</label>
						<input id="settings-name" v-model="profile.name" type="text" autocomplete="given-name" :aria-invalid="!!errors.name" />
						<small v-if="errors.name" class="field__error">{{ errors.name }}</small>
					</div>
					<div class="field">
						<label for="settings-lastname">{{ $t('settings_page.lastname') }}</label>
						<input id="settings-lastname" v-model="profile.lastname" type="text" autocomplete="family-name" :aria-invalid="!!errors.lastname" />
						<small v-if="errors.lastname" class="field__error">{{ errors.lastname }}</small>
					</div>
					<div class="field">
						<label for="settings-username">{{ $t('settings_page.username') }}</label>
						<input id="settings-username" v-model="profile.username" type="text" autocomplete="username" :aria-invalid="!!errors.username" />
						<small v-if="errors.username" class="field__error">{{ errors.username }}</small>
					</div>

					<p v-if="profileStatus" class="status" :class="`status--${profileStatus.type}`" role="status">{{ profileStatus.text }}</p>
					<button type="submit" class="btn-pill" :disabled="savingProfile">
						{{ savingProfile ? $t('settings_page.saving') : $t('settings_page.save') }}
					</button>
				</form>
			</section>

			<!-- Mot de passe -->
			<section class="block" data-reveal>
				<h2>{{ $t('settings_page.password_title') }}</h2>
				<p class="lead">{{ $t('settings_page.password_lead') }}</p>
				<form class="form" novalidate @submit.prevent="savePassword">
					<div class="field">
						<label for="settings-current-password">{{ $t('settings_page.current_password') }}</label>
						<input id="settings-current-password" v-model="passwords.current_password" type="password" autocomplete="current-password" :aria-invalid="!!errors.current_password" />
						<small v-if="errors.current_password" class="field__error">{{ errors.current_password }}</small>
					</div>
					<div class="field">
						<label for="settings-new-password">{{ $t('settings_page.new_password') }}</label>
						<input id="settings-new-password" v-model="passwords.password" type="password" autocomplete="new-password" :aria-invalid="!!errors.password" />
						<small v-if="errors.password" class="field__error">{{ errors.password }}</small>
					</div>
					<div class="field">
						<label for="settings-confirm-password">{{ $t('settings_page.confirm_password') }}</label>
						<input id="settings-confirm-password" v-model="passwords.password_confirmation" type="password" autocomplete="new-password" />
					</div>

					<p v-if="passwordStatus" class="status" :class="`status--${passwordStatus.type}`" role="status">{{ passwordStatus.text }}</p>
					<button type="submit" class="btn-pill" :disabled="savingPassword">
						{{ savingPassword ? $t('settings_page.saving') : $t('settings_page.save') }}
					</button>
				</form>
			</section>

			<!-- Langue -->
			<section class="block" data-reveal>
				<h2>{{ $t('settings_page.language_title') }}</h2>
				<p class="lead">{{ $t('settings_page.language_lead') }}</p>
				<div class="lang" role="group" :aria-label="$t('settings_page.language_title')">
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
			</section>

			<!-- Compte (lecture seule) -->
			<section class="block" data-reveal>
				<h2>{{ $t('settings_page.account_title') }}</h2>
				<dl class="account">
					<div>
						<dt>{{ $t('settings_page.email') }}</dt>
						<dd>{{ auth.me.email }}</dd>
					</div>
					<div v-if="auth.me.etherum_adress">
						<dt>{{ $t('settings_page.wallet') }}</dt>
						<dd class="account__wallet">{{ auth.me.etherum_adress }}</dd>
					</div>
				</dl>
				<p class="lead">{{ $t('settings_page.account_note') }}</p>
			</section>
		</div>
	</div>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { useAuthStore } from '@/stores/auth';
	import { useI18nStore } from '@/stores/i18n';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	// Le store démarre avec le chargement actif : cette page le retire elle-même
	useLoadingStore().setLoading(false);

	const root = ref(null);
	useReveal(root);

	const auth = useAuthStore();
	const { t, locale } = useI18n();
	const LANGUAGES = ['fr', 'en'];

	const profile = reactive({ name: '', lastname: '', username: '' });
	const passwords = reactive({ current_password: '', password: '', password_confirmation: '' });
	const errors = ref({});
	const profileStatus = ref(null);
	const passwordStatus = ref(null);
	const savingProfile = ref(false);
	const savingPassword = ref(false);

	const fillProfile = () => {
		profile.name = auth.me.name ?? '';
		profile.lastname = auth.me.lastname ?? '';
		profile.username = auth.me.username ?? '';
	};
	fillProfile();

	// Les erreurs 422 de Laravel sont rangées par champ ; les autres affichent un message général
	const handleError = (error, status) => {
		if (error.response?.status === 422 && error.response.data?.errors) {
			const fields = {};
			for (const [field, messages] of Object.entries(error.response.data.errors)) {
				fields[field] = messages[0];
			}
			errors.value = fields;
			return;
		}
		status.value = { type: 'error', text: t('settings_page.error') };
	};

	// Envoie toujours le profil courant : le backend exige les trois champs à chaque mise à jour
	const sendSettings = (extra = {}) =>
		auth.updateSettings({
			name: auth.me.name,
			lastname: auth.me.lastname,
			username: auth.me.username,
			...extra,
		});

	const saveProfile = async () => {
		errors.value = {};
		profileStatus.value = null;
		savingProfile.value = true;
		try {
			await auth.updateSettings({ ...profile });
			fillProfile();
			profileStatus.value = { type: 'success', text: t('settings_page.saved') };
		} catch (error) {
			handleError(error, profileStatus);
		} finally {
			savingProfile.value = false;
		}
	};

	const savePassword = async () => {
		errors.value = {};
		passwordStatus.value = null;
		savingPassword.value = true;
		try {
			await sendSettings({ ...passwords });
			passwords.current_password = '';
			passwords.password = '';
			passwords.password_confirmation = '';
			passwordStatus.value = { type: 'success', text: t('settings_page.password_saved') };
		} catch (error) {
			handleError(error, passwordStatus);
		} finally {
			savingPassword.value = false;
		}
	};

	// Change la langue sur place, comme le sélecteur du tableau de bord
	const setLocale = (code) => {
		locale.value = code;
		localStorage.setItem('auction-local', code);
		useI18nStore().changeLanguage(code);
	};
</script>

<style scoped>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 8px 0 40px;
		color: #0d104d;
	}

	.settings [data-reveal] {
		opacity: 0;
		transform: translateY(18px);
		transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.settings [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.settings__head h1 {
		margin: 0 0 6px;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.settings__head p {
		margin: 0;
		color: #7a7f96;
	}

	.settings__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 22px;
		align-items: start;
	}

	.block {
		padding: 28px 30px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 16px 40px rgba(13, 16, 77, 0.07);
	}

	.block h2 {
		margin: 0 0 10px;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.lead {
		margin: 0 0 18px;
		font-size: 14px;
		line-height: 1.6;
		color: #7a7f96;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field label {
		font-size: 13px;
		font-weight: 600;
	}

	.field input {
		width: 100%;
		padding: 11px 14px;
		border: 1px solid #d5d9e8;
		border-radius: 12px;
		background: #f6f7fb;
		color: #0d104d;
		font: inherit;
	}

	.field input:focus {
		border-color: #28408b;
		outline: 2px solid rgba(40, 64, 139, 0.2);
		outline-offset: 1px;
	}

	.field input[aria-invalid='true'] {
		border-color: #c0392b;
	}

	.field__error {
		font-size: 12px;
		color: #c0392b;
	}

	.status {
		margin: 0;
		font-size: 14px;
	}

	.status--success {
		color: #1e7b4a;
	}

	.status--error {
		color: #c0392b;
	}

	.btn-pill {
		align-self: flex-start;
		padding: 10px 22px;
		border: 0;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-pill:hover,
	.btn-pill:focus-visible {
		background: #28408b;
		outline: none;
	}

	.btn-pill:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.lang {
		display: inline-flex;
		gap: 6px;
		padding: 4px;
		border-radius: 999px;
		background: #f6f7fb;
	}

	.lang button {
		min-width: 56px;
		padding: 8px 14px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: #0d104d;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.lang button.is-active {
		background: #ffaf02;
		color: #0d104d;
	}

	.account {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin: 0 0 16px;
	}

	.account dt {
		font-size: 13px;
		color: #7a7f96;
	}

	.account dd {
		margin: 2px 0 0;
		font-weight: 600;
	}

	.account__wallet {
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		word-break: break-all;
	}

	@media (max-width: 860px) {
		.settings__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
