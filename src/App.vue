<script>
import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
import Preloader from "@/components/theme/Preloader.vue";
import Header from "@/components/theme/Header.vue";
import Footer from "@/components/theme/Footer.vue";
import { useAuctionStore } from "./stores/auction";
import { useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";

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
    onMounted(async () => {
      const auctionStore = useAuctionStore();
      await auctionStore.fetchAuctions();
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
    <Header v-if="route.name != 'Profile'" />
    <Suspense>
      <RouterView />
    </Suspense>
  </div>
  <Footer />
</template>
