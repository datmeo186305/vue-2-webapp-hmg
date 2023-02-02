<template>
  <div class="container-fluid pl-auth-layout">
    <div class="container-fluid pl-content-auth">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <div class="pl-auth-form">
            <div class="pl-title-sign-in">
              <p>{{ $t("payday_loan.auth.login") }}</p>
              <img :src="'/img/pl/icon-monex.svg'" alt="" />
            </div>
            <pl-sign-in-form @submitForm="submit" />
            <div class="pl-footer-sign-in">
              <p>{{ $t("payday_loan.auth.have_not_account") }}</p>
              <router-link :to="{ name: 'PlSignUp' }" class="pl-link-in-line"
                >{{ $t("payday_loan.auth.register_now") }}
              </router-link>
            </div>
          </div>
          <!--          <link-to-store class="pl-link-to-store-sign-in" />-->
        </div>
      </div>
    </div>
    <img
      src="/img/pl/bg-illustration.png"
      class="pl-bottom-auth-container pl-bottom-auth-bg"
      alt=""
    />
  </div>
</template>

<script>
import PlSignInForm from "../../components/Forms/PlSignInForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { AuthService } from "../../services/paydayLoan/auth.service";
import { CoreService } from "../../services/paydayLoan/core.service";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import {
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_STATUS_PAGE,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER,
  PL_VALUE_DEFAULT
} from "../../helpers/constants";
import _ from "lodash";
import { LoanService } from "../../services/paydayLoan/loan.service";
import moment from "moment";
import formatSlug from "@/core/utils/format-slug";
import Configuration from "@/helpers/configuration";

export default {
  name: "SignIn",
  components: { PlSignInForm },
  data() {
    return {
      params: {
        mobile: "",
        password: ""
      },
      customerId: "",
      coreToken: "",
      currentDate: new Date(),
      openDate: null,
      countdownTime: PL_VALUE_DEFAULT.COUNTDOWN_TIME,
      countdownStartTime: PL_VALUE_DEFAULT.COUNTDOWN_START_TIME,
      closeDate: null,
      closeStatus: false,
      countdownTimeStatus: false
    };
  },
  computed: {
    ...mapGetters({
      hasActiveLoan: "paydayLoan/currentHasActiveLoan"
    }),
    openDateText() {
      return this.openDate
        ? moment(new Date(this.openDate), "DD/MM/YYYY").format("DD/MM")
        : null;
    },
    openDateCountdownText() {
      return this.countdownTime
        ? moment(new Date(this.countdownTime), "YYYY-MM-DD HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )
        : null;
    }
  },
  created() {
    // this.initCloseWebsiteStatus();
    this.initCountdownStatus();
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(false);
    this.setCurrentPage("PlSignIn");
    this.resetSession();
  },
  methods: {
    ...mapMutations({
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setPassword: "customer/SET_PASSWORD",
      setCoreToken: "auth/SET_CORE_TOKEN",
      setCustomerName: "customer/SET_CUSTOMER_NAME",
      setHasActiveLoan: "paydayLoan/SET_HAS_ACTIVE_LOAN",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      resetCustomerStatus: "paydayLoan/RESET_CUSTOMER_STATUS",
      resetPaymentStatus: "paydayLoan/RESET_PAYMENT_STATUS",
      resetHasActiveLoan: "paydayLoan/RESET_HAS_ACTIVE_LOAN",
      resetCustomerInfo: "customer/RESET_CUSTOMER_INFO",
      resetSignedContractTermsStatus:
        "paydayLoan/RESET_SIGNED_CONTRACT_TERMS_STATUS",
      resetSignedContractStatus: "paydayLoan/RESET_SIGNED_CONTRACT_STATUS",
      resetLoanCode: "paydayLoan/RESET_LOAN_CODE",
      resetSentOtpOnsignStatus: "paydayLoan/RESET_SENT_OTP_ONSIGN_STATUS",
      destroyAuth: "auth/DESTROY_AUTH",
      setCloseWebsiteStatus: "paydayLoan/SET_CLOSE_WEBSITE_STATUS",
      setCountdownTimerStatus: "paydayLoan/SET_COUNTDOWN_TIMER_STATUS",
      resetChooseAmountSuccess: "paydayLoan/RESET_CHOOSE_AMOUNT_SUCCESS",
      resetConfirmInformationSuccessStatus:
        "paydayLoan/RESET_CONFIRM_INFORMATION_SUCCESS",
      resetRateInfo: "customer/RESET_RATE_INFO",
      resetOtpType: "paydayLoan/RESET_OTP_TYPE"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      openCloseWebsiteModal: "modal/openCloseWebsiteModal",
      getRatingInfo: "customer/getRating"
    }),
    resetSession() {
      this.destroyAuth();
      this.resetEkycInfo();
      this.resetCustomerStatus();
      this.resetPaymentStatus();
      this.resetHasActiveLoan();
      this.resetCustomerInfo();
      this.resetSignedContractTermsStatus();
      this.resetSignedContractStatus();
      this.resetLoanCode();
      this.resetSentOtpOnsignStatus();
      this.resetChooseAmountSuccess();
      this.resetConfirmInformationSuccessStatus();
      this.resetRateInfo();
      this.resetOtpType();
    },

    // initCloseWebsiteStatus() {
    //   this.closeDate = new Date(
    //     this.currentDate.getFullYear(),
    //     this.currentDate.getMonth(),
    //     PL_VALUE_DEFAULT.CLOSE_DATE
    //   );
    //   this.openDate = new Date(
    //     this.currentDate.getFullYear(),
    //     this.currentDate.getMonth(),
    //     PL_VALUE_DEFAULT.OPEN_DATE
    //   );
    //   this.closeStatus =
    //     this.currentDate >= this.closeDate &&
    //     this.currentDate <= this.openDate &&
    //     Configuration.value("VUE_APP_PRODUCTION") === "true";
    // },

    initCountdownStatus() {
      this.countdownTimeStatus =
        new Date(this.countdownTime).getTime() > new Date().getTime() &&
        new Date(this.countdownStartTime).getTime() < new Date().getTime() &&
        Configuration.value("VUE_APP_PRODUCTION") === "true";
    },

    submit(params) {
      this.checkWhitelistMobileCountdownTime(params.mobile);
      this.checkWhiteListMobileCloseWebsite(params.mobile);

      this.setPassword(params.password);
      this.login(params);
    },

    checkWhitelistMobileCountdownTime(mobile) {
      if (!mobile) return;
      if (
        new Date(this.countdownTime).getTime() < new Date().getTime() ||
        PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(mobile)
      ) {
        this.countdownTimeStatus = false;
      }
      this.setCountdownTimerStatus(this.countdownTimeStatus);
    },

    checkWhiteListMobileCloseWebsite(mobile) {
      if (!mobile) return;
      if (PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(mobile)) {
        this.closeStatus = false;
      }
      this.setCloseWebsiteStatus(this.closeStatus);
    },

    /**
     * Login
     */
    async login(params) {
      const mobileLoginResponse = await this.mobileLogin(params);
      if (mobileLoginResponse.responseCode !== 200) {
        return;
      }

      this.customerId = mobileLoginResponse.result.customerId;

      await this.getUserInfo(params);
    },

    async mobileLogin(params) {
      return await AuthService.mobileLogin({
        mobile: params.mobile,
        password: params.password
      });
    },

    async getUserInfo(params) {
      let userInfo = await this.getDetailCustomer(this.customerId);
      if (
        !userInfo ||
        !userInfo.result ||
        userInfo.responseCode !== 200 ||
        !userInfo.result.personalData
      ) {
        this.resetSession();
        return;
      }

      this.setCustomerName(userInfo.result.personalData.firstName);

      if (!_.isEmpty(userInfo.result.personalData.stepOne)) {
        const validCoreToken = await this.getValidCoreToken(userInfo, params);
        if (!validCoreToken) {
          return;
        }
      }

      if (_.isEmpty(userInfo.result.personalData.companyId)) {
        await this.chooseCompany();
      }

      this.getRatingInfo();

      await this.redirectToCurrentPage(userInfo);
    },

    async getValidCoreToken(userInfo, params) {
      if (userInfo.result.personalData.stepOne !== "DONE") {
        return true;
      }

      const restSignInCoreResponse = await this.restSignInCore(params);
      if (restSignInCoreResponse.code !== 200) {
        this.handleSignInCoreError(restSignInCoreResponse);
        return false;
      }

      this.coreToken = restSignInCoreResponse.result.access_token;
      return this.coreToken;
    },

    handleSignInCoreError(response) {
      if (this.countdownTimeStatus || this.closeStatus) {
        this.resetSession();
        this.checkCloseWebsiteStatus();
        return;
      }
      this.showError({
        content:
          Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.something_went_wrong")
            : response.message
      });
    },

    checkCloseWebsiteStatus() {
      if (this.countdownTimeStatus) {
        this.showModalCloseWebsiteCountdown();
        return;
      }

      if (this.closeStatus) {
        this.showModalCloseWebsite();
      }
    },

    async chooseCompany() {
      return await CustomerService.chooseCompany(
        this.customerId,
        Configuration.value("VUE_APP_COMPANY_ID"),
        {
          showModalResponseCodeError: false,
          showModalResponseError: false
        }
      );
    },

    async getActiveLoan() {
      return await LoanService.getActiveLoan(this.customerId, this.coreToken, {
        showModalResponseCodeError: false,
        showModalResponseError: false
      });
    },

    /**
     * Redirect to current page
     *
     */
    async redirectToCurrentPage(userInfo) {
      let currentPlUIStatus = userInfo.result.personalData.paydayLoanStatus;
      await this.setCustomerStatus(currentPlUIStatus);

      if (!this.coreToken) {
        return this.redirectToNoLoanYetPage(currentPlUIStatus);
      }

      const activeLoanData = await this.getActiveLoan();

      if (
        activeLoanData.responseCode !== 200 &&
        _.isEmpty(activeLoanData.result)
      ) {
        return this.redirectToNoLoanYetPage(currentPlUIStatus);
      }

      if (
        activeLoanData.result.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
        (this.countdownTimeStatus || this.closeStatus)
      ) {
        this.resetSession();
        this.checkCloseWebsiteStatus();
        return;
      }

      return this.redirectToCurrentLoanPage(activeLoanData);
    },

    redirectToCurrentLoanPage(activeLoanData) {
      this.setHasActiveLoan(true);
      this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE);
      return this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status: formatSlug(
            activeLoanData.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
          )
        }
      });
    },

    redirectToNoLoanYetPage(currentPlUIStatus) {
      if (this.countdownTimeStatus) {
        this.showModalCloseWebsiteCountdown();
        this.resetSession();
        return;
      }

      if (this.closeStatus) {
        this.showModalCloseWebsite();
        this.resetSession();
        return;
      }

      return this.$router.push({
        name: currentPlUIStatus
          ? PAYDAY_LOAN_STATUS_PAGE[currentPlUIStatus]
          : PAYDAY_LOAN_STATUS_PAGE.NOT_COMPLETE_EKYC_YET
      });
    },

    showModalCloseWebsite() {
      this.resetSession();
      this.openCloseWebsiteModal({
        title: this.$i18n.t("common.notification"),
        content: this.$i18n.t("payday_loan.close_website", {
          open_date: this.openDateText,
          from_date: PL_VALUE_DEFAULT.OPEN_DATE,
          to_date: PL_VALUE_DEFAULT.CLOSE_DATE
        }),
        btnText: this.$i18n.t("payday_loan.more_info"),
        btnLink: Configuration.value("VUE_APP_ZALO_URL")
      });
    },

    showModalCloseWebsiteCountdown() {
      this.resetSession();
      this.openCloseWebsiteModal({
        title: this.$i18n.t("common.notification"),
        content: this.$i18n.t("payday_loan.open_website_count_down", {
          open_date: this.openDateCountdownText
        }),
        btnText: this.$i18n.t("payday_loan.more_info"),
        btnLink: Configuration.value("VUE_APP_ZALO_URL")
      });
    },

    /**
     * Rest sign in core
     * @param params
     * @returns {Promise<void>}
     */
    async restSignInCore(params) {
      const stepOneData = await CoreService.restApiLogin({
        username: params.mobile,
        password: params.password
      });
      if (stepOneData && stepOneData.code === 200 && stepOneData.result) {
        this.setCoreToken(stepOneData.result.access_token);
      }
      return stepOneData;
    },

    /**
     * Get customer info
     * @param id
     * @returns {Promise<*>}
     */
    async getDetailCustomer(id) {
      return await CustomerService.getById(id);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
