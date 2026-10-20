<template>
	<div class="admin-packs">
		<header class="admin-packs__head">
			<div>
				<h1>{{ $t('admin_packs.title') }}</h1>
				<p>{{ $t('admin_packs.lead') }}</p>
			</div>
			<button type="button" class="btn-pill" @click="startCreate">{{ $t('admin_packs.new') }}</button>
		</header>

		<p v-if="forbidden" class="admin-packs__state" role="alert">{{ $t('admin_packs.forbidden') }}</p>
		<p v-else-if="loadError" class="admin-packs__state" role="alert">{{ $t('admin_packs.error') }}</p>

		<div v-else class="admin-packs__layout">
			<!-- Liste des packs -->
			<section class="panel">
				<p v-if="loading" class="admin-packs__state">{{ $t('admin_packs.loading') }}</p>
				<table v-else class="packs-table">
					<thead>
						<tr>
							<th scope="col">{{ $t('admin_packs.name') }}</th>
							<th scope="col">{{ $t('admin_packs.price') }}</th>
							<th scope="col">{{ $t('admin_packs.nft') }}</th>
							<th scope="col">{{ $t('admin_packs.auction') }}</th>
							<th scope="col">{{ $t('admin_packs.bid') }}</th>
							<th scope="col">{{ $t('admin_packs.status') }}</th>
							<th scope="col"><span class="sr-only">{{ $t('admin_packs.edit') }}</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="pack in packs" :key="pack.id" :class="{ 'is-selected': editing?.id === pack.id }">
							<td>{{ pack.pack_name }}</td>
							<td>{{ pack.pack_price }} CAD</td>
							<td>{{ pack.pack_max_nft_creation }}</td>
							<td>{{ pack.pack_max_auction_creation }}</td>
							<td>{{ pack.pack_max_bid }}</td>
							<td>
								<span class="badge" :class="pack.is_active ? 'badge--on' : 'badge--off'">
									{{ pack.is_active ? $t('admin_packs.active') : $t('admin_packs.inactive') }}
								</span>
							</td>
							<td>
								<button type="button" class="link-btn" @click="startEdit(pack)">{{ $t('admin_packs.edit') }}</button>
							</td>
						</tr>
						<tr v-if="!packs.length">
							<td colspan="7" class="empty">{{ $t('admin_packs.empty') }}</td>
						</tr>
					</tbody>
				</table>
			</section>

			<!-- Formulaire création / édition -->
			<section v-if="form" class="panel">
				<h2>{{ editing ? $t('admin_packs.form_edit') : $t('admin_packs.form_new') }}</h2>
				<form class="form" novalidate @submit.prevent="save">
					<label class="field">
						<span>{{ $t('admin_packs.name') }}</span>
						<input v-model="form.pack_name" type="text" maxlength="50" :aria-invalid="!!errors.pack_name" />
						<small v-if="errors.pack_name" class="field__error">{{ errors.pack_name }}</small>
					</label>
					<label class="field">
						<span>{{ $t('admin_packs.price') }} (CAD)</span>
						<input v-model.number="form.pack_price" type="number" min="1" step="1" :aria-invalid="!!errors.pack_price" />
						<small v-if="errors.pack_price" class="field__error">{{ errors.pack_price }}</small>
					</label>
					<label class="field">
						<span>{{ $t('admin_packs.nft') }}</span>
						<input v-model.number="form.pack_max_nft_creation" type="number" min="0" step="1" />
						<small v-if="errors.pack_max_nft_creation" class="field__error">{{ errors.pack_max_nft_creation }}</small>
					</label>
					<label class="field">
						<span>{{ $t('admin_packs.auction') }}</span>
						<input v-model.number="form.pack_max_auction_creation" type="number" min="0" step="1" />
						<small v-if="errors.pack_max_auction_creation" class="field__error">{{ errors.pack_max_auction_creation }}</small>
					</label>
					<label class="field">
						<span>{{ $t('admin_packs.bid') }}</span>
						<input v-model.number="form.pack_max_bid" type="number" min="0" step="1" />
						<small v-if="errors.pack_max_bid" class="field__error">{{ errors.pack_max_bid }}</small>
					</label>
					<label class="check">
						<input v-model="form.is_active" type="checkbox" />
						<span>{{ $t('admin_packs.is_active') }}</span>
					</label>
					<p class="hint">{{ $t('admin_packs.hint') }}</p>

					<p v-if="saveStatus" class="status" :class="`status--${saveStatus.type}`" role="status">{{ saveStatus.text }}</p>
					<div class="form__actions">
						<button type="submit" class="btn-pill" :disabled="saving">
							{{ saving ? $t('admin_packs.saving') : $t('admin_packs.save') }}
						</button>
						<button type="button" class="btn-ghost" @click="cancel">{{ $t('admin_packs.cancel') }}</button>
					</div>
				</form>
			</section>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useI18n } from 'vue-i18n';
	import axiosInstance from '@/src/axios';
	import { useLoadingStore } from '@/stores/loading';

	// Le store démarre avec le loader actif : cette page le retire elle-même
	useLoadingStore().setLoading(false);

	const { t } = useI18n();
	const packs = ref([]);
	const loading = ref(true);
	const loadError = ref(false);
	const forbidden = ref(false);
	const editing = ref(null);
	const form = ref(null);
	const errors = ref({});
	const saving = ref(false);
	const saveStatus = ref(null);

	const EMPTY = { pack_name: '', pack_price: 10, pack_max_nft_creation: 5, pack_max_auction_creation: 5, pack_max_bid: 20, is_active: true };

	const load = async () => {
		loading.value = true;
		try {
			const { data } = await axiosInstance.get('/admin/packs');
			packs.value = data;
		} catch (error) {
			if (error.response?.status === 403) forbidden.value = true;
			else loadError.value = true;
		} finally {
			loading.value = false;
		}
	};

	const startCreate = () => {
		editing.value = null;
		form.value = { ...EMPTY };
		errors.value = {};
		saveStatus.value = null;
	};
	const startEdit = (pack) => {
		editing.value = pack;
		form.value = {
			pack_name: pack.pack_name,
			pack_price: Number(pack.pack_price),
			pack_max_nft_creation: pack.pack_max_nft_creation,
			pack_max_auction_creation: pack.pack_max_auction_creation,
			pack_max_bid: pack.pack_max_bid,
			is_active: !!pack.is_active,
		};
		errors.value = {};
		saveStatus.value = null;
	};
	const cancel = () => {
		editing.value = null;
		form.value = null;
	};

	const save = async () => {
		saving.value = true;
		errors.value = {};
		saveStatus.value = null;
		try {
			if (editing.value) {
				await axiosInstance.put(`/admin/packs/${editing.value.id}`, form.value);
			} else {
				await axiosInstance.post('/admin/packs', form.value);
			}
			saveStatus.value = { type: 'success', text: t('admin_packs.saved') };
			await load();
			cancel();
		} catch (error) {
			if (error.response?.status === 422) {
				const fields = {};
				for (const [field, messages] of Object.entries(error.response.data.errors ?? {})) {
					fields[field] = messages[0];
				}
				errors.value = fields;
			} else {
				saveStatus.value = { type: 'error', text: t('admin_packs.failed') };
			}
		} finally {
			saving.value = false;
		}
	};

	onMounted(load);
</script>

<style scoped>
	.admin-packs {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 8px 0 40px;
		color: #0d104d;
	}

	.admin-packs__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.admin-packs__head h1 {
		margin: 0 0 6px;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.admin-packs__head p {
		margin: 0;
		color: #7a7f96;
	}

	.admin-packs__state {
		padding: 24px;
		border-radius: 16px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		color: #7a7f96;
		text-align: center;
	}

	/* Tableau pleine largeur ; le formulaire s'affiche dessous */
	.admin-packs__layout {
		display: flex;
		flex-direction: column;
		gap: 22px;
		width: 100%;
	}

	.panel {
		width: 100%;
		padding: 24px 26px;
		background: #ffffff;
		border: 1px solid #e6e8f2;
		border-radius: 20px;
		box-shadow: 0 16px 40px rgba(13, 16, 77, 0.07);
		overflow-x: auto;
	}

	.panel h2 {
		margin: 0 0 18px;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.packs-table {
		width: 100%;
		min-width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.packs-table th,
	.packs-table td {
		padding: 12px 10px;
		border-bottom: 1px solid #eef0f6;
		text-align: left;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.packs-table th {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #7a7f96;
	}

	.packs-table tr.is-selected td {
		background: #fff8e6;
	}

	.empty {
		text-align: center;
		color: #7a7f96;
	}

	.badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
	}

	.badge--on {
		background: #e3f6ea;
		color: #1e7b4a;
	}

	.badge--off {
		background: #f1f2f6;
		color: #7a7f96;
	}

	.link-btn {
		border: 0;
		background: transparent;
		color: #28408b;
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
	}

	.form {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 14px 18px;
	}

	.form .hint,
	.form .status,
	.form__actions,
	.form .check {
		grid-column: 1 / -1;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
	}

	.field input {
		padding: 10px 12px;
		border: 1px solid #d5d9e8;
		border-radius: 12px;
		background: #f6f7fb;
		color: #0d104d;
		font: inherit;
		font-weight: 400;
	}

	.field input:focus {
		border-color: #ffaf02;
		outline: none;
		box-shadow: 0 0 0 4px rgba(255, 175, 2, 0.18);
	}

	.field input[aria-invalid='true'] {
		border-color: #c0392b;
	}

	.field__error {
		font-size: 12px;
		font-weight: 400;
		color: #c0392b;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
	}

	.hint {
		margin: 0;
		font-size: 12px;
		color: #7a7f96;
		line-height: 1.5;
	}

	.status {
		margin: 0;
		font-size: 14px;
	}

	.status--success {
		color: #1e7b4a;
	}

	.status--error {
		color: #c0392b;
	}

	.form__actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.btn-pill {
		padding: 10px 22px;
		border: 0;
		border-radius: 999px;
		background: #0d104d;
		color: #ffffff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-pill:hover:not(:disabled),
	.btn-pill:focus-visible {
		background: #28408b;
		outline: none;
	}

	.btn-pill:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.btn-ghost {
		padding: 10px 18px;
		border: 1px solid #d5d9e8;
		border-radius: 999px;
		background: transparent;
		color: #0d104d;
		font: inherit;
		cursor: pointer;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

</style>
