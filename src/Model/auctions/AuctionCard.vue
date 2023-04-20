<template>
  <div class="text-center m-auto">test</div>
</template>
<script>
export default {
  mounted() {
    console.log(this.$route.params.auctionId);
  },
};
</script>
