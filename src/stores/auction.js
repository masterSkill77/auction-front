import { defineStore } from "pinia";
import axios from "axios";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    _auctions: [],
  }),
  actions: {
    async setAuctions() {
      const response = await axios
        .get(VITE_APP_BACKEND_URL + "/auction")
        .then(({ data }) => data);
      this._auctions = response;
    },
  },
  getters: {
    getAuctions() {
      return this.auctions;
    },
  },
});
