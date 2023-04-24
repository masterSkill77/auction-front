import { defineStore } from "pinia";
import axios from "@/src/axios";

export const useAuctionStore = defineStore("auction", {
  state: () => ({
    auctions: [], // évitez d'utiliser le préfixe _ pour les propriétés d'état
    auction: {},
    myAuctions: [],
  }),
  actions: {
    async fetchAuctions() {
      const response = await axios
        .get("/auction")
        .then(({ data }) => data.data);
      this.auctions = response;
    },
    async fetchMyAuctions() {
      const response = await axios
        .get("/mine/auctions")
        .then(({ data }) => data.data);
      this.myAuctions = response;
    },
    async fetchAuctionPage(pageNumber) {
      const response = await axios
        .get("/auction?page=" + pageNumber)
        .then(({ data }) => data.data);
      this.auctions = response;
    },
    async fetchAuction(id) {
      const response = await axios.get("/auction/" + id).then(({ data }) => {
        return data.data;
      });
      this.auction = response;
      return response;
    },
    setAuction(auction) {
      this.auction = auction;
    },
    async createAuction(auction) {
      const response = await axios
        .post("/auction/", auction)
        .then(({ data }) => {
          return data;
        });
    },
  },
  getters: {
    getAuctions() {
      return this.auctions;
    },
    getAuction: (state) => {
      return state.auction;
    },
  },
});
