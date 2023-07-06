import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", () => {
  const message = ref([]);
  const getMessages = computed(() => message.value);
  async function setMessages(currentUser, friend) {
    return await axios
      .get(
        `${import.meta.env.VITE_CHAT_APP_URL}/${currentUser.id}/${friend.id}`
      )
      .then((data) => (message.value = data));
  }

  return { message, setMessages, getMessages };
});
