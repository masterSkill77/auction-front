<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination pagination-lg mb-4 justify-content-center">
      <li class="page-item disabled">
        <a class="page-link" href="#" tabindex="-1">Previous</a>
      </li>
      <li class="active page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li>
      <li class="page-item">
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>
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
