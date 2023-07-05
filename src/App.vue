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
import { storeToRefs } from "pinia";

export default defineComponent({
  components: {
    Preloader,
    Header,
    Footer,
    RouterView,
  },
  mounted() {
    const { me } = storeToRefs(useAuthStore());
    const socket = io(import.meta.env.VITE_APP_SOCKET_URL);
    socket.emit("client_join", me.value);
    socket.on("joined", () => {
      console.log("joined");
    });

    socket.on("message_received", (data) => {
      this.$notify({
        title: this.$t("message.title"),
        text:
          this.$t("message.received") +
          data.from.name +
          " " +
          data.from.lastname,
        type: "success",
      });
    });
  },
  setup() {
    console.log();
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
