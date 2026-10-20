<template>
	<section v-if="loading || packs.length" class="packs-teaser" ref="root">
		<div class="container">
			<header class="packs-teaser__head" data-reveal>
				<h2>{{ $t('packs_public.teaser_title') }}</h2>
				<p>{{ $t('packs_public.teaser_lead') }}</p>
			</header>

			<div class="packs-teaser__grid">
				<div v-for="n in loading ? 3 : 0" :key="`skel-${n}`" class="packs-teaser__skel"></div>
				<div v-for="(pack, index) in packs" :key="pack.id" data-reveal>
					<PackCard :pack="pack" :featured="index === featuredIndex">
						<router-link to="/register" class="cta-btn">{{ $t('packs_public.create_account') }}</router-link>
					</PackCard>
				</div>
			</div>

			<div class="packs-teaser__more" data-reveal>
				<router-link to="/packs" class="packs-teaser__link">{{ $t('packs_public.see_all') }} &rarr;</router-link>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import axiosInstance from '@/src/axios';
	import PackCard from '@/components/UI/pack/PackCard.vue';
	import { useReveal } from '@/composables/useReveal';

	const root = ref(null);
	useReveal(root);

	const packs = ref([]);
	const loading = ref(true);
	// Pack mis en avant : celui du milieu quand il y en a trois, sinon le premier
	const featuredIndex = computed(() => (packs.value.length === 3 ? 1 : 0));

	onMounted(async () => {
		try {
			const { data } = await axiosInstance.get('/pack');
			packs.value = data.slice(0, 3);
		} catch (error) {
			// Section masquée si les packs ne sont pas disponibles
			packs.value = [];
		} finally {
			loading.value = false;
		}
	});
</script>

<style scoped>
	.packs-teaser {
		padding: 80px 0;
		background: #f4f6fb;
	}

	.packs-teaser__head {
		max-width: 640px;
		margin: 0 auto 40px;
		text-align: center;
	}

	.packs-teaser__head h2 {
		margin: 0 0 10px;
		font-size: 2rem;
		font-weight: 700;
		color: #0d104d;
	}

	.packs-teaser__head p {
		margin: 0;
		color: #7a7f96;
		line-height: 1.6;
	}

	.packs-teaser__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 26px;
		align-items: stretch;
		padding-top: 12px;
	}

	.packs-teaser__skel {
		height: 360px;
		border-radius: 20px;
		background: linear-gradient(90deg, #e9ecf4 25%, #f6f7fb 50%, #e9ecf4 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	@keyframes shimmer {
		from { background-position: 200% 0; }
		to { background-position: -200% 0; }
	}

	.packs-teaser__more {
		margin-top: 36px;
		text-align: center;
	}

	.packs-teaser__link {
		font-weight: 600;
		color: #0d104d;
		text-decoration: none;
		border-bottom: 2px solid #ffaf02;
		padding-bottom: 2px;
	}

	.packs-teaser__link:hover,
	.packs-teaser__link:focus-visible {
		color: #28408b;
		outline: none;
	}

	@media (max-width: 900px) {
		.packs-teaser__grid {
			grid-template-columns: 1fr;
			max-width: 420px;
			margin: 0 auto;
		}
	}
</style>
