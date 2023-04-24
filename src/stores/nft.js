import { defineStore } from "pinia";
import axios from "@/src/axios";

export const useNftStore = defineStore("nft", {
  state: () => ({
    nfts: [], // évitez d'utiliser le préfixe _ pour les propriétés d'état
    nft: {},
    myNfts: [],
  }),
  actions: {
    async createNft(body) {
      return axios.post("/nft", body);
    },
    async fetchNfts() {
      const response = await axios.get("/nft").then(({ data }) => data.data);
      this.nfts = response;
    },
    async fetchMyNfts() {
      const response = await axios
        .get("/mine/nft")
        .then(({ data }) => data.data);
      this.myNfts = response;
      return response;
    },
    async fetchMyAvailableNfts() {
      const response = await axios
        .get("/mine/nft/available")
        .then(({ data }) => data.data);
      return response;
    },
    async fetchNftPage(pageNumber) {
      const response = await axios
        .get("/mine/nft?page=" + pageNumber)
        .then(({ data }) => data.data);
      this.myNfts = response;
    },
    async fetchNft(id) {
      const response = await axios.get("/nft/" + id).then(({ data }) => {
        return data.data;
      });
      this.nft = response;
      return response;
    },
    setNft(nft) {
      this.nft = nft;
    },
  },
  getters: {
    getNfts() {
      return this.nfts;
    },
    getNft: (state) => {
      return state.nft;
    },
  },
});
