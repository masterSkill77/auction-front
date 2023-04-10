import { defineStore } from "pinia";
import axios from "axios";

export const useAuction = defineStore("auction", async () => {
  const response = await axios
    .get("http://127.0.0.1:8000/api/auction")
    .then(({ data }) => data);
  const auctions = response.data;

  return { auctions };
});
