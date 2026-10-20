<template>
	<div ref="root" class="packs">
		<header class="packs__head" data-reveal>
			<h1>{{ $t('pack.title') }}</h1>
			<p>{{ $t('pack.lead') }}</p>
		</header>

		<!-- Pack actuel et quotas restants -->
		<section class="current" data-reveal>
			<div class="current__info">
				<h2>{{ $t('pack.current_title') }}</h2>
				<p v-if="auth.me.pack" class="current__name">{{ auth.me.pack.pack_name }}</p>
				<p v-else class="current__name current__name--none">{{ $t('pack.no_pack') }}</p>
			</div>
			<dl class="quotas">
				<div>
					<dt>{{ $t('pack.remain_nft') }}</dt>
					<dd>{{ format(auth.me.current_allow_nft) }}</dd>
				</div>
				<div>
					<dt>{{ $t('pack.remain_auction') }}</dt>
					<dd>{{ format(auth.me.current_allow_auction) }}</dd>
				</div>
				<div>
					<dt>{{ $t('pack.remain_bid') }}</dt>
					<dd>{{ format(auth.me.current_allow_bid) }}</dd>
				</div>
			</dl>
		</section>

		<!-- Chargement -->
		<div v-if="loading" class="packs__grid" aria-hidden="true">
			<div v-for="n in 3" :key="n" class="skel"></div>
		</div>

		<p v-else-if="loadError" class="packs__state" role="alert">{{ $t('pack.error') }}</p>
		<p v-else-if="!packs.length" class="packs__state">{{ $t('pack.empty') }}</p>

		<!-- Cartes des packs -->
		<div v-else class="packs__grid">
			<article
				v-for="pack in packs"
				:key="pack.id"
				class="pack"
				:class="`pack--${statusOf(pack)}`"
				data-reveal>
				<header class="pack__head">
					<h2>{{ pack.pack_name }}</h2>
					<span v-if="statusOf(pack) === 'current'" class="pack__badge">{{ $t('pack.current') }}</span>
				</header>

				<p class="pack__price">
					<span class="pack__amount">{{ format(pack.pack_price) }}</span>
					<span class="pack__currency">{{ $t('pack.currency') }}</span>
					<span class="pack__licence">{{ $t('pack.licence') }}</span>
				</p>

				<ul class="pack__features">
					<li>
						<span>{{ $t('pack.nft_creation') }}</span>
						<strong>{{ format(pack.pack_max_nft_creation) }}</strong>
					</li>
					<li>
						<span>{{ $t('pack.auction_creation') }}</span>
						<strong>{{ format(pack.pack_max_auction_creation) }}</strong>
					</li>
					<li>
						<span>{{ $t('pack.max_bid') }}</span>
						<strong>{{ format(pack.pack_max_bid) }}</strong>
					</li>
				</ul>

				<div class="pack__action">
					<button
						v-if="statusOf(pack) === 'upgrade'"
						type="button"
						class="cta-btn"
						@click="openUpgrade(pack)">
						{{ $t('pack.upgrade') }}
					</button>
					<p v-else-if="statusOf(pack) === 'lower'" class="pack__note">{{ $t('pack.lower') }}</p>
				</div>
			</article>
		</div>

		<!-- Paiement de l'upgrade -->
		<Teleport to="body">
			<div v-if="selected" class="modal" role="dialog" aria-modal="true" :aria-labelledby="'upgrade-title'" @click.self="closeUpgrade">
				<div class="modal__panel">
					<header class="modal__head">
						<div>
							<h2 id="upgrade-title">{{ $t('pack.upgrade_title', { name: selected.pack_name }) }}</h2>
							<p>{{ $t('pack.upgrade_lead') }}</p>
						</div>
						<button type="button" class="modal__close" :aria-label="$t('pack.close')" @click="closeUpgrade">&times;</button>
					</header>
					<PackUpgradePaiement :packId="selected.id" @upgraded="closeUpgrade" />
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup>
	import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
	import axiosInstance from '@/src/axios';
	import { useAuthStore } from '@/stores/auth';
	import { useLoadingStore } from '@/stores/loading';
	import { useReveal } from '@/composables/useReveal';
	import PackUpgradePaiement from '@/components/UI/pack/PackUpgradePaiement.vue';

	const auth = useAuthStore();
	const root = ref(null);
	useReveal(root);

	const packs = ref([]);
	const loading = ref(true);
	const loadError = ref(false);
	const selected = ref(null);

	const format = (value) => new Intl.NumberFormat().format(value ?? 0);

	// Chaque pack est classé par rapport au pack actuel de l'utilisateur : actuel, supérieur (upgrade) ou inférieur
	const statusOf = (pack) => {
		if (auth.me.pack?.id === pack.id) return 'current';
		if (auth.me.pack && pack.pack_price <= auth.me.pack.pack_price) return 'lower';
		return 'upgrade';
	};

	const openUpgrade = (pack) => {
		selected.value = pack;
	};
	const closeUpgrade = () => {
		selected.value = null;
	};
	const onKeydown = (event) => {
		if (event.key === 'Escape') closeUpgrade();
	};

	// Verrouille le défilement de la page tant que la modale est ouverte
	watch(selected, (value) => {
		document.body.style.overflow = value ? 'hidden' : '';
	});

	onMounted(async () => {
		document.addEventListener('keydown', onKeydown);
		useLoadingStore().setLoading(false);
		try {
			const { data } = await axiosInstance.get('/pack');
			packs.value = data;
		} catch (error) {
			loadError.value = true;
		} finally {
			loading.value = false;
		}
	});

	onBeforeUnmount(() => {
		document.removeEventListener('keydown', onKeydown);
		document.body.style.overflow = '';
	});
</script>

<style scoped>
	.packs {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 8px 0 40px;
		color: #0d104d;
	}

	.packs [data-reveal] {
		opacity: 0;
		transform: translateY(18px);
		transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.packs [data-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.packs__head h1 {
		margin: 0 0 6px;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.packs__head p {
		margin: 0;
		color: #7a7f96;
	}

	/* Pack actuel */
	.current {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 24px 28px;
		border-radius: 20px;
		background:
			radial-gradient(circle at 95% 0%, rgba(255, 175, 2, 0.16), transparent 45%),
			linear-gradient(135deg, #0d104d, #28408b);
		color: #ffffff;
		box-shadow: 0 20px 44px rgba(13, 16, 77, 0.22);
	}

	.current h2 {
		margin: 0 0 6px;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.7);
	}

	.current__name {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #ffaf02;
	}

	.current__name--none {
		max-width: 46ch;
		font-size: 15px;
		font-weight: 500;
		color: #ffffff;
	}

	.quotas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 0;
	}

	.quotas > div {
		min-width: 120px;
		padding: 10px 14px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.08);
	}

	.quotas dt {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
	}

	.quotas dd {
		margin: 2px 0 0;
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	/* Cartes */
	.packs__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 22px;
	}

	.skel {
		height: 320px;
		border-radius: 20px;
		background: linear-gradient(90deg, #eef0f6 25%, #f7f8fb 50%, #eef0f6 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	@keyframes shimmer {
		from { background-position: 200% 0; }
		to { background-position: -200% 0; }
	}

	.packs__state {
		margin: 0;
		padding: 24px;
		border-radius: 16px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		color: #7a7f96;
		text-align: center;
	}

	.pack {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 26px 26px 24px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 16px 40px rgba(13, 16, 77, 0.07);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.pack:hover {
		transform: translateY(-3px);
		box-shadow: 0 22px 48px rgba(13, 16, 77, 0.12);
	}

	.pack--current {
		border: 2px solid #ffaf02;
	}

	.pack--lower {
		opacity: 0.6;
	}

	.pack__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.pack__head h2 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
	}

	.pack__badge {
		padding: 4px 12px;
		border-radius: 999px;
		background: #ffaf02;
		color: #0d104d;
		font-size: 12px;
		font-weight: 700;
	}

	.pack__price {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 6px;
		margin: 0;
	}

	.pack__amount {
		color: #0d104d;
		font-size: 2.4rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.pack__currency {
		color: #0d104d;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.pack__licence {
		width: 100%;
		font-size: 13px;
		color: #7a7f96;
	}

	.pack__features {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pack__features li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-top: 1px solid #eef0f6;
		font-size: 14px;
	}

	.pack__features strong {
		font-variant-numeric: tabular-nums;
	}

	.pack__action {
		margin-top: auto;
	}

	.pack__action .cta-btn {
		width: 100%;
		justify-content: center;
	}

	.pack__note {
		margin: 0;
		font-size: 13px;
		color: #7a7f96;
		text-align: center;
	}

	/* Modale */
	.modal {
		position: fixed;
		inset: 0;
		z-index: 1050;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		background: rgba(13, 16, 77, 0.55);
	}

	.modal__panel {
		width: min(560px, 100%);
		max-height: calc(100vh - 32px);
		overflow-y: auto;
		padding: 26px 28px;
		border-radius: 20px;
		background: #ffffff;
		box-shadow: 0 30px 70px rgba(13, 16, 77, 0.3);
	}

	.modal__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}

	.modal__head h2 {
		margin: 0 0 4px;
		font-size: 1.2rem;
		font-weight: 700;
	}

	.modal__head p {
		margin: 0;
		font-size: 14px;
		color: #7a7f96;
	}

	.modal__close {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 50%;
		background: #f6f7fb;
		color: #0d104d;
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
	}

	.modal__close:focus-visible {
		outline: 3px solid #ffaf02;
		outline-offset: 2px;
	}

	@media (max-width: 960px) {
		.packs__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 620px) {
		.packs {
			padding: 8px 16px 40px;
		}

		.packs__grid {
			grid-template-columns: 1fr;
		}

		.current {
			padding: 20px;
		}
	}
</style>
