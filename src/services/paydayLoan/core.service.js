import { Http } from "../http.init";
import { assert } from "@/core";
import Configuration from "@/helpers/configuration";

let coreURL = Configuration.value('VUE_APP_PRODUCTION') === "true"
  ? Configuration.value('VUE_APP_API_URL')
  : Configuration.value('VUE_APP_API_CORE_URL');
export class CoreService {
  static get entity() {
    if (
      Configuration.value('VUE_APP_PRODUCTION') === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "core/epay/v1";
    }
    return "epay/v1";
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
   * Borrower step one
   * https://epay.sandbox.integreat.perfios.com/api/v1/borrower/stepOne
   * @param payload
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 0.0.9
   */
  static async borrowerStepOne(payload = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: coreURL,
      showLoader: true
    }).post(`${this.entity}/core/api/v1/borrower/stepOne`, {
      ...payload
    });
    return response.data;
  }

  /**
   * Sign in account on core
   * https://epay.sandbox.integreat.perfios.com/restApi/login
   * @param username
   * @param password
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 0.0.9
   */
  static async restApiLogin({ username, password }) {
    assert.string(username, { required: true });
    assert.string(password, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: coreURL,
      showLoader: false
    }).post(`${this.entity}/restApi/login`, {
      username,
      password
    });
    return response.data;
  }

  /**
   * https://epay.sandbox.integreat.perfios.com/api/v1/borrower/acceptContract
   * @param access_token string required
   * @param loanId string required
   * @param contractId string required
   * @param activityStatus string required
   * @param epayCustomerId string required
   * @param configs  string required
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.2
   */
  static async borrowerAcceptContract(
    access_token,
    loanId,
    contractId,
    activityStatus,
    epayCustomerId,
    configs = {}
  ) {
    assert.string(access_token, { required: true });
    assert.string(loanId, { required: true });
    assert.string(contractId, { required: true });
    assert.string(activityStatus, { required: true });
    assert.string(epayCustomerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: coreURL,
      ...configs
    }).post(`${this.entity}/core/api/v1/borrower/acceptContract`, {
      access_token,
      loanId,
      contractId,
      activityStatus,
      epayCustomerId
    });
    return response.data;
  }

  /**
   * https://epay.sandbox.integreat.perfios.com/api/v1/borrower/borrowerLoanContractDownload
   * @param access_token string required
   * @param loanUuid string required
   * @param contractUuid string required
   * @param epayCustomerId string required
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.2
   */
  static async borrowerLoanContractDownload(
    access_token,
    loanUuid,
    contractUuid,
    epayCustomerId,
    configs = {}
  ) {
    assert.string(access_token, { required: true });
    assert.string(loanUuid, { required: true });
    assert.string(contractUuid, { required: true });
    assert.string(epayCustomerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: coreURL,
      ...configs
    }).post(
      `${this.entity}/core/api/v1/borrower/borrowerLoanContractDownload`,
      {
        access_token,
        loanUuid,
        contractUuid,
        epayCustomerId
      }
    );
    return response.data;
  }
}
