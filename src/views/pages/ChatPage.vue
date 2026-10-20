<template>
	<div class="chat-page">
		<Chat />
	</div>
</template>

<script setup>
	import Chat from '@/components/UI/chat/Chat.vue';
	import { useLoadingStore } from '@/stores/loading';

	// Le store démarre avec le loader actif : cette page le retire elle-même
	useLoadingStore().setLoading(false);
</script>

<style scoped>
	.chat-page {
		padding: 8px 0 24px;
	}
</style>
