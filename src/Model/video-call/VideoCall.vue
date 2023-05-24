<style>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}
video {
  width: 100%;
  height: 100%;
  padding: 5px;
  object-fit: cover;
}
</style>
<template>
  <div class="m-4">
    <Teleport to="body">
      <div
        class="modal fade"
        id="liveModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="liveModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="liveModalLabel">
                {{ $t("bid.title") }}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form @submit.prevent="makeBid">
              <div class="modal-body">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="bid"
                    required
                    min="0"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <div class="input-group-append">
                    <span class="input-group-text">.00</span>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
    <div class="row">

      <div class="col-8">
        <div id="video-grid"></div>
        <button
          class="mt-4 mr-2 btn btn-warning"
          v-if="auction.owner_id == me.id"
        >
          Terminer l'enchère
        </button>
        <button
          class="mt-4 mr-2 btn btn-primary"
          v-if="auction.owner_id == me.id"
        >
          Sonner la cloche
        </button>
        <button
          class="mt-4 mr-2 btn btn-danger"
          v-if="auction.owner_id != me.id"
          @click="disconnect"
        >
          Déconnexion
        </button>
        <button
          class="mt-4 mr-2 btn btn-primary"
          v-if="auction.owner_id != me.id"
          data-toggle="modal"
          data-target="#liveModal"
        >
          Placer une offre
        </button>
      </div>
      <div class="col-4">
        <div class="cryptos-tab-text">
                  <p>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{{  $t('personnalInfo.user') }}</th>
                          <th scope="col">{{ $t('bid.amount') }} ($)</th>
                          <th scope="col">{{ $t('bid.date')}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        <tr v-for="bid in auction.bids.reverse()" :key="bid.id">
                          <th scope="row">{{ bid.id }}</th>
                          <td>{{ bid.bidder.name + " " + bid.bidder.lastname }}</td>
                          <td>{{  new Intl.NumberFormat('fr').format(bid.bid_amount ) }}</td>
                          <td>{{  bid.created_at  }}</td>
                        </tr>
                      </tbody>
                    </table>

                  </p>
                </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAuctionStore } from "../../stores/auction";
import { useAuthStore } from "../../stores/auth";
import { useBidStore } from "../../stores/bid";
export default {
  data() {
    return {
      peer: null,
      socket: null,
      userCalled: {},
      auction: {
        bids : []
      },
      userId: null,
      myVideoStream: null,
      me: {},
      bid: null,
      auctionId: null,
    };
  },
  async mounted() {
    const { me } = storeToRefs(useAuthStore());
    this.me = me.value;
    const auction_uuid = this.$route.params.uuid;
    this.auctionId = auction_uuid;
    const $ = this;
    window.Echo.channel("bid").listen(
        ".bid-placed",
        async function () {
          $.auction.bids = (await useAuctionStore().fetchAuction(auction_uuid)).bids;
        })
    this.auction = await useAuctionStore().fetchAuction(auction_uuid);
    if (auction_uuid && this.auction && this.auction.status != 1) {
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
        const ROOM_ID = auction_uuid;
        this.socket.emit("join-room", ROOM_ID, id);
      });

      this.socket.on("user-connected", (userId) => {
        console.log('user connected', userId);
        // window.location.reload();
      });

      this.myVideo = document.createElement("video");
      this.myVideo.muted = true;
    }
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
    if (this.peer) this.peer.destroy();

    if (this.socket)
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
    async makeBid() {
      const body = {
        bidder_id: this.me.id,
        bid_amount: this.bid,
        auction_id: this.auctionId,
      };
      const response = await useBidStore()
        .makeBid(body)
        .then((data) => {
          this.$notify({
            title: this.$t("success.title"),
            text: this.$t("success.bid"),
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
        });
      this.bid = 0;
      this.auction = await useAuctionStore().fetchAuction(this.auctionId);
    },
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
