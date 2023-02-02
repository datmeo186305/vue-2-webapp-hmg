import { Http } from "../http.init";
import $store from "../../store";
import * as Sentry from "@sentry/browser";
import Configuration from "@/helpers/configuration";

let identityUrl =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_IDENTITY_API_URL");
export class AuthService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "identity";
    }
    return "";
  }

  /**
   ******************************
   * @API
   ******************************
   */

  /**
   * Send OTP to login
   * @param mobile
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  // static async loginMobileOtp({ mobile }) {
  //   const response = await new Http({
  //     baseURL: identityUrl
  //   }).post(`${this.entity}/v1/signOn/mobileLogin`, {
  //     mobile
  //   });
  //
  //   return response.data;
  // }

  /**
   * Signing OTP
   * @param mobile
   * @param otp
   * @param requestId
   * @param signature
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  // static async verifyMobileOtpLogin({ mobile, otp, requestId, signature }) {
  //   const response = await new Http({
  //     baseURL: identityUrl
  //   }).post(`${this.entity}/v1/signOn/mobile-otp-login-verify`, {
  //     mobile,
  //     otp,
  //     requestId,
  //     signature
  //   });
  //
  //   if (response.data.responseCode == 200) {
  //     _setAuthData({
  //       accessToken: response.data.result.accessToken,
  //       exp: _parseTokenData(response.data.result.accessToken).exp,
  //       customerId: response.data.result.customerId || null,
  //       customerMobile: response.data.result.customerMobile || null
  //     });
  //   }
  //
  //   return response.data;
  // }

  /**
   * Send OTP to create account
   * @param mobile
   * @param provider
   * @param configs
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async createCustomerAccount({ mobile, provider = 'CMC' }, configs = {}) {
    const response = await new Http({
      baseURL: identityUrl,
      ...configs
    }).post(`${this.entity}/v1/signOn/createCustomerAccount`, {
      mobile,
      provider
    });

    return response.data;
  }

  /**
   * Create account
   * @param mobile
   * @param otp
   * @param requestId
   * @param signature
   * @param password
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async createVerifiedCustomerAccount({
    mobile,
    otp,
    requestId,
    signature,
    password
  }) {
    const response = await new Http({
      baseURL: identityUrl
    }).post(`${this.entity}/v1/signOn/createVerifiedCustomerAccount`, {
      mobile,
      otp,
      requestId,
      signature,
      password
    });

    return response.data;
  }

  /**
   * Login
   * @param mobile
   * @param password
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async mobileLogin({ mobile, password }) {
    const response = await new Http({
      baseURL: identityUrl
    }).post(`${this.entity}/v1/signOn/mobileLogin`, {
      mobile,
      password
    });

    if (response.data.responseCode == 200) {
      _setAuthData({
        accessToken: response.data.result.accessToken,
        exp: _parseTokenData(response.data.result.accessToken).exp,
        customerId: response.data.result.customerId || null,
        customerMobile: response.data.result.customerMobile || null,
        passwordHash: response.data.result.passwordHash || null
      });
    }

    return response.data;
  }

  /**
   * Send OTP to reset password
   * @param mobile
   * @param provider
   * @param config
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async resetPassword({ mobile, provider }, config) {
    const response = await new Http({
      baseURL: identityUrl,
      ...config
    }).post(`${this.entity}/v1/signOn/resetPassword`, {
      mobile,
      provider
    });

    return response.data;
  }

  /**
   * Verify OTP to reset password
   * @param mobile
   * @param otp
   * @param requestId
   * @param signature
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async resetPasswordVerifiedOtp({ mobile, otp, requestId, signature }) {
    const response = await new Http({
      baseURL: identityUrl
    }).post(`${this.entity}/v1/signOn/resetPasswordVerifiedOtp`, {
      mobile,
      otp,
      requestId,
      signature
    });

    return response.data;
  }

  /**
   * Reset password
   * @param mobile
   * @param otp
   * @param requestId
   * @param signature
   * @param password
   * @param password_again
   * @returns {Promise<*>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async resetPasswordOtp({
    mobile,
    otp,
    requestId,
    signature,
    password,
    password_again
  }) {
    const response = await new Http({
      baseURL: identityUrl
    }).post(`${this.entity}/v1/signOn/resetPasswordOtp`, {
      mobile,
      otp,
      requestId,
      signature,
      password,
      password_again
    });

    return response.data;
  }

  static getBearer() {
    return `Bearer ${$store.state.auth.access_token}`;
  }

  static setRefreshToken(status) {
    if (!["", "true"].includes(status)) {
      throw new Error(
        `setRefreshToken: invalid value ${status}; Expect one of ['', 'true']`
      );
    }

    localStorage.setItem("refreshToken", status);
  }

  static isAccessTokenExpired() {
    const accessTokenExpDate = $store.getters.getCurrentExp - 10;
    const nowTime = Math.floor(new Date().getTime() / 1000);

    return accessTokenExpDate <= nowTime;
  }

  /**
   * Reset auth data
   * @private
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static _resetAuthData() {
    // reset userData in store
    $store.commit("auth/DESTROY_AUTH");
    // reset tokens
    AuthService.setRefreshToken("");
  }
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
    Sentry.captureException(error);
    throw new Error(error);
  }

  return tokenData;
}

/**
 * Set auth and customer data when login
 * @param accessToken
 * @param exp
 * @param customerId
 * @param customerMobile
 * @param passwordHash
 * @private
 * @author datnt
 * @since 0.0.9
 * @version 0.0.9
 */
function _setAuthData({
  accessToken,
  exp,
  customerId,
  customerMobile,
  passwordHash
} = {}) {
  $store.commit("auth/SET_AUTH", {
    hasAccess: true,
    access_token: accessToken,
    accessTokenExpDate: exp
  });

  $store.commit("customer/SET_CUSTOMER_INFO", {
    customerId: customerId,
    customerMobile: customerMobile,
    passwordHash: passwordHash
  });

  Sentry.setUser({
    id: customerId,
    username: customerMobile,
    email: "",
    ip_address: ""
  });
}
