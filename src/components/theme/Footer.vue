<template>
	<footer class="site-footer">
		<div class="container">
			<div class="site-footer__grid">
				<div class="site-footer__brand">
					<router-link to="/" class="site-footer__logo" aria-label="Adebaka, accueil">
						<BrandLogo inverse />
					</router-link>
					<p>{{ $t('footer.tagline') }}</p>
				</div>

				<nav class="site-footer__col" :aria-label="$t('footer.nav_title')">
					<h4>{{ $t('footer.nav_title') }}</h4>
					<ul>
						<li v-for="link in links" :key="link.to">
							<router-link :to="link.to">{{ $t(link.key) }}</router-link>
						</li>
					</ul>
				</nav>

				<div class="site-footer__col">
					<h4>{{ $t('footer.contact_title') }}</h4>
					<ul class="site-footer__contact">
						<li>
							<a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a>
						</li>
						<li>
							<a :href="`tel:${CONTACT.phoneLink}`">{{ CONTACT.phone }}</a>
						</li>
						<li>{{ CONTACT.address }}</li>
					</ul>
				</div>
			</div>

			<div class="site-footer__bottom">
				<p>© {{ year }} Adebaka · {{ $t('footer.rights') }}</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
	import BrandLogo from '@/components/theme/BrandLogo.vue';
	import { CONTACT } from '@/config/contact';

	const year = new Date().getFullYear();

	const links = [
		{ to: '/', key: 'menu.home' },
		{ to: '/auctions', key: 'menu.auctions' },
		{ to: '/about', key: 'menu.about' },
		{ to: '/contact', key: 'menu.contact' },
		{ to: '/login', key: 'menu.login' },
		{ to: '/register', key: 'menu.register' },
	];
</script>

<style scoped>
	.site-footer {
		position: relative;
		padding: 80px 0 0;
		background:
			radial-gradient(circle at 85% 0%, rgba(255, 175, 2, 0.1), transparent 40%),
			linear-gradient(180deg, #0d104d, #0a0c24);
		color: rgba(255, 255, 255, 0.75);
	}

	.site-footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #ffaf02, #ffd166, transparent);
	}

	.site-footer__grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1.2fr;
		gap: 48px;
		padding-bottom: 56px;
	}

	.site-footer__logo {
		display: inline-block;
		margin-bottom: 20px;
		text-decoration: none;
	}

	.site-footer__brand p {
		max-width: 340px;
		margin: 0;
		font-size: 15px;
		line-height: 1.75;
	}

	.site-footer h4 {
		margin: 0 0 22px;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #ffaf02;
	}

	.site-footer ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.site-footer li + li {
		margin-top: 12px;
	}

	.site-footer a {
		position: relative;
		display: inline-block;
		font-size: 15px;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.site-footer a:hover,
	.site-footer a:focus-visible {
		color: #ffaf02;
		outline: none;
	}

	.site-footer a:focus-visible {
		box-shadow: 0 0 0 3px rgba(255, 175, 2, 0.35);
		border-radius: 4px;
	}

	.site-footer__contact li {
		font-size: 15px;
		word-break: break-word;
	}

	.site-footer__bottom {
		padding: 22px 0 26px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
	}

	.site-footer__bottom p {
		margin: 0;
	}

	@media (max-width: 991px) {
		.site-footer__grid {
			grid-template-columns: 1fr 1fr;
			gap: 40px 32px;
		}
		.site-footer__brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 575px) {
		.site-footer {
			padding-top: 60px;
		}
		.site-footer__grid {
			grid-template-columns: 1fr;
			gap: 36px;
			padding-bottom: 40px;
		}
	}
</style>
