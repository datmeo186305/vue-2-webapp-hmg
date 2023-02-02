/**
 * HTTP request layer
 * if auth is required return patched axios instance(with access token in headers)
 * else return clear axios instance

 */
import axios from "axios";
import $store from "../store";
import i18n from "../lang/i18n";
import {StatusCodes} from "http-status-codes";

import {AuthService} from "@/services/paydayLoan/auth.service";

import {Severity} from "@sentry/types/dist/severity";
import {SentryService} from "./paydayLoan/sentry.service";
import {ERROR_CODE, ERROR_CODE_TEXT} from "../helpers/constants";
import Configuration from "../helpers/configuration";

let API_URL = Configuration.value('VUE_APP_API_URL') || process.env.VUE_APP_API_URL;

export class Http {
  constructor(configs = {}) {
    this.showLoader = configs.showLoader !== false;
    this.otherLoader = configs.otherLoader !== false;
    this.showModalResponseCodeError =
      configs.showModalResponseCodeError !== false;
    this.showModalResponseError = configs.showModalResponseError !== false;
    this.isAuth = configs.auth ? configs.auth : false;

    let requestConfigs = {
      baseURL: API_URL,
      timeout: 60000,
    };

    if (configs.baseURL) requestConfigs.baseURL = configs.baseURL;

    if (configs.headers) requestConfigs.headers = configs.headers;

    if (configs.responseType)
      requestConfigs.responseType = configs.responseType;

    this.instance = axios.create(requestConfigs);
    return this.init();
  }

  init() {
    this.instance.interceptors.request.use(
      request => {
        if (Configuration.value('VUE_APP_MAINTAIN') === "true") {
          AuthService._resetAuthData();
          this.showMaintainPopup()
          request.data = null;
          request.headers = null;
          request.params = null;
          request.baseURL = null;
          return request;
        }

        if (this.showLoader) this.showLoading();
        if (this.isAuth) {
          request.headers.authorization = AuthService.getBearer();
        }
        // if access token expired and refreshToken is exist >> go to API and get new access token
        if (AuthService.isAccessTokenExpired()) {
          AuthService._resetAuthData();
        }

        return request;
        // if (AuthService.isAccessTokenExpired() && AuthService.hasRefreshToken()) {
        //   return AuthService.debounceRefreshTokens()
        //     .then(response => {
        //       request.headers.authorization = AuthService.getBearer()
        //       return request
        //     }).catch(error => Promise.reject(error))
        // } else {
        //   return request
        // }
      },
      error => {
        SentryService.captureException(error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      response => {
        if (Configuration.value('VUE_APP_MAINTAIN') === "true") {
          return response;
        }
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (this.showLoader) this.hideLoading();

        if (response.data.responseCode) {
          this.handleResponseCodeError(response);
        }
        return response;
      },
      error => {
        if (Configuration.value('VUE_APP_MAINTAIN') === "true") {
          return Promise.reject(error).finally(() => {
            if (this.otherLoader || this.showLoader) this.hideLoading();
          });
        }
        this.handleStatusCodeError(error);

        return Promise.reject(error).finally(() => {
          if (this.otherLoader || this.showLoader) this.hideLoading();
        });
      }
    );

    return this.instance;
  }

  get(path = "/", configs = {}) {
    return this.instance.get(path, {responseType: "json", ...configs});
  }

  post(path = "/", data, configs = {}) {
    return this.instance.post(path, data, {...configs});
  }

  put(path = "/", data, configs = {}) {
    return this.instance.put(path, data, {...configs});
  }

  delete(path = "/", configs = {}) {
    return this.instance.delete(path, {...configs});
  }

  handleResponseCodeError(response) {
    if (response.data.responseCode > 201) {
      if (this.showModalResponseCodeError) {
        this.showErrorNotify(response.data.message, response.data.errorCode);
      }
      SentryService.captureMessage(
        "URI API: " + response.request.responseURL,
        {
          level: Severity.Warning
        },
        "src/services/http.init.js",
        "Http",
        "init",
        null,
        JSON.stringify(response.data)
      );
    }
  }

  handleStatusCodeError(error) {
    SentryService.captureMessage(
      "HTTP Protocol error",
      {
        level: Severity.Warning
      },
      "src/services/http.init.js",
      "Http",
      "init",
      null,
      error
    );
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      error &&
      error.response &&
      error.response.status === StatusCodes.UNAUTHORIZED
    ) {
      $store.commit("auth/DESTROY_AUTH");
      this.showUnauthorizedPopup();
    } else {
      if (this.showModalResponseError) {
        this.showErrorNotify(_getResponseErrorMessage(error));
      }
    }
  }

  showUnauthorizedPopup() {
    // Vue.notify({
    //   title: "ERROR",
    //   text: "Bạn không có quyền sử dụng chức năng này. Vui lòng đăng nhập lại",
    //   type: "error"
    // })
    $store.dispatch("modal/openErrorModal", {
      content: i18n.t("common.forbidden")
    });
    setTimeout(() => $store.dispatch("modal/openLoginModal"), 3000);
  }

  showMaintainPopup() {
    $store.dispatch("modal/openCloseWebsiteModal", {
      title: i18n.t("common.notification"),
      content: i18n.t("common.maintain_text"),
      btnText: i18n.t("payday_loan.more_info"),
      btnLink: Configuration.value('VUE_APP_ZALO_URL')
    });
  }

  showErrorNotify(text, title) {
    let titleMsg = title;
    let textMsg = text;
    let showTextMsg = false;
    if (title) {
      let errorCodes = Object.values(ERROR_CODE);
      if (errorCodes.includes(title)) textMsg = ERROR_CODE_TEXT[title];
      showTextMsg = true;
    }
    $store.dispatch("modal/openErrorModal", {
      title:
        Configuration.value('VUE_APP_PRODUCTION') === "true"
          ? i18n.t("common.error")
          : titleMsg,
      content:
        textMsg === "Network Error"
          ? i18n.t("common.network_error")
          : Configuration.value('VUE_APP_PRODUCTION') === "true" && !showTextMsg
            ? i18n.t("common.something_went_wrong")
            : textMsg
    });
  }

  showLoading() {
    $store.commit("loading/SHOW_LOADING");
  }

  hideLoading() {
    $store.commit("loading/HIDE_LOADING");
  }
}

function _getResponseErrorMessage(error) {
  if (error.response && error.response.data) {
    return error.response.data.message;
  }
  if (error.response && error.response.statusText)
    return error.response.statusText;
  return error.message;
}
