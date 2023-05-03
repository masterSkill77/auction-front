<script>
import { defineComponent, onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
import { useAuctionStore } from "./stores/auction";
import { useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useNftStore } from "./stores/nft";

export default defineComponent({
  components: {
    Preloader,
    Header,
    Footer,
    RouterView,
  },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const route = useRoute();
    onBeforeMount(async () => {
      if (isAuthenticated) {
        await useAuctionStore().fetchAuctions();
        await useNftStore().fetchMyNfts();
        const auctionStore = useAuctionStore();
        await auctionStore.fetchAuctions();
      }
    });
    return {
      route,
      isAuthenticated,
    };
  },
});
</script>

<template>
  <Preloader />
  <div>
    <Header />
    <Suspense>
      <RouterView />
    </Suspense>
    <notifications />
  </div>
  <Footer />
</template>
