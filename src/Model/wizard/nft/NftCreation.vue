<template>
  <div>
    <div class="form-group row">
      <label class="col-sm-12 col-md-2 col-form-label">Text</label>
      <div class="col-sm-12 col-md-10">
        <input
          class="form-control"
          v-model="title"
          type="text"
          placeholder="Johnny Brown"
        />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-12 col-md-2 col-form-label">URL</label>
      <div class="col-sm-12 col-md-10">
        <input v-model="image_uri" class="form-control" type="url" />
      </div>
    </div>
    <div class="form-group">
      <label>Textarea</label>
      <textarea class="form-control" v-model="description"></textarea>
    </div>
    <div class="btn btn-primary mb-3" @click="uploadNft">
      {{ $t("form.button.submit") }}
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useNftStore } from "@/stores/nft";

export default defineComponent({
  setup() {
    let title = ref("");
    let description = ref("");
    let image_uri = ref("");
    const category_id = 1;
    return {
      title,
      description,
      category_id,
      image_uri,
      description,
    };
  },
  methods: {
    async uploadNft() {
      const body = {
        title: this.title,
        description: this.description,
        image_uri: this.image_uri,
        category_id: this.category_id,
      };
      await useNftStore()
        .createNft(body)
        .then((data) => {
          this.$notify({
            title: this.$t("success.title"),
            text: this.$t("success.nft"),
            type: "success",
          });
        })
        .catch(({ response }) => {
          if (response.data.error)
            this.$notify({
              title: this.$t("error.title"),
              text: this.$t("error." + response.data.error),
              type: "error",
            });
          else {
            this.$notify({
              title: this.$t("error.title"),
              text: this.$t("error.contact-us"),
              type: "error",
            });
          }
        });
    },
  },
});
</script>
