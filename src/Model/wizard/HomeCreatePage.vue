<template>
	<div class="choice">
		<router-link
			v-for="choice in choices"
			:key="choice.to"
			:to="choice.to"
			class="choice__card">
			<span class="choice__icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" v-html="choice.icon"></svg>
			</span>
			<h2>{{ $t(choice.title) }}</h2>
			<p>{{ $t(choice.desc) }}</p>
			<span class="choice__hint">{{ $t(choice.hint) }}</span>
			<span class="choice__go">{{ $t('create_page.start') }} →</span>
		</router-link>
	</div>
</template>

<script setup>
	const choices = [
		{
			to: '/app/create/nft',
			title: 'creation.nft.title',
			desc: 'creation.nft.description',
			hint: 'create_page.nft_hint',
			icon: '<rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" />',
		},
		{
			to: '/app/create/auction',
			title: 'creation.auction.title',
			desc: 'creation.auction.description',
			hint: 'create_page.auction_hint',
			icon: '<path d="M14 4l6 6-8 8-6-6z M4 20l4-4" />',
		},
	];
</script>

<style scoped>
	.choice {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 22px;
	}

	.choice__card {
		display: flex;
		flex-direction: column;
		min-height: 280px;
		padding: 34px 32px 28px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 22px;
		box-shadow: 0 12px 30px rgba(13, 16, 77, 0.06);
		color: #0d104d;
		text-decoration: none;
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.choice__card:hover,
	.choice__card:focus-visible {
		transform: translateY(-4px);
		border-color: rgba(255, 175, 2, 0.6);
		box-shadow: 0 22px 44px rgba(13, 16, 77, 0.14);
		outline: none;
	}

	.choice__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		margin-bottom: 22px;
		border-radius: 16px;
		background: linear-gradient(135deg, #0d104d, #28408b);
	}

	.choice__icon svg {
		width: 26px;
		height: 26px;
		fill: none;
		stroke: #ffaf02;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.choice__card h2 {
		margin: 0 0 10px;
		font-size: 1.4rem;
		font-weight: 600;
		color: #0d104d;
	}

	.choice__card p {
		margin: 0 0 18px;
		font-size: 15px;
		line-height: 1.7;
		color: #4a4f6a;
	}

	.choice__hint {
		align-self: flex-start;
		padding: 4px 12px;
		border-radius: 999px;
		background: #f1f2f7;
		font-size: 12px;
		font-weight: 600;
		color: #28408b;
	}

	.choice__go {
		margin-top: auto;
		padding-top: 22px;
		font-size: 14px;
		font-weight: 600;
		color: #0d104d;
	}

	.choice__card:hover .choice__go {
		color: #ffaf02;
	}

	@media (max-width: 767px) {
		.choice {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.choice__card {
			transition: none;
		}
	}
</style>
