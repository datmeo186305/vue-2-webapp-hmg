import { assert } from "@/core";
import { Http } from "../http.init";
import queryHelper from "@/helpers/query-helper";
import Configuration from "@/helpers/configuration";

let customerUrl =
  Configuration.value("VUE_APP_PRODUCTION") === "true"
    ? Configuration.value("VUE_APP_API_URL")
    : Configuration.value("VUE_APP_CUSTOMER_API_URL");

export class CustomerService {
  static get entity() {
    if (
      Configuration.value("VUE_APP_PRODUCTION") === "true" ||
      process.env.VUE_APP_PRODUCTION === "true"
    ) {
      return "customer";
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
   * Get customer info by id
   * @param id
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async getById(id, configs = {}) {
    // assert.string(id, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/infos`);
    return response.data;
  }

  /**
   * Confirm information
   * @param id
   * @param data
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async confirmInformation(id, data = {}, configs = {}) {
    assert.string(id, { required: true });
    assert.object(data, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/infos/confirmInformation`, data);
    return response.data;
  }

  /**
   * Validate Confirm information request
   * @param id
   * @param data
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async validateConfirmInformationRequest(id, data = {}, configs = {}) {
    assert.string(id, { required: true });
    assert.object(data, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(
      `${this.entity}/v1/infos/validateConfirmInformationRequest`,
      data
    );
    return response.data;
  }

  /**
   * Additional information
   * @param id
   * @param data
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async additionalInformation(id, data = {}, configs = {}) {
    assert.string(id, { required: true });
    assert.object(data, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/infos/additionalInformation`, data);
    return response.data;
  }

  /**
   * Check employee code is valid employee code of TNG
   * @param employee_code
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async checkIsEmployeeWorkingAtTNG(employee_code, configs = {}) {
    assert.string(employee_code, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/tngs/checkIsEmployeeAtTng`, {
      employeeCode: employee_code
    });
    return response.data;
  }

  /**
   * completeEkyc
   * @param image
   * @param image_back
   * @param image_selfie
   * @param configs
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 1.0.13
   */
  static async completeEkyc(image, image_back, image_selfie, configs = {}) {
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(
      `${this.entity}/v1/kalapas/idCard/plus?verify=true`,
      queryHelper.buildFormData({
        image,
        image_selfie,
        image_back
      })
    );
    return response.data;
  }

  /**
   * Get the latest approval letter by customerId
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.0.105
   * @version 1.0.105
   */
  static async getLatestApprovalLetter({ customerId }, configs = {}) {
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/approvalLetters/latest`);
    return response.data;
  }

  /**
   * Return confirm information page if cant get tng info
   * @param customerId
   * @param configs
   * @returns {Promise<any>}
   */
  // static async returnConfirmInformation(customerId, configs = {}) {
  //   assert.string(customerId, { required: true });
  //   const response = await this.request({
  //     auth: true,
  //     baseURL: customerUrl,
  //     ...configs
  //   }).post(
  //     `${this.entity}/v1/infos/${customerId}/return-confirm-information`,
  //     {}
  //   );
  //   return response.data;
  // }

  /**
   * Choose company default tng
   * @param customerId
   * @param companyId
   * @param configs
   * @returns {Promise<any>}
   * @since 1.2.3
   * @version  1.2.3
   */
  static async chooseCompany(customerId, companyId, configs = {}) {
    assert.string(customerId, { required: true });
    assert.string(companyId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/infos/chooseCompany`, {
      companyId: companyId
    });
    return response.data;
  }

  /**
   * Update customer sign done status
   * @param customerId
   * @param idRequest
   * @param idDocument
   * @param documentPath
   * @param configs
   * @returns {Promise<any>}
   * @since 1.2.3
   * @version  1.2.3
   */
  static async updateCustomerSignApprovalLetterDoneStatus(
    { customerId, idRequest, idDocument, documentPath },
    configs = {}
  ) {
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/infos/customerSignDone`, {
      documentPath,
      idRequest,
      idDocument
    });
    return response.data;
  }

  /**
   * Request get tng data from tng after sign done approval leter
   * @param customerId
   * @param documentPath
   * @param configs
   * @returns {Promise<any>}
   */
  static async requestGetTngData({ customerId, documentPath }, configs = {}) {
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).post(`${this.entity}/v1/infos/requestGetTngData`, {
      customerId,
      documentPath
    });
    return response.data;
  }

  /**
   * Get company info by companyId
   * @param companyId
   * @param configs
   * @returns {Promise<any>}
   */
  static async getCompanyInfo({ companyId }, configs = {}) {
    assert.string(companyId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/companies/${companyId}`);
    return response.data;
  }

  /**
   * Update rating
   * @param id
   * @param rate
   * @param customerOpinion
   * @param configs
   * @returns {Promise<any>}
   */
  static async updateRating(
    { id, rate = "", customerOpinion = "" },
    configs = {}
  ) {
    assert.string(id, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).put(`${this.entity}/v1/ratings/${id}`, {
      rate,
      customerOpinion
    });
    return response.data;
  }

  /**
   * Get latest rating
   * @param customerId
   * @param applicationType
   * @param isRated
   * @param configs
   * @returns {Promise<any>}
   */
  static async getLatestRating(
    { customerId, applicationType, isRated },
    configs = {}
  ) {
    assert.string(customerId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/ratings/latest`, {
      params: {
        customerId: customerId,
        applicationType: applicationType,
        isRated: isRated
      }
    });
    return response.data;
  }

  static async getAllCity(configs = {}) {
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/cities`);
    return response.data;
  }

  static async getDistrictsByCityId(cityId, configs = {}) {
    assert.string(cityId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/cities/${cityId}/districts`);
    return response.data;
  }

  static async getCommunesByDistrictId(districtId, configs = {}) {
    assert.string(districtId, { required: true });
    const response = await this.request({
      auth: true,
      baseURL: customerUrl,
      ...configs
    }).get(`${this.entity}/v1/districts/${districtId}/communes`);
    return response.data;
  }
}
