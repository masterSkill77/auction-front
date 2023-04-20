<template>
  {{ links }}
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ["links"],
  data() {
    return {
      myLinks: [],
    };
  },
  setup(props) {
    console.log(props);
  },
});
</script>
