<template>
	<div class="header dash-header">
		<button
			type="button"
			class="dash-header__menu"
			aria-label="Menu"
			@click="$emit('openMenu')">
			<span></span>
			<span></span>
			<span></span>
		</button>

		<PriceTicker class="dash-header__ticker" />

		<div v-if="me && me.name" class="dash-header__user">
			<span class="dash-header__avatar" aria-hidden="true">{{ initial }}</span>
			<span class="dash-header__name">{{ me.name }} {{ me.lastname }}</span>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import PriceTicker from './PriceTicker.vue';
	import { useAuthStore } from '@/stores/auth';

	defineEmits(['openMenu']);

	const { me } = storeToRefs(useAuthStore());
	const initial = computed(() => me.value.name.charAt(0).toUpperCase());
</script>

<style scoped>
	/* Barre fixe d'origine, mise en page revue : menu, bandeau, utilisateur */
	.dash-header {
		display: flex;
		align-items: center;
		gap: 20px;
		height: 56px;
		padding: 0 24px;
		background: #ffffff;
		border-bottom: 1px solid #eef0f6;
		box-shadow: 0 6px 20px rgba(13, 16, 77, 0.04);
	}

	.dash-header__ticker {
		flex: 1;
		min-width: 0;
		height: 44px;
	}

	.dash-header__menu {
		display: none;
		position: relative;
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 0;
		border-radius: 10px;
		background: #f1f2f7;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.dash-header__menu:hover,
	.dash-header__menu:focus-visible {
		background: #0d104d;
		outline: none;
	}

	.dash-header__menu span {
		position: absolute;
		left: 12px;
		right: 12px;
		height: 2px;
		border-radius: 2px;
		background: #0d104d;
		transition: background-color 0.2s ease;
	}

	.dash-header__menu:hover span,
	.dash-header__menu:focus-visible span {
		background: #ffaf02;
	}

	.dash-header__menu span:nth-child(1) {
		top: 11px;
	}
	.dash-header__menu span:nth-child(2) {
		top: 16px;
	}
	.dash-header__menu span:nth-child(3) {
		top: 21px;
	}

	.dash-header__user {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.dash-header__avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: linear-gradient(135deg, #0d104d, #28408b);
		color: #ffaf02;
		font-size: 14px;
		font-weight: 600;
	}

	.dash-header__name {
		font-size: 14px;
		font-weight: 600;
		color: #0d104d;
		white-space: nowrap;
	}

	/* Sur petit écran : le menu s'ouvre et le nom disparaît pour laisser la place au bandeau */
	@media (max-width: 1024px) {
		.dash-header__menu {
			display: block;
		}
	}

	@media (max-width: 767px) {
		.dash-header {
			gap: 12px;
			padding: 0 14px;
		}
		.dash-header__name {
			display: none;
		}
	}
</style>
