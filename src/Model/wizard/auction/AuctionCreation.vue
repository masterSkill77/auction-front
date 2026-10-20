<template>
	<div v-if="!loading && !nfts.length" class="wz-empty">
		<span class="wz-empty__icon" aria-hidden="true">
			<svg viewBox="0 0 24 24"><path d="M14 4l6 6-8 8-6-6z M4 20l4-4" /></svg>
		</span>
		<h2>{{ $t('create_page.no_nft_title') }}</h2>
		<p>{{ $t('create_page.no_nft_text') }}</p>
		<router-link to="/app/create/nft" class="wz-submit">
			{{ $t('create_page.create_nft_cta') }}
		</router-link>
	</div>

	<form v-else class="wz-card" novalidate @submit.prevent="submit">
		<div class="wz-card__main">
			<h2>{{ $t('create_page.auction_title') }}</h2>
			<p class="wz-card__lead">{{ $t('create_page.auction_subtitle') }}</p>

			<fieldset class="wz-field" :class="{ 'is-invalid': errors.nft_id }">
				<span>{{ $t('create_page.choose_nft') }}</span>
				<div class="wz-picker" role="listbox" :aria-label="$t('create_page.choose_nft')">
					<button
						v-for="nft in nfts"
						:key="nft.id"
						type="button"
						role="option"
						class="wz-picker__item"
						:class="{ 'is-selected': form.nft_id === nft.id }"
						:aria-selected="form.nft_id === nft.id"
						@click="form.nft_id = nft.id">
						<img :src="nft.image_uri" alt="" loading="lazy" />
						<span>{{ nft.title }}</span>
					</button>
				</div>
				<small v-if="errors.nft_id" class="wz-error">{{ errors.nft_id }}</small>
			</fieldset>

			<fieldset class="wz-field">
				<span>{{ $t('auction.paymentType') }}</span>
				<div class="wz-segment" role="radiogroup" :aria-label="$t('auction.paymentType')">
					<button
						v-for="option in PAYMENTS"
						:key="option.value"
						type="button"
						role="radio"
						:class="{ 'is-active': form.payment === option.value }"
						:aria-checked="form.payment === option.value"
						@click="form.payment = option.value">
						{{ $t(option.label) }}
					</button>
				</div>
			</fieldset>

			<label class="wz-field" :class="{ 'is-invalid': errors.start_price }">
				<span>{{ $t('bid.start_price') }}</span>
				<div class="wz-price">
					<span>{{ currency }}</span>
					<input v-model="form.start_price" type="number" min="0" step="any" />
				</div>
				<small v-if="errors.start_price" class="wz-error">{{ errors.start_price }}</small>
			</label>

			<label class="wz-field" :class="{ 'is-invalid': errors.end_date }">
				<span>{{ $t('bid.end_date') }}</span>
				<VueDatePicker
					v-model="form.end_date"
					:min-date="minDate"
					:locale="locale"
					:format="formatEndDate"
					:is-24="true"
					:minutes-increment="1"
					:enable-time-picker="true"
					:auto-apply="true"
					:clearable="false"
					:teleport="true"
					:placeholder="$t('create_page.pick_end_date')" />
				<small v-if="errors.end_date" class="wz-error">{{ errors.end_date }}</small>
			</label>

			<button type="submit" class="wz-submit" :disabled="submitting">
				<span v-if="submitting" class="wz-spinner" aria-hidden="true"></span>
				<span>{{ submitting ? $t('create_page.sending') : $t('create_page.submit_auction') }}</span>
			</button>
		</div>

		<aside class="wz-card__preview" aria-live="polite">
			<span class="wz-label">{{ $t('create_page.summary') }}</span>
			<div class="wz-preview">
				<img v-if="selected" :src="selected.image_uri" alt="" />
				<span v-else class="wz-preview__empty">{{ $t('create_page.selected_none') }}</span>
			</div>
			<h3>{{ selected ? selected.title : '—' }}</h3>
			<dl class="wz-summary">
				<div>
					<dt>{{ $t('bid.start_price') }}</dt>
					<dd>{{ priceText }}</dd>
				</div>
				<div>
					<dt>{{ $t('bid.end_date') }}</dt>
					<dd>{{ endText }}</dd>
				</div>
				<div>
					<dt>{{ $t('auction.paymentType') }}</dt>
					<dd>{{ paymentLabel }}</dd>
				</div>
			</dl>
		</aside>
	</form>
</template>

<script setup>
	import { reactive, ref, computed, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { notify } from '@kyvg/vue3-notification';
	import { useNftStore } from '@/stores/nft';
	import { useAuctionStore } from '@/stores/auction';
	import '@/Model/wizard/wizard.css';
	import VueDatePicker from '@vuepic/vue-datepicker';
	import '@vuepic/vue-datepicker/dist/main.css';
	import '@/Model/wizard/datepicker.css';

	const PAYMENTS = [
		{ value: 'USDT', label: 'auction.paymentUsd' },
		{ value: 'ETH', label: 'auction.paymentEth' },
	];

	const router = useRouter();
	const { t, locale } = useI18n();

	const nfts = ref([]);
	const loading = ref(true);
	const submitting = ref(false);
	const errors = reactive({});

	// Paiement en dollars par défaut
	const form = reactive({
		nft_id: null,
		payment: 'USDT',
		start_price: '',
		end_date: null,
	});

	// Pas de date antérieure à maintenant
	const minDate = computed(() => new Date());

	const selected = computed(() => nfts.value.find((nft) => nft.id === form.nft_id) ?? null);
	const currency = computed(() => (form.payment === 'ETH' ? 'ETH' : 'CAD'));
	const paymentLabel = computed(() => {
		const option = PAYMENTS.find((item) => item.value === form.payment);
		return option ? t(option.label) : '';
	});
	const priceText = computed(() => {
		if (!form.start_price) return '—';
		return form.payment === 'ETH' ? `${form.start_price} ETH` : `$${form.start_price}`;
	});
	// Même format dans le champ et dans le récapitulatif, selon la langue du site
	const formatEndDate = (date) =>
		date ? date.toLocaleString(locale.value === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : '';
	const endText = computed(() => formatEndDate(form.end_date) || '—');

	const validate = () => {
		Object.keys(errors).forEach((key) => delete errors[key]);

		if (!form.nft_id) errors.nft_id = t('create_page.required');
		if (!(Number(form.start_price) > 0)) errors.start_price = t('create_page.required');
		if (!form.end_date) errors.end_date = t('create_page.required');
		else if (form.end_date <= new Date()) {
			errors.end_date = t('create_page.end_date_future');
		}

		return Object.keys(errors).length === 0;
	};

	const submit = async () => {
		if (submitting.value || !validate()) return;
		submitting.value = true;

		try {
			await useAuctionStore().createAuction({
				nft_id: form.nft_id,
				payment: form.payment,
				start_price: Number(form.start_price),
				end_date: form.end_date.toISOString(),
				start_date: new Date(),
			});
			notify({ title: t('success.title'), text: t('success.auction'), type: 'success' });
			router.push('/app/auctions');
		} catch (error) {
			notify({ title: t('error.title'), text: t('error.contact-us'), type: 'error' });
		} finally {
			submitting.value = false;
		}
	};

	onMounted(async () => {
		try {
			nfts.value = (await useNftStore().fetchMyAvailableNfts()) ?? [];
		} catch (error) {
			nfts.value = [];
		} finally {
			loading.value = false;
		}
	});
</script>

