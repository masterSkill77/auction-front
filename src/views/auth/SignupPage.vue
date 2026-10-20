<template>
	<div class="signup" ref="root">
		<!-- Panneau de marque -->
		<aside class="signup__brand" aria-hidden="true">
			<div class="signup__brand-inner" data-reveal>
				<BrandLogo inverse />
				<h2>{{ $t('signup_page.brand_title') }}</h2>
				<p>{{ $t('signup_page.brand_text') }}</p>
			</div>
			<span class="signup__orb signup__orb--one"></span>
			<span class="signup__orb signup__orb--two"></span>
		</aside>

		<main class="signup__panel">
			<!-- Confirmation après inscription -->
			<div v-if="sentTo" class="signup-card signup-card--done" data-reveal role="status">
				<span class="signup-card__check" aria-hidden="true">
					<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
				</span>
				<h1>{{ $t('signup_page.success_title') }}</h1>
				<p>{{ $t('signup_page.success_text', { email: sentTo }) }}</p>
				<router-link to="/login" class="signup-card__submit">
					{{ $t('signup_page.login') }}
				</router-link>
			</div>

			<!-- Formulaire -->
			<form v-else class="signup-card" data-reveal novalidate @submit.prevent="submit">
				<header class="signup-card__head">
					<h1>{{ $t('signup_page.title') }}</h1>
					<p>{{ $t('signup_page.subtitle') }}</p>
				</header>

				<div class="signup-grid">
					<label class="signup-field">
						<span>{{ $t('signup_page.first_name') }}</span>
						<input v-model="form.name" type="text" autocomplete="given-name" required />
						<small v-if="errors.name" class="signup-field__error">{{ errors.name }}</small>
					</label>
					<label class="signup-field">
						<span>{{ $t('signup_page.last_name') }}</span>
						<input v-model="form.lastname" type="text" autocomplete="family-name" required />
						<small v-if="errors.lastname" class="signup-field__error">{{ errors.lastname }}</small>
					</label>
					<label class="signup-field">
						<span>{{ $t('signup_page.username') }}</span>
						<input v-model="form.username" type="text" autocomplete="username" required />
						<small v-if="errors.username" class="signup-field__error">{{ errors.username }}</small>
					</label>
					<label class="signup-field">
						<span>{{ $t('signup_page.email') }}</span>
						<input v-model="form.email" type="email" autocomplete="email" required />
						<small v-if="errors.email" class="signup-field__error">{{ errors.email }}</small>
					</label>
					<label class="signup-field">
						<span>{{ $t('signup_page.password') }}</span>
						<input v-model="form.password" type="password" autocomplete="new-password" required />
						<small v-if="errors.password" class="signup-field__error">{{ errors.password }}</small>
					</label>
					<label class="signup-field">
						<span>{{ $t('signup_page.password_confirm') }}</span>
						<input v-model="form.password_confirmation" type="password" autocomplete="new-password" required />
						<small v-if="errors.password_confirmation" class="signup-field__error">{{ errors.password_confirmation }}</small>
					</label>
					<label class="signup-field signup-field--full">
						<span>{{ $t('signup_page.wallet') }}</span>
						<input v-model="form.etherum_adress" type="text" placeholder="0x…" spellcheck="false" autocomplete="off" required />
						<small class="signup-field__hint">{{ $t('signup_page.wallet_hint') }}</small>
						<small v-if="errors.etherum_adress" class="signup-field__error">{{ errors.etherum_adress }}</small>
					</label>
				</div>

				<button type="submit" class="signup-card__submit" :disabled="submitting">
					<span v-if="submitting" class="signup-card__spinner" aria-hidden="true"></span>
					<span>{{ submitting ? $t('signup_page.submitting') : $t('signup_page.submit') }}</span>
				</button>

				<p class="signup-card__switch">
					{{ $t('signup_page.have_account') }}
					<router-link to="/login">{{ $t('signup_page.login') }}</router-link>
				</p>
			</form>
		</main>
	</div>
</template>

<script setup>
	import { ref, reactive, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { notify } from '@kyvg/vue3-notification';
	import BrandLogo from '@/components/theme/BrandLogo.vue';
	import axios from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	const router = useRouter();
	const { t } = useI18n();
	const auth = useAuthStore();

	const root = ref(null);
	const form = reactive({
		name: '',
		lastname: '',
		username: '',
		email: '',
		password: '',
		password_confirmation: '',
		etherum_adress: '',
	});
	const errors = reactive({});
	const submitting = ref(false);
	const sentTo = ref('');

	const WALLET_PATTERN = /^0x[a-fA-F0-9]{40}$/;

	useReveal(root);

	onMounted(() => {
		useLoadingStore().setLoading(true);
		setTimeout(() => useLoadingStore().setLoading(false), 1500);
		if (auth.isAuthenticated) router.push('/');
	});

	const clearErrors = () => {
		Object.keys(errors).forEach((key) => delete errors[key]);
	};

	// Contrôles faits avant l'envoi
	const checkLocally = () => {
		const problems = {};
		if (form.password.length < 8) problems.password = t('signup_page.short_password');
		if (form.password_confirmation !== form.password) {
			problems.password_confirmation = t('signup_page.mismatch');
		}
		if (!WALLET_PATTERN.test(form.etherum_adress)) {
			problems.etherum_adress = t('signup_page.invalid_wallet');
		}
		return problems;
	};

	const submit = async () => {
		if (submitting.value) return;
		clearErrors();

		const problems = checkLocally();
		if (Object.keys(problems).length) {
			Object.assign(errors, problems);
			return;
		}

		submitting.value = true;
		try {
			const { password_confirmation, ...payload } = form;
			await axios.post('/register', payload);
			sentTo.value = form.email;
		} catch (error) {
			const serverErrors = error.response?.data?.errors ?? {};
			const unknown = [];
			for (const [field, messages] of Object.entries(serverErrors)) {
				if (field in form) errors[field] = messages[0];
				else unknown.push(...messages);
			}
			if (!Object.keys(serverErrors).length || unknown.length) {
				notify({
					title: t('error.title'),
					text: unknown[0] ?? t('signup_page.error_generic'),
					type: 'error',
				});
			}
		} finally {
			submitting.value = false;
		}
	};
</script>

<style scoped>
	.signup [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.signup [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.signup {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		min-height: calc(100vh - 100px);
		background: #f6f7fb;
	}

	/* Panneau de marque */
	.signup__brand {
		position: relative;
		display: flex;
		align-items: center;
		padding: 80px 72px;
		overflow: hidden;
		background:
			radial-gradient(circle at 20% 20%, rgba(255, 175, 2, 0.14), transparent 45%),
			linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
	}

	.signup__brand-inner {
		position: relative;
		z-index: 1;
		max-width: 460px;
	}

	.signup__brand-inner h2 {
		margin: 40px 0 18px;
		font-size: clamp(2rem, 3.4vw, 2.8rem);
		font-weight: 600;
		line-height: 1.2;
		color: #ffffff;
	}

	.signup__brand-inner p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.82);
	}

	.signup__orb {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
	}

	.signup__orb--one {
		top: -120px;
		right: -120px;
		width: 380px;
		height: 380px;
		border: 1px solid rgba(255, 175, 2, 0.25);
	}

	.signup__orb--two {
		bottom: -160px;
		left: -100px;
		width: 340px;
		height: 340px;
		background: radial-gradient(circle, rgba(255, 175, 2, 0.12), transparent 65%);
	}

	/* Formulaire */
	.signup__panel {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 24px;
	}

	.signup-card {
		width: 100%;
		max-width: 640px;
		padding: 40px 40px 36px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 22px;
		box-shadow: 0 24px 60px rgba(13, 16, 77, 0.1);
	}

	.signup-card__head {
		margin-bottom: 28px;
	}

	.signup-card__head h1 {
		margin: 0 0 8px;
		font-size: 1.9rem;
		font-weight: 600;
		color: #0d104d;
	}

	.signup-card__head p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: #7a7f96;
	}

	.signup-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 20px;
	}

	.signup-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 18px;
	}

	.signup-field--full {
		grid-column: 1 / -1;
	}

	.signup-field > span:first-child {
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
	}

	.signup-field input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #dfe2ee;
		border-radius: 12px;
		background: #fafbfd;
		font-size: 15px;
		color: #0d104d;
		outline: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
	}

	.signup-field input:focus {
		border-color: #ffaf02;
		background: #ffffff;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.signup-field__hint {
		font-size: 12px;
		color: #9aa0b8;
	}

	.signup-field__error {
		font-size: 12px;
		font-weight: 600;
		color: #d93025;
	}

	.signup-card__submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 10px;
		padding: 14px 24px;
		border: 0;
		border-radius: 999px;
		background: linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		box-shadow: 0 12px 26px rgba(13, 16, 77, 0.25);
		transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
	}

	.signup-card__submit:hover:not(:disabled),
	.signup-card__submit:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		box-shadow: 0 14px 30px rgba(255, 175, 2, 0.4);
		transform: translateY(-2px);
		outline: none;
	}

	.signup-card__submit:disabled {
		opacity: 0.75;
		cursor: wait;
	}

	.signup-card__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: signup-spin 0.8s linear infinite;
	}

	.signup-card__switch {
		margin: 24px 0 0;
		text-align: center;
		font-size: 14px;
		color: #7a7f96;
	}

	.signup-card__switch a {
		font-weight: 600;
		color: #0d104d;
		text-decoration: none;
	}

	.signup-card__switch a:hover {
		color: #ffaf02;
	}

	/* Confirmation */
	.signup-card--done {
		max-width: 480px;
		text-align: center;
		padding: 52px 40px;
	}

	.signup-card__check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 68px;
		height: 68px;
		margin-bottom: 22px;
		border-radius: 50%;
		background: #e7f7ee;
	}

	.signup-card__check svg {
		width: 32px;
		height: 32px;
		fill: none;
		stroke: #0f9d58;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.signup-card--done h1 {
		margin: 0 0 12px;
		font-size: 1.7rem;
		font-weight: 600;
		color: #0d104d;
	}

	.signup-card--done p {
		margin: 0 0 28px;
		font-size: 15px;
		line-height: 1.7;
		color: #4a4f6a;
	}

	.signup-card--done .signup-card__submit {
		display: inline-flex;
		width: auto;
		padding: 14px 36px;
	}

	@keyframes signup-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 991px) {
		.signup {
			grid-template-columns: 1fr;
		}
		.signup__brand {
			padding: 56px 28px;
		}
	}

	@media (max-width: 575px) {
		.signup__brand {
			display: none;
		}
		.signup__panel {
			padding: 36px 16px;
		}
		.signup-card {
			padding: 30px 22px;
		}
		.signup-grid {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.signup [data-reveal],
		.signup-field input,
		.signup-card__submit,
		.signup-card__spinner {
			transition: none;
			animation: none;
		}
	}
</style>
