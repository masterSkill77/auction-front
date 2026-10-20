<template>
	<div class="create">
		<header class="create__head">
			<router-link v-if="!isHome" to="/app/create" class="create__back">
				← {{ $t('create_page.back') }}
			</router-link>
			<template v-if="isHome">
				<h1>{{ $t('create_page.title') }}</h1>
				<p>{{ $t('create_page.subtitle') }}</p>
			</template>
		</header>

		<router-view />
	</div>
</template>

<script setup>
	import { computed, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useLoadingStore } from '@/stores/loading';

	const route = useRoute();
	const isHome = computed(() => route.path === '/app/create');

	onMounted(() => {
		useLoadingStore().setLoading(true);
		setTimeout(() => useLoadingStore().setLoading(false), 1500);
	});
</script>

<style scoped>
	.create {
		max-width: 1000px;
		margin: 0 auto;
		padding: 8px 0 60px;
		color: #0d104d;
	}

	.create__head {
		margin-bottom: 26px;
	}

	.create__head h1 {
		margin: 0 0 8px;
		font-size: 2rem;
		font-weight: 600;
		color: #0d104d;
	}

	.create__head p {
		margin: 0;
		font-size: 15px;
		color: #7a7f96;
	}

	.create__back {
		display: inline-block;
		margin-bottom: 14px;
		font-size: 14px;
		font-weight: 600;
		color: #28408b;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.create__back:hover,
	.create__back:focus-visible {
		color: #ffaf02;
		outline: none;
	}
</style>
