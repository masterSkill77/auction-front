import axios from "axios";
import router from "../router";
const TOKEN_NAME = "auction_token";
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_NAME);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status && error.response.status === 401) {
      localStorage.removeItem(TOKEN_NAME);
      router.push("/");
    }
    if (error.response.status && error.response.status === 404) {
      router.push("/404");
    }
    return Promise.reject(error);
  }
);

export default instance;
