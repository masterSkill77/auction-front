import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
	const setLoading = (value) => {
		loading.value = value;
	};
	const loading = ref(true);
	return {
		loading,
		setLoading,
	};
});
