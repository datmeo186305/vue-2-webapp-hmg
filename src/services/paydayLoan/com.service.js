import { Http } from "../http.init";
import { assert } from "@/core";
import queryHelper from "@/helpers/query-helper";
import Configuration from "@/helpers/configuration";

let comUrl =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_COM_API_URL");

export class ComService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "com";
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
   * Upload single file
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async uploadSingleFile(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      headers: { "Content-Type": "multipart/form-data" },
      baseURL: comUrl,
      ...configs
    }).post(
      `${this.entity}/v1/files/uploadSingleFile`,
      queryHelper.buildFormData({
        ...payload
      })
    );
    return response.data;
  }

  /**
   * Download single file
   * @param customerId
   * @param documentPath
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async downloadSingleFile(customerId, documentPath, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(documentPath, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: comUrl,
      responseType: "blob",
      ...configs
    }).post(`${this.entity}/v1/files/downloadFile`, {
      customerId,
      documentPath
    });
    if (!response) return null;
    return window.URL.createObjectURL(new Blob([response.data]));
  }

  /**
   * send letter otp
   * @param payload
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 1.0.88
   * @version 1.0.88
   */
  static async sentLetterOTP(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: comUrl,
      ...configs
    }).post(`${this.entity}/v1/contracts/TNG/sendLetter`, {
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
   * @since 1.0.88
   * @version 1.0.88
   */
  static async sentContractOTP(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: comUrl,
      ...configs
    }).post(`${this.entity}/v1/contracts/TNG/sendContract`, {
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
   * @since 1.0.88
   * @version 1.0.88
   */
  static async confirmOtpSign(payload = {}, configs = {}) {
    assert.object(payload, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: comUrl,
      ...configs
    }).post(`${this.entity}/v1/contracts/confirmOtp`, {
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
   * @since 1.1.37
   * @version 1.1.37
   */
  static async createApprovalLetter(
    { name, dateOfBirth, nationalId, customerId, employeeCode, idIssuePlace },
    configs = {}
  ) {
    const response = await this.request({
      auth: true,
      baseURL: comUrl,
      ...configs
    }).post(`${this.entity}/v1/contracts/TNG/createLetter`, {
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
