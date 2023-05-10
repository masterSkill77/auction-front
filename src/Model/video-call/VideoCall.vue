<style>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
<template>
  <div id="video-grid"></div>
  <button class="btn btn-danger" @click="disconnect">Déconnexion</button>
</template>

<script>
export default {
  data() {
    return {
      peer: null,
      socket: null,
      userCalled: {},
      userId: null,
      myVideoStream: null,
    };
  },
  mounted() {
    window.addEventListener("beforeunload", () => {
      if (this.myVideoStream) {
        this.myVideoStream.getTracks().forEach((track) => track.stop());
        this.myVideoStream = null;
      }
      this.peer.disconnect();
      this.socket.disconnect();
    });
    const videoGrid = document.getElementById("video-grid");

    this.peer = new Peer(undefined, {
      host: "/",
      port: import.meta.env.VITE_PEERJS_PORT,
    });

    this.socket = io(import.meta.env.VITE_APP_SOCKET_URL);

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.addVideoStream(this.myVideo, stream);

        this.peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            this.addVideoStream(video, userVideoStream);
          });
          call.on("close", () => {
            video.remove();
          });
          this.userCalled[call.peer] = call;
        });

        this.socket.on("user-connected", (userId) => {
          this.connectToNewUser(userId, stream);
        });
      });

    this.socket.on("user-disconnected", (userId) => {
      if (this.userCalled[userId]) {
        this.userCalled[userId].close();
        delete this.userCalled[userId];
        const video = document.querySelector(`[data-id="${userId}"]`);
        if (video) {
          video.remove();
        }
      }
    });

    this.peer.on("open", (id) => {
      this.userId = id;
      const ROOM_ID = "my-room";
      this.socket.emit("join-room", ROOM_ID, id);
    });

    this.socket.on("user-connected", (userId) => {});

    this.myVideo = document.createElement("video");
    this.myVideo.muted = true;
  },
  beforeDestroy() {
    for (const userId in this.userCalled) {
      if (this.userCalled[userId]) {
        this.userCalled[userId].close();
        delete this.userCalled[userId];
      }
    }
    this.peer.disconnect();
    this.socket.disconnect();
  },
  beforeUnmount() {
    // Fermer la connexion PeerJS
    this.peer.destroy();

    // Fermer la connexion WebSocket
    this.socket.disconnect();

    // Arrêter le flux vidéo de la webcam
    if (this.myVideoStream) {
      this.myVideoStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.myVideoStream = null;
    }
  },
  methods: {
    disconnect() {
      if (this.myVideoStream) {
        this.myVideoStream.getTracks().forEach((track) => {
          track.stop();
        });
        this.myVideoStream = null;
      }
      this.peer.destroy();
      this.socket.disconnect();
      this.$router.push("/");
    },
    addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      this.myVideoStream = stream;

      video.setAttribute("data-id", this.userId);
      document.getElementById("video-grid").append(video);
    },

    connectToNewUser(userId, stream) {
      const call = this.peer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        this.addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });

      this.userCalled[userId] = call;
    },
  },
};
</script>
