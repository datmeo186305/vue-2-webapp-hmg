import { assert } from "@/core";
import { Http } from "../http.init";
import Configuration from "@/helpers/configuration";

export class RestConfigService {
  static get entity() {
    return "";
  }

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static request(
    config = {
      baseURL:
        Configuration.value('VUE_APP_SANDBOX_API_URL') || process.env.VUE_APP_SANDBOX_API_URL,
      auth: false
    }
  ) {
    return new Http(config);
  }

  /**
   * getCommonPropertySuggest
   * @param propertyType
   * @returns {Promise<any>}
   * @author datnt
   * @since 0.0.9
   * @version 0.0.9
   */
  static async getCommonPropertySuggest(propertyType) {
    assert.string(propertyType, { required: true });
    const response = await this.request({
      baseURL:
        Configuration.value('VUE_APP_SANDBOX_API_URL') || process.env.VUE_APP_SANDBOX_API_URL,
      auth: true
    }).get(
      `${this.entity}/v1/restConfig/commonPropertySuggest?propertyType=${propertyType}`,
      {
        propertyType: propertyType
      }
    );
    return response.data;
  }
}
