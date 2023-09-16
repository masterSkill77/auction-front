<template>
	<section class="cryptos-feature-area section-padding-100-0">
		<div class="row">
			<div class="col-12">
				<div class="section-heading text-center mx-auto">
					<h3><span v-html="$t('banner.1')"></span></h3>
				</div>
			</div>
		</div>
		<div class="gallery-wrap">
			<ul class="row">
				<li
					class="col-lg-4 col-md-6 col-sm-12"
					v-for="nft in allNfts.data"
					:key="nft.token_id">
					<div class="da-card box-shadow">
						<div class="da-card-photo">
							<img :src="nft.image_uri" alt="" />
							<div class="da-overlay">
								<div class="da-social">
									<h5 class="mb-10 color-white pd-20">
										{{ nft.title }}
									</h5>
									<ul class="clearfix">
										<li>
											<a
												:href="nft.image_uri"
												data-fancybox="images"
												target="_blank"
												><i class="fa fa-picture-o"></i
											></a>
										</li>
										<li>
											<a :href="nft.image_uri"><i class="fa fa-link"></i></a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<ul class="p-2">
							<li class="mb-10" style="word-break: break-all">
								Contrat : {{ contractAddress }}
							</li>
							<li class="mb-10">TokenID : {{ nft.token_id }}</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div class="text-center w-100 m-auto">
			<Pagination
				@changePage="changePage"
				v-if="linksOfPage"
				:links="linksOfPage"
				:currentPage="allNfts.current_page" />
		</div>
	</section>
</template>

<script>
	import { useNftStore } from '@/stores/nft';

	import { defineComponent, ref, onMounted } from 'vue';
	import { storeToRefs } from 'pinia';
	import Pagination from '@/components/UI/items/Pagination.vue';

	export default defineComponent({
		components: {
			Pagination,
		},
		computed: {
			linksOfPage() {
				return this.allNfts.value.links;
			},
		},
		watch: {
			allNfts: function (newValue) {
				this.linksOfPage = newValue.links;
			},
		},
		async setup() {
			let allNfts = ref({});
			let myNfts = ref();
			const contractAddress = '0x4CecC84d747bBEa3C1688a50B243B2868fa69bDe';
			let linksOfPage = ref(allNfts.links);
			return {
				linksOfPage,
				contractAddress,
				allNfts,
			};
		},
		methods: {
			async changePage(pageNumber) {
				this.allNfts = await useNftStore().fetchNftPage(pageNumber);
				this.linksOfPage = this.allNfts.links;
			},
			async fetchData() {
				await useNftStore().fetchMyNfts();
				const { myNfts } = storeToRefs(useNftStore());
				this.allNfts = myNfts.value;
				this.linksOfPage = this.allNfts.links;
			},
		},
		async mounted() {
			this.fetchData();
			await useNftStore().fetchMyNfts();
			const { myNfts } = storeToRefs(useNftStore());
			this.allNfts = myNfts.value;
			this.linksOfPage = this.allNfts.links;
			window.Echo.channel('auction').listen(
				'.auction-done',
				async function (data) {
					await fetchData();
				}
			);
		},
	});
</script>

<style scoped>
	.da-card-photo img {
		height: 350px;
		object-fit: cover;
	}
</style>
