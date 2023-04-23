<template>
  <section class="cryptos-feature-area section-padding-100-0">
    <div class="row">
      <div class="col-12">
        <div class="section-heading text-center mx-auto">
          <h3>Let’s change <br /><span>the world</span> together</h3>
          <p>
            Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi. Donec
            et sollicitudin est, in euismod erat. Ut at erat et arcu pulvinar
            cursus a eget nisl. Cras vitae turpis lacinia, lacinia lacus non,
            fermentum nisi.
          </p>
        </div>
      </div>
    </div>
    <div class="gallery-wrap">
      <ul class="row">
        <li
          class="col-lg-4 col-md-6 col-sm-12"
          v-for="nft in allNfts.data"
          :key="nft.id"
        >
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
                      <a href="#"><i class="fa fa-link"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="text-center w-100 m-auto">
      <Pagination
        @changePage="changePage"
        v-if="linksOfPage"
        :links="linksOfPage"
        :currentPage="allNfts.current_page"
      />
    </div>
  </section>
</template>

<script>
import { useNftStore } from "@/stores/nft";

import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Pagination from "@/components/UI/items/Pagination.vue";

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
    let linksOfPage = ref(allNfts.links);
    return {
      linksOfPage,
      allNfts,
    };
  },
  methods: {
    async changePage(pageNumber) {
      await useNftStore().fetchNftPage(pageNumber);
      const { myNfts } = storeToRefs(useNftStore());
      this.allNfts = myNfts.value;
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
    // window.Echo.channel("Nft").listen(".Nft-done", async function (data) {
    //   console.log(data);
    //   await fetchData();
    // });
  },
});
</script>

<style></style>
