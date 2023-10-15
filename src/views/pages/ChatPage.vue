<template>
	<div class="mb-4">
		<Chat :friends="friends" :socketIo="socketIO" />
	</div>
</template>

<script>
	import axios from '@/src/axios';
	import { storeToRefs } from 'pinia';
	import { defineComponent, ref } from 'vue';
	import { useAuthStore } from '../../stores/auth';
	import { useLoadingStore } from '../../stores/loading';
	import Chat from '../../components/UI/chat/Chat.vue';

	// Or if you used CDN import
	// window['vue-advanced-chat'].register()

	export default defineComponent({
		mounted() {
			useLoadingStore().setLoading(true);
			setTimeout(() => {
				useLoadingStore().setLoading(false);
			}, 1500);
		},
		async setup() {
			let Io = io != undefined ? io : () => {};

			const socketIO = Io(import.meta.env.VITE_APP_SOCKET_URL);

			const { me } = storeToRefs(useAuthStore());
			let friends = await axios
				.get(import.meta.env.VITE_APP_BACKEND_URL + '/users/friends')
				.then((res) => res.data);

			friends = ref(friends);
			return {
				friends,
				socketIO,
				me,
			};
		},
		components: { Chat },
	});
</script>
