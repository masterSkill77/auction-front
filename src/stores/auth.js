import { defineStore } from "pinia";
import axios from "axios";
const TOKEN_NAME = "auction_token";
const USER_TOKEN = "auction_user";
const IS_AUTHENTICATED = "auction_isAuthenticated";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    _isAuthenticated: localStorage.getItem(IS_AUTHENTICATED) || false,
    token: localStorage.getItem(TOKEN_NAME) || "",
    user: JSON.parse(localStorage.getItem(USER_TOKEN)) || {},
  }),
  getters: {
    isAuthenticated() {
      return !!this.token;
    },
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(VITE_APP_BACKEND_URL + "/login", {
          email,
          password,
        });
        this._isAuthenticated = true;
        this.token = response.data.access_token;
        this.user = response.data.user;
        localStorage.setItem(IS_AUTHENTICATED, true);
        localStorage.setItem(TOKEN_NAME, this.token);
        localStorage.setItem(USER_TOKEN, JSON.stringify(this.user));
      } catch (error) {
        console.error(error);
        throw new Error("Login failed");
      }
    },

    logout() {
      this._isAuthenticated = false;
      this.token = "";
      this.user = {};
      localStorage.removeItem(IS_AUTHENTICATED);
      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem(USER_TOKEN);
    },
  },
});
