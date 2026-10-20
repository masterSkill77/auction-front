import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "@/src/axios";

export const useMessageStore = defineStore("message", () => {
  const message = ref([]);
  const getMessages = computed(() => message.value);
  async function setMessages(currentUser, friend) {
    return await axios
      .get(`/chat/${currentUser.id}/${friend.id}`)
      .then((data) => (message.value = data));
  }

  return { message, setMessages, getMessages };
});
