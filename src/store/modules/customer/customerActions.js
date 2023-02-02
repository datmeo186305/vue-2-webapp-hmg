import { CustomerService } from "../../../services/paydayLoan/customer.service";
import { RATING_APPLICATION_TYPE } from "../../../helpers/constants";

export default {
  getRating({ commit, rootState }) {
    if (
      rootState.customer &&
      rootState.customer.customerId &&
      rootState.auth.access_token
    ) {
      CustomerService.getLatestRating(
        {
          customerId: rootState.customer.customerId,
          applicationType: RATING_APPLICATION_TYPE.PDL_TNG,
          isRated: false
        },
        { showModalResponseError: false, showModalResponseCodeError: false }
      ).then(rateInfo => {
        if (!rateInfo || rateInfo.responseCode !== 200) {
          commit("RESET_RATE_INFO");
          return;
        }
        commit("SET_RATE_INFO", rateInfo.result);
      });
    }
  }
};
