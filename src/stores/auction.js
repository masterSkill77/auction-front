import { defineStore } from "pinia";
import axios from "@/src/axios";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    _auctions: [],
  }),
  actions: {
    async setAuctions() {
      const response = await axios
        .get("/auction")
        .then(({ data }) => data.data);
      this._auctions = response;
    },
    async setAuctionPage(pageNumber) {
      const response = await axios
        .get("/auction?page=" + pageNumber)
        .then(({ data }) => data.data);
      this._auctions = response;
    },
  },
  getters: {
    getAuctions() {
      return this.auctions;
    },
  },
});
