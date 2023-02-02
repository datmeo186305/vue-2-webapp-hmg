import router from "../../../router";
import { CustomerService } from "../../../services/paydayLoan/customer.service";
import {
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER
} from "../../../helpers/constants";
import formatSlug from "./../../../core/utils/format-slug";

const paydayLoanPages = [
  "PaydayLoanIndex",
  "PlSignIn",
  "PlEKYC",
  "PlConfirmInformation",
  "PlContractTermsOfService",
  "PlAdditionalInformation",
  "PlChooseAmountToBorrow",
  "PlCurrentLoan",
  "PlLoanPayment",
  "PlChoosePaymentMethod",
  "PlSignContract"
];
export default {
  clickPrevPageBtn({ commit, state }) {
    let currentPageIndex = paydayLoanPages.findIndex(
      page => state.currentPage === page
    );
    if (currentPageIndex < 0) return;

    if (state.currentPage === "PlSignIn") {
      if (state.authPage === "PlSignUp" && state.signingOtpMobile) {
        commit("RESET_SIGNING_OTP_MOBILE");
        return;
      }

      if (state.authPage === "PlSignUp") {
        commit("RESET_AUTH_PAGE");
        router.push({ name: "PlSignIn" });
        return;
      }

      if (state.authPage === "PlForgotPassword" && state.signingOtpMobile) {
        commit("SET_VERIFIED_OTP", false);
        commit("RESET_SIGNING_OTP_MOBILE");
        return;
      }

      if (state.authPage === "PlForgotPassword") {
        commit("RESET_AUTH_PAGE");
        router.push({ name: "PlSignIn" });
        return;
      }
    }

    if (state.currentPage === "PlContractTermsOfService") {
      commit("RESET_SENT_OTP_ONSIGN_STATUS");
      return;
    }

    if (state.currentPage === "PlSignContract") {
      commit("RESET_SENT_OTP_ONSIGN_STATUS");
      return;
    }

    commit("SET_CURRENT_PAGE", paydayLoanPages[currentPageIndex - 1]);
    if (paydayLoanPages[currentPageIndex - 1] === "PlCurrentLoan") {
      router.push({
        name: "PlCurrentLoan",
        params: { status: formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS) }
      });
    } else {
      router.push({ name: paydayLoanPages[currentPageIndex - 1] });
    }

    if (currentPageIndex > 1) {
      commit("SET_PREV_PAGE", paydayLoanPages[currentPageIndex - 2]);
    } else {
      commit("RESET_PREV_PAGE");
    }
  },
  fetchCurrentCustomerStatus({ commit, rootState, dispatch }) {
    if (
      rootState.customer &&
      rootState.customer.customerId &&
      rootState.auth.access_token
    ) {
      CustomerService.getById(rootState.customer.customerId).then(userInfo => {
        if (
          !userInfo ||
          userInfo.responseCode !== 200 ||
          !userInfo.result.personalData
        ) {
          return;
        }

        if (userInfo.result.personalData.paydayLoanStatus)
          commit(
            "SET_CUSTOMER_STATUS",
            userInfo.result.personalData.paydayLoanStatus
          );

        dispatch("customer/getRating", {}, { root: true });
      });
    }
  },
  async createNewPaydayLoan({ commit, rootState }) {
    if (!rootState.customer || !rootState.customer.customerId) return;

    setTimeout(async () => {
      let userInfo = await CustomerService.getById(
        rootState.customer.customerId
      );

      if (
        !userInfo ||
        userInfo.responseCode !== 200 ||
        !userInfo.result.personalData ||
        !userInfo.result.personalData.paydayLoanStatus
      ) {
        return;
      }

      commit(
        "SET_CUSTOMER_STATUS",
        userInfo.result.personalData.paydayLoanStatus
      );
      commit("RESET_HAS_ACTIVE_LOAN");

      if (
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[
          userInfo.result.personalData.paydayLoanStatus
        ] >= PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE
      ) {
        return router.push({ name: "PlChooseAmountToBorrow" });
      }

      await router.push({ name: "PlEKYC" });
    }, 3000);
  }
};
