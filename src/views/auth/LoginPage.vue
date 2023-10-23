<template>
	<div class="blog-area section-padding-100">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-xl-6 col-md-6 mt-xl-5 pt-xl-3">
					<h2 class="text-center">Login</h2>
					<div class="form-group">
						<label for="exampleInputEmail1">Email address</label>
						<input
							type="email"
							class="form-control border-0 border-bottom-1"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							placeholder="Enter email"
							v-model="email" />
					</div>
					<div class="form-group">
						<label for="exampleInputPassword1">Password</label>
						<input
							type="password"
							class="form-control border-0 border-bottom-1"
							id="exampleInputPassword1"
							placeholder="Password"
							v-model="password"
							@keyup.enter="login" />
					</div>
					<div class="form-check">
						<input
							type="checkbox"
							class="form-check-input"
							id="exampleCheck1" />
						<label class="form-check-label" for="exampleCheck1"
							>Check me out</label
						>
					</div>
					<button @click="login" class="btn cryptos-btn btn-2 mt-2">
						Submit
					</button>
				</div>
				<div class="col-lg-6 col-xl-6 col-md-6 hvr-pulse-grow">
					<div class="w-100">
						<img
							src="/img/concept-nft-futuriste-plat_23-2148936480.jpg"
							alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { useAuthStore } from '@/stores/auth';
	import { storeToRefs } from 'pinia';
	import { useLoadingStore } from '@/stores/loading';

	export default {
		data() {
			return {
				email: '',
				password: '',
			};
		},
		async mounted() {
			useLoadingStore().setLoading(true);
			setTimeout(() => {
				useLoadingStore().setLoading(false);
			}, 2000);
			const { isAuthenticated } = storeToRefs(useAuthStore());
			if (isAuthenticated.value) return this.$router.push('/');
		},
		methods: {
			async login() {
				await useAuthStore()
					.login(this.email, this.password)
					.then(() => {
						this.$router.push({ name: 'home' });
					})
					.catch((error) => {
						if (error.response && error.response.data.error) {
							this.$notify({
								title: this.$t('error.' + error.response.data.error),
								text: this.$t('error.text-' + error.response.data.error),
								type: 'error',
							});
						} else
							this.$notify({
								title: this.$t('error.title'),
								text: this.$t('error.login'),
								type: 'error',
							});
					});
			},
		},
	};
</script>
<style scoped>
	.border-bottom-1 {
		border-bottom: 1px solid black !important;
	}
</style>
