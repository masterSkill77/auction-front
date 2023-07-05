<template>
  <div class="mb-4">
    <Chat :friends="friends" :socket="socket" />
  </div>
</template>

<script>
import axios from "@/src/axios";
import { storeToRefs } from "pinia";
import { defineComponent, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import Chat from "../../components/UI/chat/Chat.vue";

// Or if you used CDN import
// window['vue-advanced-chat'].register()

export default defineComponent({
  async setup() {
    const socket = io(import.meta.env.VITE_APP_SOCKET_URL);

    const { me } = storeToRefs(useAuthStore());
    let friends = await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/users/friends")
      .then((res) => res.data);

    friends = ref(friends);
    return {
      friends,
      socket,
      me,
    };
  },
  components: { Chat },
});
</script>
