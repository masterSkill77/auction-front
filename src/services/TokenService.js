const TOKEN_NAME = "auction_usertoken";
export default class TokenService {
  constructor() {
    this.storage = window.localStorage;
  }
  getToken() {
    return this.storage.getItem(TOKEN_NAME);
  }

  saveToken(accessToken) {
    this.storage.setItem(TOKEN_NAME, accessToken);
  }

  removeToken() {
    this.storage.removeItem(TOKEN_NAME);
  }
}
