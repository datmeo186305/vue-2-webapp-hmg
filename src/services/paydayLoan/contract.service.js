import { Http } from "../http.init";
import { assert } from "@/core";
import queryHelper from "@/helpers/query-helper";
import Configuration from "@/helpers/configuration";

let contractUrl =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_CONTRACT_API_URL");

export class ContractService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "contract";
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
   * send letter otp
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   */
  static async sentLetterOTP(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: contractUrl,
      ...configs
    }).post(`${this.entity}/v1/sign/send-letter/TNG`, {
      ...payload
    });
    return response.data;
  }

  /**
   * send contract otp
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   */
  static async sentContractOTP(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: contractUrl,
      ...configs
    }).post(`${this.entity}/v1/sign/send-contract/TNG`, {
      ...payload
    });
    return response.data;
  }

  /**
   * confirm otp onsign
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   */
  static async confirmOtpSign(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: contractUrl,
      ...configs
    }).post(`${this.entity}/v1/sign/confirm-otp`, {
      ...payload
    });
    return response.data;
  }

  /**
   * Create approval letter
   * @param name
   * @param dateOfBirth
   * @param nationalId
   * @param customerId
   * @param employeeCode
   * @param idIssuePlace
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   */
  static async createApprovalLetter(
    { name, dateOfBirth, nationalId, customerId, employeeCode, idIssuePlace },
    configs = {}
  ) {
    const response = await this.request({
      auth: true,
      baseURL: contractUrl,
      ...configs
    }).post(`${this.entity}/v1/letter/create/TNG`, {
      name,
      dateOfBirth,
      nationalId,
      customerId,
      employeeCode,
      idIssuePlace
    });
    return response.data;
  }
}
