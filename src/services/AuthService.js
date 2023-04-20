const endpoint = import.meta.env.VITE_APP_BACKEND_URL;
import TokenService from "./TokenService";
import axios from "@/src/axios";
export default class AuthService {
  constructor() {
    this.tokenService = new TokenService();
  }
  isConnected() {
    var token = this.tokenService.getToken();

    if (token && token.length > 0) {
      return true;
    }

    return false;
  }

  async login(user) {
    return new Promise((resolve, reject) => {
      return axios
        .post(endpoint + "/login", user)
        .then((response) => {
          if (response.data.access_token) {
            var accessToken = response.data.access_token;
            this.tokenService.saveToken(accessToken);
          }
          this.isConnected();
          resolve(response);
        })
        .catch((error) => {
          this.tokenService.removeToken();
          this.tokenService.removeRefreshToken();
          reject(error);
        });
    });
  }
}
