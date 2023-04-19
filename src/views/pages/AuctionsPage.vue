<template>
  <bread-cumb route_name="Auctions" />
  <Tab-auctions />
</template>
<script>
import BreadCumb from "../../components/UI/menu/BreadCumb.vue";
import TabAuctions from "../../Model/auctions/TabAuctions.vue";
export default {
  components: {
    "Tab-auctions": TabAuctions,
    BreadCumb,
  },
};
</script>
