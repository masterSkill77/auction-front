<template>
	<div ref="root" class="packs-page">
		<header class="packs-page__head" data-reveal>
			<h1>{{ $t('packs_public.title') }}</h1>
			<p>{{ $t('packs_public.lead') }}</p>
		</header>

		<p v-if="loadError" class="packs-page__state" role="alert">{{ $t('packs_public.error') }}</p>
		<p v-else-if="!loading && !packs.length" class="packs-page__state">{{ $t('packs_public.empty') }}</p>

		<div v-else class="packs-page__grid">
			<div v-for="n in loading ? 3 : 0" :key="`skel-${n}`" class="packs-page__skel"></div>
			<div v-for="(pack, index) in packs" :key="pack.id" data-reveal>
				<PackCard :pack="pack" :featured="index === featuredIndex">
					<router-link v-if="auth.isAuthenticated" to="/app/packs" class="cta-btn">
						{{ $t('packs_public.manage') }}
					</router-link>
					<router-link v-else to="/register" class="cta-btn">
						{{ $t('packs_public.create_account') }}
					</router-link>
				</PackCard>
			</div>
		</div>

		<p class="packs-page__note" data-reveal>{{ $t('packs_public.note') }}</p>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import axiosInstance from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';
	import PackCard from '@/components/UI/pack/PackCard.vue';

	// Le store démarre avec le loader actif : cette page le retire elle-même
	useLoadingStore().setLoading(false);

	const auth = useAuthStore();
	const root = ref(null);
	useReveal(root);

	const packs = ref([]);
	const loading = ref(true);
	const loadError = ref(false);
	const featuredIndex = computed(() => (packs.value.length === 3 ? 1 : 0));

	onMounted(async () => {
		try {
			const { data } = await axiosInstance.get('/pack');
			packs.value = data;
		} catch (error) {
			loadError.value = true;
		} finally {
			loading.value = false;
		}
	});
</script>

<style scoped>
	.packs-page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 60px 24px 80px;
		color: #0d104d;
	}

	.packs-page__head {
		max-width: 640px;
		margin: 0 auto 44px;
		text-align: center;
	}

	.packs-page__head h1 {
		margin: 0 0 10px;
		font-size: 2.2rem;
		font-weight: 700;
	}

	.packs-page__head p {
		margin: 0;
		color: #7a7f96;
		line-height: 1.6;
	}

	.packs-page__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 26px;
		align-items: stretch;
		padding-top: 12px;
	}

	.packs-page__skel {
		height: 380px;
		border-radius: 20px;
		background: linear-gradient(90deg, #e9ecf4 25%, #f6f7fb 50%, #e9ecf4 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	@keyframes shimmer {
		from { background-position: 200% 0; }
		to { background-position: -200% 0; }
	}

	.packs-page__state {
		padding: 24px;
		border-radius: 16px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		color: #7a7f96;
		text-align: center;
	}

	.packs-page__note {
		margin: 40px auto 0;
		max-width: 640px;
		text-align: center;
		font-size: 14px;
		line-height: 1.6;
		color: #7a7f96;
	}

	@media (max-width: 900px) {
		.packs-page__grid {
			grid-template-columns: 1fr;
			max-width: 420px;
			margin: 0 auto;
		}
	}
</style>
