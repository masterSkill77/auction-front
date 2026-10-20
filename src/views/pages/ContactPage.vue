<template>
	<div class="contact" ref="root">
		<section class="contact-hero">
			<div class="container">
				<div class="contact-hero__text" data-reveal>
					<h1>{{ $t('contact_page.title') }}</h1>
					<span class="contact-hero__rule" aria-hidden="true"></span>
					<p>{{ $t('contact_page.intro') }}</p>
				</div>
			</div>
		</section>

		<section class="contact-body">
			<div class="container">
				<div class="row">
					<!-- Coordonnées -->
					<div class="col-12 col-lg-5">
						<ul class="contact-cards">
							<li class="contact-card" data-reveal>
								<span class="contact-card__icon" aria-hidden="true">
									<svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z M3 7l9 6 9-6" /></svg>
								</span>
								<div>
									<h3>{{ $t('contact_page.email_label') }}</h3>
									<a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
								</div>
							</li>
							<li class="contact-card" data-reveal>
								<span class="contact-card__icon" aria-hidden="true">
									<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></svg>
								</span>
								<div>
									<h3>{{ $t('contact_page.phone_label') }}</h3>
									<a :href="`tel:${PHONE_LINK}`">{{ PHONE }}</a>
								</div>
							</li>
							<li class="contact-card" data-reveal>
								<span class="contact-card__icon" aria-hidden="true">
									<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
								</span>
								<div>
									<h3>{{ $t('contact_page.address_label') }}</h3>
									<p>{{ ADDRESS }}</p>
								</div>
							</li>
						</ul>
					</div>

					<!-- Formulaire -->
					<div class="col-12 col-lg-7">
						<form class="contact-form" data-reveal @submit.prevent="send">
							<div class="contact-form__row">
								<label class="contact-field">
									<span>{{ $t('contact_page.form_name') }}</span>
									<input v-model="form.name" type="text" autocomplete="name" required />
								</label>
								<label class="contact-field">
									<span>{{ $t('contact_page.form_email') }}</span>
									<input v-model="form.email" type="email" autocomplete="email" required />
								</label>
							</div>
							<label class="contact-field">
								<span>{{ $t('contact_page.form_message') }}</span>
								<textarea v-model="form.message" rows="7" required></textarea>
							</label>
							<div class="contact-form__footer">
								<button type="submit" class="contact-form__submit">
									<span>{{ $t('contact_page.form_send') }}</span>
									<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
								</button>
								<p class="contact-form__hint">{{ $t('contact_page.form_hint') }}</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, reactive, onMounted } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { useLoadingStore } from '@/stores/loading';
	import { CONTACT } from '@/config/contact';
	import { useReveal } from '@/composables/useReveal';

	const { email: EMAIL, phone: PHONE, phoneLink: PHONE_LINK, address: ADDRESS } = CONTACT;

	const { t } = useI18n();
	const root = ref(null);
	const form = reactive({ name: '', email: '', message: '' });

	useReveal(root);

	// Pas de serveur d'envoi : le formulaire prépare un e-mail dans le client de messagerie
	const send = () => {
		const body = `${form.name} <${form.email}>\n\n${form.message}`;
		const query = `subject=${encodeURIComponent(t('contact_page.subject'))}&body=${encodeURIComponent(body)}`;
		window.location.href = `mailto:${EMAIL}?${query}`;
	};

	onMounted(() => {
		useLoadingStore().setLoading(true);
		setTimeout(() => useLoadingStore().setLoading(false), 1500);
	});
</script>

<style scoped>
	.contact [data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.contact [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.contact-hero {
		padding: 120px 0 90px;
		background:
			radial-gradient(circle at 80% 20%, rgba(255, 175, 2, 0.14), transparent 50%),
			linear-gradient(135deg, #0d104d, #28408b);
		text-align: center;
	}

	.contact-hero h1 {
		font-size: clamp(2.2rem, 4.5vw, 3.4rem);
		font-weight: 600;
		color: #ffffff;
		margin: 0;
	}

	.contact-hero__rule {
		display: block;
		width: 56px;
		height: 3px;
		margin: 20px auto 24px;
		border-radius: 999px;
		background: #ffaf02;
	}

	.contact-hero p {
		max-width: 620px;
		margin: 0 auto;
		font-size: 1.1rem;
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.85);
	}

	.contact-body {
		padding: 80px 0 110px;
		background: #f6f7fb;
	}

	/* Coordonnées */
	.contact-cards {
		display: grid;
		gap: 18px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.contact-card {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 24px 26px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 18px;
		box-shadow: 0 10px 28px rgba(13, 16, 77, 0.06);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
			border-color 0.3s ease;
	}

	.contact-card:hover {
		border-color: rgba(255, 175, 2, 0.6);
	}

	.contact-card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: #0d104d;
	}

	.contact-card__icon svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: #ffaf02;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.contact-card h3 {
		margin: 0 0 4px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #7a7f96;
	}

	.contact-card a,
	.contact-card p {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 500;
		color: #0d104d;
		word-break: break-word;
	}

	.contact-card a {
		text-decoration: none;
	}

	.contact-card a:hover {
		color: #ffaf02;
	}

	/* Formulaire */
	.contact-form {
		padding: 40px 42px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 20px 50px rgba(13, 16, 77, 0.08);
	}

	.contact-form__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.contact-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}

	.contact-field span {
		font-size: 13px;
		font-weight: 600;
		color: #4a4f6a;
	}

	.contact-field input,
	.contact-field textarea {
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

	.contact-field textarea {
		resize: vertical;
		min-height: 160px;
	}

	.contact-field input:focus,
	.contact-field textarea:focus {
		border-color: #ffaf02;
		background: #ffffff;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.contact-form__footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: 8px;
	}

	.contact-form__submit {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 14px 30px;
		border: 0;
		border-radius: 999px;
		background: linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.02em;
		cursor: pointer;
		box-shadow: 0 12px 26px rgba(13, 16, 77, 0.25);
		transition:
			background 0.3s ease,
			color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.2s ease;
	}

	.contact-form__submit svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: transform 0.3s ease;
	}

	.contact-form__submit:hover,
	.contact-form__submit:focus-visible {
		background: #ffaf02;
		color: #0d104d;
		box-shadow: 0 14px 30px rgba(255, 175, 2, 0.4);
		transform: translateY(-2px);
		outline: none;
	}

	.contact-form__submit:hover svg,
	.contact-form__submit:focus-visible svg {
		transform: translateX(4px);
	}

	.contact-form__submit:active {
		transform: translateY(0);
	}

	.contact-form__hint {
		margin: 0;
		font-size: 13px;
		color: #7a7f96;
	}

	@media (max-width: 991px) {
		.contact-body {
			padding: 60px 0 80px;
		}
		.contact-cards {
			margin-bottom: 32px;
		}
	}

	@media (max-width: 575px) {
		.contact-form {
			padding: 28px 22px;
		}
		.contact-form__row {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.contact [data-reveal],
		.contact-card,
		.contact-field input,
		.contact-field textarea,
		.contact-form__submit,
		.contact-form__submit svg {
			transition: none;
		}
	}
</style>
