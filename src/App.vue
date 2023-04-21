<script>
import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
import AuthService from "@/services/AuthService";
import LoginPage from "./views/auth/LoginPage.vue";
import { useAuctionStore } from "./stores/auction";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Preloader,
    Header,
    Footer,
    RouterView,
  },
  setup() {
    const route = useRoute();
    onMounted(async () => {
      const auctionStore = useAuctionStore();
      await auctionStore.fetchAuctions();
    });
    return {
      route,
    };
  },
});
</script>

<template>
  <Preloader />
  <Header />
  <Suspense>
    <RouterView />
  </Suspense>
  <Footer />
</template>
