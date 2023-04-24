<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination pagination-lg mb-4 justify-content-center">
      <li
        v-for="link in links"
        :key="link.label"
        class="page-item"
        :class="{ active: isActive(link.url) }"
      >
        <a
          class="page-link"
          @click.prevent="changePage(link.url)"
          href="{{link.url}}"
          v-html="link.label"
        ></a>
      </li>
    </ul>
  </nav>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: { links: Array, currentPage: Number },
  emits: ["changePage"],
  methods: {
    isActive(link) {
      const pageNumber = parseInt(link.split("=").pop());
      return pageNumber === this.currentPage;
    },
  },
  setup(props, { emit }) {
    let links = props.links;
    links.pop();
    links = links.slice(1);
    const changePage = function (link) {
      const pageNumber = parseInt(link.split("=").pop());
      console.log(pageNumber);
      emit("changePage", pageNumber);
    };
    return {
      links,
      changePage,
    };
  },
});
</script>
<style scoped></style>
