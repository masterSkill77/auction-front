<template>
  <div class="row">
    <div
      class="col-lg-3 col-md-12 col-sm-12 m-0 p-0"
      style="background-color: rgba(69, 75, 73, 0.185)"
    >
      <ul>
        <li
          v-for="friend in friends"
          :key="friend"
          @click="getMessage(friend)"
          :class="{
            'cursor-pointer userSpace p-4 mb-2': true,
            active: friend == selectedUser,
          }"
        >
          {{ friend.username }}
        </li>
      </ul>
    </div>
    <div v-if="selectUser.id != undefined" class="col-lg-9 col-md-12 col-sm-12">
      <div class="navbar w-100 header mb-2">
        <h4>
          {{ selectedUser.name }}
          {{ selectedUser.lastname }}
        </h4>
      </div>
      <div ref="listMessage" class="messageContent">
        <div v-if="loading && messages.length != 0" class="spinner-container">
          <span class="spinner-border spinner-border-xl" role="status"></span>
        </div>
        <ul>
          <li v-for="message in messages" :key="message.id">
            <div
              :class="{ message: true, fromMe: message.from == me.id }"
              v-if="message.type == 'TEXT'"
            >
              <p v-html="message.content"></p>
              <span>{{ formatMoment(message.time).fromNow() }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="footer-chat chat-footer">
        <!--<div class="file-upload">
          <a href="#"><i class="fa fa-paperclip"></i></a>
        </div>
        -->
        <div class="chat_text_area">
          <textarea
            placeholder="Type your message…"
            v-model="message"
          ></textarea>
        </div>
        <div class="chat_send">
          <button
            class="btn btn-link"
            :disabled="message.length <= 0"
            @click="sendMessage"
          >
            <i class="icon-copy ion-paper-airplane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.spinner-container {
  transition: all 0.5;
  height: 70%;
  text-align: center;
  width: 100%;
  z-index: 20;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.active {
  background-color: rgba(23, 17, 17, 0.674);
  color: rgb(172, 155, 155);
}
.footer-chat {
  z-index: 20;
}
.message {
  clear: both;
  border-radius: 25px;
  width: 70%;
  padding: 15px;
  margin: 5px;
  font-weight: lighter;
  font-family: "sans-serif";
  font-size: 14px;
  background-color: #ecf0f4;
}
.message span {
  font-family: "sans-serif";
  font-size: 12px;
}
.fromMe {
  float: right;
  background-color: #e1e1f5;
}
.header {
  position: initial !important;
}
.userSpace {
  transition: all 0.75s;
  font-weight: bold;
  border-left: 10px solid brown;
}
.userSpace:hover {
  transition: all 1s;
  background-color: rgb(64, 61, 61);
  color: white;
}
.messageContent {
  max-height: 30em;
  overflow-y: scroll;
}
</style>
<script>
import moment from "moment";
import { useI18nStore } from "../../../stores/i18n";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth";
import axios from "axios";

export default {
  props: ["friends", "socketIo"],
  data() {
    return {
      message: "",
      selectUser: {},
      messages: [],
      loading: false,
      me: {},
    };
  },

  mounted() {
    this.socketIo.on("message_received", (data) => {
      if (this.selectedUser.id == data.from.id) {
        this.loading = true;
        this.messages = data.messages.sort(
          (a, b) => parseInt(a.time) - parseInt(b.time)
        );
        setTimeout(() => {
          this.loading = false;
          this.scrollToBottom();
        }, 1000);
      }
    });
    const { me } = storeToRefs(useAuthStore());
    this.me = me.value;

    this.socketIo.emit("client_join", me.value);
    this.socketIo.on("joined", () => {
      console.log("joined");
    });

    moment.locale("fr", {
      months:
        "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
          "_"
        ),
      monthsShort:
        "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split(
          "_"
        ),
      monthsParseExact: true,
      weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split(
        "_"
      ),
      weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
      weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
      weekdaysParseExact: true,
      longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY HH:mm",
        LLLL: "dddd D MMMM YYYY HH:mm",
      },
      calendar: {
        sameDay: "[Aujourd’hui à] LT",
        nextDay: "[Demain à] LT",
        nextWeek: "dddd [à] LT",
        lastDay: "[Hier à] LT",
        lastWeek: "dddd [dernier à] LT",
        sameElse: "L",
      },
      relativeTime: {
        future: "dans %s",
        past: "il y a %s",
        s: "quelques secondes",
        m: "une minute",
        mm: "%d minutes",
        h: "une heure",
        hh: "%d heures",
        d: "un jour",
        dd: "%d jours",
        M: "un mois",
        MM: "%d mois",
        y: "un an",
        yy: "%d ans",
      },
      dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
      ordinal: function (number) {
        return number + (number === 1 ? "er" : "e");
      },
      meridiemParse: /PD|MD/,
      isPM: function (input) {
        return input.charAt(0) === "M";
      },
      // In case the meridiem units are not separated around 12, then implement
      // this function (look at locale/id.js for an example).
      // meridiemHour : function (hour, meridiem) {
      //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
      // },
      meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? "PD" : "MD";
      },
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4, // Used to determine first week of the year.
      },
    });
  },
  computed: {
    selectedUser: function () {
      return this.selectUser;
    },
  },
  methods: {
    scrollToBottom() {
      const element = this.$refs.listMessage;
      if (element) {
        element.scrollTop += element.scrollHeight;
      }
    },
    async sendMessage() {
      this.loading = true;
      const data = {
        toUser: this.selectUser,
        fromUser: this.me,
        message: this.message,
      };

      const retour = this.socketIo.emit("send_message", data);
      if (retour) {
        this.$notify({
          title: this.$t("message.title"),
          text: this.$t("message.success"),
          type: "success",
        });
        setTimeout(async () => {
          await this.getMessage(this.selectUser);
          this.loading = false;
        }, 1000);
      }
      this.message = "";
    },
    async getMessage(friend) {
      this.loading = true;
      this.selectUser = friend;
      await axios
        .get(`${import.meta.env.VITE_CHAT_APP_URL}/${this.me.id}/${friend.id}`)
        .then((res) => res.data)
        .then((data) => {
          this.messages = data.sort(
            (a, b) => parseInt(a.time) - parseInt(b.time)
          );
          return true;
        })
        .finally(() => {
          const $ = this;
          setTimeout(() => {
            $.loading = false;
          }, 1500);
          this.$nextTick(() => {
            $.scrollToBottom();
          });
        });
    },
    formatMoment: (date) => {
      moment.locale(useI18nStore().currentLocale);
      return moment(date);
    },
  },
};
</script>
