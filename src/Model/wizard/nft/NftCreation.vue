<template>
	<form class="wz-card" novalidate @submit.prevent="submit">
		<div class="wz-card__main">
			<h2>{{ $t('create_page.nft_title') }}</h2>
			<p class="wz-card__lead">{{ $t('create_page.nft_subtitle') }}</p>

			<label class="wz-field" :class="{ 'is-invalid': errors.title }">
				<span>{{ $t('auction.title') }}</span>
				<input v-model="form.title" type="text" maxlength="120" autocomplete="off" />
				<small v-if="errors.title" class="wz-error">{{ errors.title }}</small>
			</label>

			<label class="wz-field" :class="{ 'is-invalid': errors.image_uri }">
				<span>{{ $t('create_page.image_url') }}</span>
				<input
					v-model="form.image_uri"
					type="url"
					placeholder="https://…"
					spellcheck="false"
					autocomplete="off" />
				<small class="wz-hint">{{ $t('create_page.image_hint') }}</small>
				<small v-if="errors.image_uri" class="wz-error">{{ errors.image_uri }}</small>
			</label>

			<label class="wz-field" :class="{ 'is-invalid': errors.description }">
				<span>{{ $t('auction.description') }}</span>
				<textarea v-model="form.description" rows="5" maxlength="1000"></textarea>
				<small class="wz-count">{{ form.description.length }} / 1000</small>
				<small v-if="errors.description" class="wz-error">{{ errors.description }}</small>
			</label>

			<button type="submit" class="wz-submit" :disabled="submitting">
				<span v-if="submitting" class="wz-spinner" aria-hidden="true"></span>
				<span>{{ submitting ? $t('create_page.sending') : $t('create_page.submit_nft') }}</span>
			</button>
		</div>

		<aside class="wz-card__preview" aria-live="polite">
			<span class="wz-label">{{ $t('create_page.preview') }}</span>
			<div class="wz-preview">
				<img
					v-if="previewOk"
					:src="form.image_uri.trim()"
					alt=""
					referrerpolicy="no-referrer"
					@error="previewFailed = true" />
				<span v-else class="wz-preview__empty">
					{{ previewFailed ? $t('create_page.preview_error') : $t('create_page.preview_empty') }}
				</span>
			</div>
			<h3>{{ form.title.trim() || '—' }}</h3>
			<p class="wz-preview-text">{{ shortDescription }}</p>
		</aside>
	</form>
</template>

<script setup>
	import { reactive, ref, computed, watch } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { notify } from '@kyvg/vue3-notification';
	import { useNftStore } from '@/stores/nft';
	import '@/Model/wizard/wizard.css';

	const CATEGORY_ID = 1;
	const URL_PATTERN = /^https?:\/\/\S+$/;

	const router = useRouter();
	const { t } = useI18n();

	const form = reactive({ title: '', image_uri: '', description: '' });
	const errors = reactive({});
	const submitting = ref(false);
	const previewFailed = ref(false);

	watch(
		() => form.image_uri,
		() => (previewFailed.value = false)
	);

	const previewOk = computed(
		() => URL_PATTERN.test(form.image_uri.trim()) && !previewFailed.value
	);

	const shortDescription = computed(() => {
		const text = form.description.trim();
		return text.length > 140 ? `${text.slice(0, 140)}…` : text;
	});

	const validate = () => {
		Object.keys(errors).forEach((key) => delete errors[key]);

		if (!form.title.trim()) errors.title = t('create_page.required');
		if (!form.image_uri.trim()) errors.image_uri = t('create_page.required');
		else if (!URL_PATTERN.test(form.image_uri.trim())) {
			errors.image_uri = t('create_page.invalid_url');
		}
		if (!form.description.trim()) errors.description = t('create_page.required');

		return Object.keys(errors).length === 0;
	};

	const submit = async () => {
		if (submitting.value || !validate()) return;
		submitting.value = true;

		try {
			await useNftStore().createNft({
				title: form.title.trim(),
				description: form.description.trim(),
				image_uri: form.image_uri.trim(),
				category_id: CATEGORY_ID,
			});
			notify({ title: t('success.title'), text: t('success.nft'), type: 'success' });
			router.push('/app/nfts');
		} catch (error) {
			const code = error.response?.data?.error;
			notify({
				title: t('error.title'),
				text: code ? t(`error.${code}`) : t('error.contact-us'),
				type: 'error',
			});
		} finally {
			submitting.value = false;
		}
	};
</script>
