import { Http } from "../http.init";
import { assert } from "@/core";
import $store from "../../store";
import i18n from "../../lang/i18n";
import Configuration from "@/helpers/configuration";

let loanUrl =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_LOANAPP_API_URL");

export class LoanService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "loanapp";
    }
    return "";
  }

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static request(config = { auth: false }) {
    return new Http(config);
  }

  /**
   * Create loan
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async createLoan(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    })
      .post(`${this.entity}/v1/paydays`, {
        ...payload
      })
      .catch(error => {
        this.handleCreateLoanFailed(error);
      });
    if (!response) return;
    if (response.data.responseCode != 200) {
      this.handleCreateLoanFailed(response.data.message);
      return;
    }
    return response.data;
  }

  static handleCreateLoanFailed(error) {
    let errorMsg = this._getResponseErrorMessage(error);
    $store.dispatch("modal/openFailedModal", {
      title: i18n.t("payday_loan.choose_amount.create_loan_failed_title"),
      content:
        errorMsg === "Network Error"
          ? i18n.t("common.network_error")
          : i18n.t("payday_loan.choose_amount.create_loan_failed_desc")
    });
  }

  static _getResponseErrorMessage(error) {
    if (error.response && error.response.data)
      return error.response.data.message;
    if (error.response && error.response.statusText)
      return error.response.statusText;
    return error.message;
  }

  /**
   * Get current loan
   * @param customerId
   * @param coreToken
   * @param configs
   * @returns {Promise<any>}
   * @since 0.0.9
   * @version 1.0.13
   */
  static async getActiveLoan(customerId, coreToken, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(coreToken, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).get(`${this.entity}/v1/tngApplications/activeLoan`, {
      params: { coreToken: coreToken }
    });
    if (!response) return;
    return response.data;
  }

  /**
   * validate Promotion
   * @param customerId
   * @param voucherCode
   * @param configs
   * @returns {Promise<any>}
   * @since 0.0.9
   * @version 1.0.50
   */
  static async validatePromotion(customerId, voucherCode, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(voucherCode, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).post(`${this.entity}/v1/promotions/vouchers/validate`, {
      customerId,
      voucherCode
    });
    if (!response) return;
    return response.data;
  }

  /**
   * Save voucher transaction
   * @param customerId
   * @param voucherCode
   * @param isEvent
   * @param configs
   * @returns {Promise<any>}
   */
  static async createVoucherTransaction(
    { customerId, voucherCode, isEvent = false },
    configs = {}
  ) {
    assert.string(customerId, { required: true });
    assert.string(voucherCode, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).post(`${this.entity}/v1/promotions/vouchers/transactions`, {
      customerId,
      voucherCode,
      isEvent
    });
    if (!response) return;
    return response.data;
  }

  /**
   * Get all voucher
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   * @since 0.0.9
   * @version 1.0.50
   */
  static async getListPromotion(customerId, configs) {
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).get(`${this.entity}/v1/promotions/vouchers`, {
      params: {
        eventScope: "public",
        voucherType: "internal",
        customerId: customerId
      }
    });
    if (!response) return;
    return response.data;
  }

  /**
   * Get detail promotion
   * @param voucherCode
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.50
   * @version 1.0.50
   */
  static async getDetailPromotion({ voucherCode, customerId }, configs = {}) {
    assert.string(voucherCode, { required: true });
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).get(`${this.entity}/v1/promotions/vouchers/detail`, {
      params: { voucherCode, customerId }
    });
    if (!response) return;
    return response.data;
  }

  /**
   * Get contract by loanId , customerId
   * @param loanId
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.89
   * @version 1.0.89
   */
  static async getContract({ loanId, customerId }, configs = {}) {
    assert.string(loanId, { required: true });
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: loanUrl,
      ...configs
    }).get(`${this.entity}/v1/contracts/${loanId}`, {
      params: { customerId: customerId }
    });
    return response.data;
  }
}
