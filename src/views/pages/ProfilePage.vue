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
                    </ul>
                    <btn v-if="!isMyFriend" @click="addToFriend" class="btn btn-md btn-success text-white">{{ $t("profile.add_friend") }}</btn>
                    <router-link class="btn btn-md btn-primary" to="/profile/chat" v-else>{{ $t("profile.chat_with") }}</router-link>
                  </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "@/src/axios";
import { storeToRefs } from "pinia";
import { reactive,ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
const me = storeToRefs(useAuthStore);

const userId = useRoute().params.id;

let user = await axios
  .get(import.meta.env.VITE_APP_BACKEND_URL + "/users/info/" + userId)
  .then((res) => res.data)
  .catch((e) => console.log(e));


  let friends = await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/users/friends")
      .then((res) => res.data);

  const isMyFriend =ref(false)
  friends.map((friend) => {
    if(friend.id == user.id)
    isMyFriend.value = true
  })

user = reactive(user);

const addToFriend = async () => {
  console.log(user);
  await axios.post(import.meta.env.VITE_APP_BACKEND_URL + "/users/friends" , {friendId : user.id}).then(() => {
    window.location.reload()
  })
}
</script>
