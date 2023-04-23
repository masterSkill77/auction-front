<template>
  <TabNfts />
</template>
<script>
import { defineComponent } from "vue";
import { useNftStore } from "@/stores/nft";
import TabNfts from "../../Model/nft/TabNfts.vue";

export default defineComponent({
  components: { TabNfts },
  data() {
    return {
      myNft: [],
    };
  },
  methods: {
    async fetchData() {
      const response = await useNftStore().fetchMyNfts();
      console.log(response);
    },
  },
  mounted() {
    this.fetchData();
  },
});
</script>
