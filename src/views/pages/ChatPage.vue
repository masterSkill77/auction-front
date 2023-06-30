<template>
  <Chat />
  <!--
  <vue-advanced-chat
    :current-user-id="me.id"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
import Chat from "../../components/UI/chat/Chat.vue";
    :room-actions="JSON.stringify(roomActions)"
  />
--></template>

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
    const { me } = storeToRefs(useAuthStore());
    const allUsers = await axios
      .get(import.meta.env.VITE_APP_BACKEND_URL + "/users/friends")
      .then((res) => res.data);
    const rooms = allUsers.map((user) => ({
      roomId: user.id,
      roomName: user.username,
      index: user.id,
      typingUsers: me.id,
      users: [{ user, me }],
    }));
    console.log(rooms);
    return {
      rooms,
      me,
    };
  },
  data() {
    return {
      rooms: [
        {
          roomId: "1",
          roomName: "Room 1",
          avatar: "assets/imgs/people.png",
          unreadCount: 4,
          index: 3,
          lastMessage: {
            _id: "xyz",
            content: "Last message received",
            senderId: "1234",
            username: "John Doe",
            timestamp: "10:20",
            saved: true,
            distributed: false,
            seen: false,
            new: true,
          },
          users: [
            {
              _id: "1234",
              username: "John Doe",
              avatar: "assets/imgs/doe.png",
              status: {
                state: "online",
                lastChanged: "today, 14:30",
              },
            },
            {
              _id: "4321",
              username: "John Snow",
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
              },
            },
          ],
          typingUsers: [4321],
        },
      ],
      messages: [
        {
          _id: "7890",
          indexId: 12092,
          content: "Message 1",
          senderId: "1234",
          username: "John Doe",
          avatar: "assets/imgs/doe.png",
          date: "13 November",
          timestamp: "10:20",
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: true,
          disableActions: false,
          disableReactions: false,
          files: [
            {
              name: "My File",
              size: 67351,
              type: "png",
              audio: true,
              duration: 14.4,
              url: "https://firebasestorage.googleapis.com/...",
              preview: "data:image/png;base64,iVBORw0KGgoAA...",
              progress: 88,
            },
          ],
          reactions: {
            // 😁: [
            //   '1234', // USER_ID
            //   '4321'
            // ],
            // 🥰: [
            //   '1234'
            // ]
          },
          replyMessage: {
            content: "Reply Message",
            senderId: "4321",
            files: [
              {
                name: "My Replied File",
                size: 67351,
                type: "png",
                audio: true,
                duration: 14.4,
                url: "https://firebasestorage.googleapis.com/...",
                preview: "data:image/png;base64,iVBORw0KGgoAA...",
              },
            ],
          },
        },
      ],
      roomActions: [],
    };
  },
  components: { Chat },
});
</script>
