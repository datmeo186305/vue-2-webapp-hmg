import { Http } from "./http.init";
import $store from "../store";
import * as Sentry from "@sentry/browser";
// import $router from "../router";

export class AuthService {
  static get entity() {
    return "visitor";
  }

  /**
   ******************************
   * @API
   ******************************
   */

  static async login({ username, password }) {
    const response = await new Http().post(`${this.entity}/login`, {
      username,
      password
    });
    _setAuthData({
      accessToken: response.data.data.accessToken,
      exp: _parseTokenData(response.data.data.accessToken).exp,
      vistor_id: response.data.data.vistor_id
    });

    return response.data;
  }

  static async register({ mobile, password, passwordConfirm }) {
    const response = await new Http().post(`${this.entity}/register`, {
      mobile,
      password,
      passwordConfirm
    });
    return response.data;
  }

  static async requestRecoveryPass({ mobile }) {
    const response = await new Http().post(
      `${this.entity}/request-recovery-pass`,
      { mobile }
    );
    return response.data;
  }

  static async recoveryPass(payload) {
    const response = await new Http().post(`${this.entity}/recovery-pass`, {
      payload
    });
    return response.data;
  }

  static async verifyOtp(payload) {
    const response = await new Http().post(`${this.entity}/verify-otp`, {
      payload
    });
    return response.data;
  }

  // static async logout() {
  //   const response = await new Http({ auth: true }).post(
  //     `${this.entity}/logout`,
  //     {}
  //   );
  //   _resetAuthData();
  //   return response.data;
  // }

  // static async refreshTokens() {
  //   try {
  //     const response = await new Http().post(`${this.entity}/refresh-tokens`);
  //
  //     _setAuthData({
  //       accessToken: response.data.data.accessToken,
  //       exp: _parseTokenData(response.data.data.accessToken).exp
  //     });
  //     return response.data;
  //   } catch (error) {
  //     _resetAuthData();
  //     await $store.dispatch("modal/openLoginModal");
  //     throw error;
  //   }
  // }
  //
  // static debounceRefreshTokens = this._debounce(() => {
  //   return this.refreshTokens();
  // }, 100);

  /**
   ******************************
   * @METHODS
   ******************************
   */

  static isAccessTokenExpired() {
    const accessTokenExpDate = $store.getters.getCurrentExp - 10;
    const nowTime = Math.floor(new Date().getTime() / 1000);

    return accessTokenExpDate <= nowTime;
  }

  static hasRefreshToken() {
    return Boolean(localStorage.getItem("refreshToken"));
  }

  static setRefreshToken(status) {
    if (!["", "true"].includes(status)) {
      throw new Error(
        `setRefreshToken: invalid value ${status}; Expect one of ['', 'true']`
      );
    }

    localStorage.setItem("refreshToken", status);
  }

  static getBearer() {
    return `Bearer ${$store.state.auth.access_token}`;
  }

  static _resetAuthData() {
    // reset userData in store
    $store.commit("auth/DESTROY_AUTH");
    // reset tokens
    AuthService.setRefreshToken("");
  }

  /**
   * https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises
   * @param inner
   * @param ms
   * @returns {function(...[*]): Promise<unknown>}
   * @private
   */
  // static _debounce(inner, ms = 0) {
  //   let timer = null;
  //   let resolves = [];
  //
  //   return function() {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       const result = inner();
  //       resolves.forEach(r => r(result));
  //       resolves = [];
  //     }, ms);
  //
  //     return new Promise(resolve => resolves.push(resolve));
  //   };
  // }
}

/**
 ******************************
 * @private_methods
 ******************************
 */

function _parseTokenData(accessToken) {
  let payload = "";
  let tokenData = {};

  try {
    payload = accessToken.split(".")[1];
    tokenData = JSON.parse(atob(payload));
  } catch (error) {
    throw new Error(error);
  }

  return tokenData;
}

function _setAuthData({ accessToken, exp, vistor_id = "" } = {}) {
  AuthService.setRefreshToken("true");
  $store.commit("auth/SET_AUTH", {
    visitor_id: vistor_id,
    hasAccess: true,
    access_token: accessToken,
    accessTokenExpDate: exp
  });
}
