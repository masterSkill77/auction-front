<template>
	<div class="login" ref="root">
		<!-- Panneau de marque -->
		<aside class="login__brand" aria-hidden="true">
			<div class="login__brand-inner" data-reveal>
				<BrandLogo inverse />
				<h2>{{ $t('login_page.brand_title') }}</h2>
				<p>{{ $t('login_page.brand_text') }}</p>
			</div>
			<span class="login__orb login__orb--one"></span>
			<span class="login__orb login__orb--two"></span>
		</aside>

		<!-- Formulaire -->
		<main class="login__panel">
			<form class="login-form" data-reveal @submit.prevent="submit">
				<header class="login-form__head">
					<h1>{{ $t('login_page.title') }}</h1>
					<p>{{ $t('login_page.subtitle') }}</p>
				</header>

				<label class="login-field">
					<span>{{ $t('login_page.email') }}</span>
					<input
						v-model="email"
						type="email"
						name="email"
						autocomplete="email"
						:placeholder="$t('login_page.email_placeholder')"
						required />
				</label>

				<label class="login-field">
					<span>{{ $t('login_page.password') }}</span>
					<span class="login-field__password">
						<input
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							name="password"
							autocomplete="current-password"
							required />
						<button
							type="button"
							class="login-field__toggle"
							:aria-pressed="showPassword"
							@click="showPassword = !showPassword">
							{{ showPassword ? $t('login_page.hide') : $t('login_page.show') }}
						</button>
					</span>
				</label>

				<button type="submit" class="login-form__submit" :disabled="submitting">
					<span v-if="submitting" class="login-form__spinner" aria-hidden="true"></span>
					<span>{{ submitting ? $t('login_page.submitting') : $t('login_page.submit') }}</span>
				</button>

				<p class="login-form__switch">
					{{ $t('login_page.no_account') }}
					<router-link to="/register">{{ $t('login_page.create') }}</router-link>
				</p>
			</form>
		</main>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { notify } from '@kyvg/vue3-notification';
	import BrandLogo from '@/components/theme/BrandLogo.vue';
	import { useAuthStore } from '@/stores/auth';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';

	const router = useRouter();
	const { t } = useI18n();
	const auth = useAuthStore();

	const root = ref(null);
	const email = ref('');
	const password = ref('');
	const showPassword = ref(false);
	const submitting = ref(false);

	useReveal(root);

	onMounted(() => {
		useLoadingStore().setLoading(true);
		setTimeout(() => useLoadingStore().setLoading(false), 1500);
		if (auth.isAuthenticated) router.push('/');
	});

	const submit = async () => {
		if (submitting.value) return;
		submitting.value = true;
		try {
			await auth.login(email.value, password.value);
			router.push({ name: 'home' });
		} catch (error) {
			const code = error.response?.data?.error;
			notify({
				title: code ? t(`error.${code}`) : t('error.title'),
				text: code ? t(`error.text-${code}`) : t('error.login'),
				type: 'error',
			});
		} finally {
			submitting.value = false;
		}
	};
</script>

<style scoped>
	.login [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.login [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.login {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: calc(100vh - 100px);
		background: #f6f7fb;
	}

	/* Panneau de marque */
	.login__brand {
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

	.login__brand-inner {
		position: relative;
		z-index: 1;
		max-width: 480px;
	}

	.login__brand-inner h2 {
		margin: 40px 0 18px;
		font-size: clamp(2rem, 3.4vw, 2.8rem);
		font-weight: 600;
		line-height: 1.2;
		color: #ffffff;
	}

	.login__brand-inner p {
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.82);
		margin: 0;
	}

	.login__orb {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
	}

	.login__orb--one {
		top: -120px;
		right: -120px;
		width: 380px;
		height: 380px;
		border: 1px solid rgba(255, 175, 2, 0.25);
	}

	.login__orb--two {
		bottom: -160px;
		left: -100px;
		width: 340px;
		height: 340px;
		background: radial-gradient(circle, rgba(255, 175, 2, 0.12), transparent 65%);
	}

	/* Formulaire */
	.login__panel {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 24px;
	}

	.login-form {
		width: 100%;
		max-width: 420px;
		padding: 40px 38px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 22px;
		box-shadow: 0 24px 60px rgba(13, 16, 77, 0.1);
	}

	.login-form__head {
		margin-bottom: 30px;
	}

	.login-form__head h1 {
		margin: 0 0 8px;
		font-size: 1.9rem;
		font-weight: 600;
		color: #0d104d;
	}

	.login-form__head p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: #7a7f96;
	}

	.login-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}

	.login-field > span:first-child {
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
	}

	.login-field input {
		width: 100%;
		padding: 13px 16px;
		border: 1px solid #dfe2ee;
		border-radius: 12px;
		background: #fafbfd;
		font-size: 15px;
		color: #0d104d;
		outline: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
	}

	.login-field input:focus {
		border-color: #ffaf02;
		background: #ffffff;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.login-field__password {
		position: relative;
		display: block;
	}

	.login-field__password input {
		padding-right: 84px;
	}

	.login-field__toggle {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		padding: 6px 10px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		font-size: 13px;
		font-weight: 600;
		color: #28408b;
		cursor: pointer;
	}

	.login-field__toggle:hover,
	.login-field__toggle:focus-visible {
		color: #0d104d;
		background: #fff8e6;
		outline: none;
	}

	.login-form__submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 8px;
		padding: 14px 24px;
		border: 0;
		border-radius: 999px;
		background: linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 12px 26px rgba(13, 16, 77, 0.25);
		transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
	}

	.login-form__submit:hover:not(:disabled),
	.login-form__submit:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		box-shadow: 0 14px 30px rgba(255, 175, 2, 0.4);
		transform: translateY(-2px);
		outline: none;
	}

	.login-form__submit:disabled {
		opacity: 0.75;
		cursor: wait;
	}

	.login-form__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: login-spin 0.8s linear infinite;
	}

	.login-form__switch {
		margin: 26px 0 0;
		text-align: center;
		font-size: 14px;
		color: #7a7f96;
	}

	.login-form__switch a {
		font-weight: 600;
		color: #0d104d;
		text-decoration: none;
	}

	.login-form__switch a:hover {
		color: #ffaf02;
	}

	@keyframes login-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 991px) {
		.login {
			grid-template-columns: 1fr;
		}
		.login__brand {
			padding: 56px 28px;
		}
		.login__brand-inner h2 {
			margin-top: 24px;
		}
	}

	@media (max-width: 575px) {
		.login__brand {
			display: none;
		}
		.login__panel {
			padding: 36px 16px;
		}
		.login-form {
			padding: 30px 22px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.login [data-reveal],
		.login-field input,
		.login-form__submit,
		.login-form__spinner {
			transition: none;
			animation: none;
		}
	}
</style>
