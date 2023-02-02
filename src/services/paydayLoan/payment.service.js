import { assert } from "@/core";
import { Http } from "../http.init";
import Configuration from "@/helpers/configuration";
import { APPLICATION_TYPE } from "../../helpers/constants";

let paymentURL =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_PAYMENT_API_URL");

export class PaymentService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "payment";
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
   * @version 0.0.9
   */
  // static async initPaymentTransaction(payload = {}, configs = {}) {
  //   assert.object(payload, { required: true });
  //   const response = await this.request({
  //     auth: true,
  //     baseURL: paymentURL,
  //     ...configs
  //   }).post(`${this.entity}/v1/vnpt/init-payment-transaction`, {
  //     ...payload
  //   });
  //   return response.data;
  // }

  /**
   * Init Repayment Gpay tng
   * @param customerId
   * @param applicationId
   * @param loanCode
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 1.0.13
   * @version 1.2.9
   */
  static async initRepaymentGpay(
    customerId,
    applicationId,
    loanCode,
    configs = {}
  ) {
    assert.string(customerId, { required: true });
    assert.string(applicationId, { required: true });
    assert.string(loanCode, { required: true });
    const applicationType = APPLICATION_TYPE.PAYDAYLOAN_TNG;
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).post(`${this.entity}/v1/repayments/gpay/paydayloan`, {
      customerId,
      applicationId,
      loanCode,
      applicationType
    });
    return response.data;
  }

  /**
   *
   * @param type
   * @param data
   * @param hmac
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.13
   * @version 1.0.13
   */
  static async webhookRepaymentGpay(type, data, hmac, configs = {}) {
    assert.string(type, { required: true });
    assert.string(data, { required: true });
    assert.string(hmac, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).post(`${this.entity}/v1/repayments/gpay/webhook`, {
      type,
      data,
      hmac
    });
    return response.data;
  }

  /**
   * Create virtual account gpay
   * @param customerId
   * @param accountName
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.135
   * @version 1.0.135
   */
  static async createVA({ customerId, accountName }, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(accountName, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).post(`${this.entity}/v1/gpayVirtualAccounts`, {
      customerId,
      accountName
    });
    return response.data;
  }

  /**
   * Get virtual account
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.135
   * @version 1.0.135
   */
  static async getVA({ customerId }, configs = {}) {
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).get(`${this.entity}/v1/gpayVirtualAccounts/${customerId}`);
    return response.data;
  }

  /**
   * Get repayment list of user
   * @param customerId
   * @param loanId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.135
   * @version 1.0.135
   */
  static async getRepaymentList({ customerId, loanId }, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(loanId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).get(
      `${this.entity}/v1/gpayVirtualAccounts/repaymentTransaction`,
      {
        params: { loanId: loanId }
      }
    );
    return response.data;
  }

  /**
   * Init payment order
   *
   * @param customerId
   * @param applicationId
   * @param applicationType
   * @param configs
   * @returns {Promise<any>}
   * @since 1.2.10
   * @version 1.2.10
   */
  static async createPaymentOrder(
    { customerId, applicationId, applicationType },
    configs = {}
  ) {
    assert.string(customerId, { required: true });
    assert.string(applicationId, { required: true });
    assert.string(applicationType, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: paymentURL,
      ...configs
    }).post(
      `${this.entity}/v1/gpayVirtualAccounts/paymentOrders`,
      {
        customerId,
        applicationId,
        applicationType
      }
    );
    return response.data;
  }
}
