<template>
  <div class="row">
    <div class="col-md-12 col-sm-12">
      <div class="blog-detail card-box overflow-hidden mb-30">
        <div class="row">
          <div class="blog-img col-lg-5 col-md-12 cursor-pointer hvr-buzz-out">
            <img
              :src="JSON.parse(user.configuration.profile_image)[0].content"
              alt=""
            />
          </div>
          <div class="blog-caption col-lg-7">
            <h4 class="mb-10">
              {{ user.name + " " + user.lastname }}
            </h4>
            <p>
                    <ul>
                      <li>{{ $t("personnalInfo.username") }} : {{ user.username }}</li>
                      <li>{{ $t("personnalInfo.email") }} : {{ user.email }}</li>
                      <li>Ajouter en tant qu'ami</li>
                    </ul>
                  </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "@/src/axios";
import { reactive } from "vue";
import { useRoute } from "vue-router";
const userId = useRoute().params.id;

let user = await axios
  .get(import.meta.env.VITE_APP_BACKEND_URL + "/users/info/" + userId)
  .then((res) => res.data)
  .catch((e) => console.log(e));

user = reactive(user);
</script>
