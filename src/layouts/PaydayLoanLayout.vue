<template>
  <div id="payday-loan-layout-container">
    <top-navbar />

    <!-- Content -->
    <div id="pl-main">
      <fade-transition :duration="200" mode="out-in">
        <router-view />
      </fade-transition>
    </div>

    <chat-box />

    <pl-loading />
    <pl-error-modal />
    <pl-success-notification-modal />
    <pl-waiting-modal />
    <pl-rating @click="submitRating" />
    <!--    <pl-ads-modal />-->
  </div>
</template>
<script>
import TopNavbar from "./Headers/PaydayLoanHeader.vue";
import { FadeTransition } from "vue2-transitions";
import PlErrorModal from "@/components/Modals/PlErrorModal";
import { mapActions, mapGetters, mapMutations } from "vuex";
import PlLoading from "@/components/Loading/PlLoading";
import PlWaitingModal from "@/components/Modals/PlWaitingModal";
import { LoanService } from "@/services/paydayLoan/loan.service";
import { PAYDAY_LOAN_UI_STATUS, PL_VALUE_DEFAULT } from "@/helpers/constants";
import _ from "lodash";
import moment from "moment";
import ChatBox from "../pages/PaydayLoan/components/ChatBox";
import { Datetime } from "vue-datetime";
// import vSelect from "vue-select";
import Vue from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Configuration from "../helpers/configuration";
import PlRating from "../components/Modals/PlRating";
import PlSuccessNotificationModal from "../components/Modals/PlSuccessNotificationModal";
import { MODAL_TYPE, PAYDAY_LOAN_STATUS } from "../helpers/constants";

export default {
  components: {
    PlSuccessNotificationModal,
    PlRating,
    ChatBox,
    PlWaitingModal,
    PlLoading,
    TopNavbar,
    FadeTransition,
    PlErrorModal
  },
  data() {
    return {
      loaderTimeout: null,
      currentDate: new Date(),
      openDate: null,
      closeDate: null,
      closeStatus: false,
      countdownTimeStatus: false,
      countdownTime: PL_VALUE_DEFAULT.COUNTDOWN_TIME,
      countdownStartTime: PL_VALUE_DEFAULT.COUNTDOWN_START_TIME,
      currentLoanInfo: {}
    };
  },
  computed: {
    ...mapGetters({
      isShowLoading: "loading/isShowLoading",
      coreToken: "auth/getCoreToken",
      customerId: "customer/currentCustomerId",
      currentCustomerMobile: "customer/currentCustomerMobile",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus",
      currentPage: "paydayLoan/currentPage",
      rateInfo: "customer/currentRateInfo"
    }),
    openDateText() {
      return this.openDate
        ? moment(new Date(this.openDate), "DD/MM/YYYY").format("DD/MM")
        : null;
    },
    openDateCountdownText() {
      return this.formatCountdownTime(this.countdownTime);
    },
    closeDateCountdownText() {
      return this.formatCountdownTime(this.countdownStartTime);
    }
  },
  watch: {
    isShowLoading: {
      handler: function(newVal) {
        if (newVal) {
          this.loaderTimeout = setTimeout(() => {
            this.hideLoading();
          }, 60000);
        } else {
          clearTimeout(this.loaderTimeout);
        }
      },
      immediate: true
    },
    rateInfo: {
      handler: function(newVal) {
        if (newVal && !newVal.isRated) {
          setTimeout(() => {
            this.openRatingModal();
          }, 100);
        }
      },
      immediate: true
    },
    "$route.name": {
      handler: function(newVal) {
        this.checkValidUserWhenWebsiteIsClose(newVal);
      },
      deep: true,
      immediate: true
    },
    currentCustomerMobile() {
      // this.initCloseWebsiteStatus();
      this.initCountdownStatus();
    }
  },
  created() {
    Vue.component("VueDatetime", Datetime);
    // Vue.component("v-select", vSelect);
    Vue.component("ValidationProvider", ValidationProvider);
    Vue.component("ValidationObserver", ValidationObserver);
  },
  mounted() {
    this.hideLoading();
    // this.initCloseWebsiteStatus();
    this.initCountdownStatus();
    this.fetchPaydayLoanStatusInfo();
  },
  methods: {
    ...mapActions({
      fetchCustomerStatus: "paydayLoan/fetchCurrentCustomerStatus",
      openCloseWebsiteModal: "modal/openCloseWebsiteModal",
      openRatingModal: "modal/openRatingModal"
    }),
    ...mapMutations({
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      resetCustomerStatus: "paydayLoan/RESET_CUSTOMER_STATUS",
      resetPaymentStatus: "paydayLoan/RESET_PAYMENT_STATUS",
      resetHasActiveLoan: "paydayLoan/RESET_HAS_ACTIVE_LOAN",
      resetCustomerInfo: "customer/RESET_CUSTOMER_INFO",
      destroyAuth: "auth/DESTROY_AUTH",
      setCloseWebsiteStatus: "paydayLoan/SET_CLOSE_WEBSITE_STATUS",
      setCountdownTimerStatus: "paydayLoan/SET_COUNTDOWN_TIMER_STATUS",
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      setHasActiveLoan: "paydayLoan/SET_HAS_ACTIVE_LOAN",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS"
    }),
    initCountdownStatus() {
      this.countdownTimeStatus =
        new Date(this.countdownTime).getTime() > new Date().getTime() &&
        new Date(this.countdownStartTime).getTime() < new Date().getTime() &&
        Configuration.value("VUE_APP_PRODUCTION") === "true";

      if (this.currentCustomerMobile) {
        if (
          PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(
            this.currentCustomerMobile
          )
        ) {
          this.countdownTimeStatus = false;
        }
      }
      this.setCountdownTimerStatus(this.countdownTimeStatus);
    },

    // initCloseWebsiteStatus() {
    //   this.closeDate = new Date(
    //     this.currentDate.getFullYear(),
    //     this.currentDate.getMonth(),
    //     PL_VALUE_DEFAULT.CLOSE_DATE
    //   );
    //
    //   this.openDate = new Date(
    //     this.currentDate.getFullYear(),
    //     this.currentDate.getMonth(),
    //     PL_VALUE_DEFAULT.OPEN_DATE
    //   );
    //
    //   this.closeStatus =
    //     this.currentDate >= this.closeDate &&
    //     this.currentDate <= this.openDate &&
    //     Configuration.value("VUE_APP_PRODUCTION") === "true";
    //
    //   if (this.currentCustomerMobile) {
    //     if (
    //       PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(
    //         this.currentCustomerMobile
    //       )
    //     ) {
    //       this.closeStatus = false;
    //     }
    //   }
    //   this.setCloseWebsiteStatus(this.closeStatus);
    // },

    async fetchPaydayLoanStatusInfo() {
      if (Configuration.value("VUE_APP_MAINTAIN") === "true") {
        this.showModalMaintainWebsite();
        return;
      }

      this.fetchCustomerStatus();

      this.currentLoanInfo = await this.getActiveLoan();

      if (this.closeStatus || this.countdownTimeStatus) {
        return this.checkValidUserWhenWebsiteIsClose(this.currentPage);
      }

      if (
        !this.currentLoanInfo ||
        this.currentLoanInfo.responseCode !== 200 ||
        _.isEmpty(this.currentLoanInfo.result)
      ) {
        return;
      }

      this.setHasActiveLoan(true);
      this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE);
    },

    async checkValidUserWhenWebsiteIsClose(routerName) {
      if (
        !routerName ||
        routerName === "PlSignIn" ||
        routerName === "PaydayLoanIndex" ||
        routerName === "PlPaymentResult" ||
        routerName === "PlForgotPassword" ||
        routerName === "PlSignUp" ||
        routerName === "PlSignUpSuccess"
      ) {
        return;
      }

      if (
        !this.currentLoanInfo ||
        this.currentLoanInfo.responseCode !== 200 ||
        _.isEmpty(this.currentLoanInfo.result) ||
        this.currentLoanInfo.result.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT
      ) {
        this.checkCloseWebsiteStatus();
      }
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

    async getActiveLoan() {
      if (!this.coreToken) {
        return;
      }
      return await LoanService.getActiveLoan(this.customerId, this.coreToken, {
        showModalResponseCodeError: false,
        showModalResponseError: false
      });
    },

    showModalMaintainWebsite() {
      this.openCloseWebsiteModal({
        title: this.$i18n.t("common.notification"),
        content: this.$i18n.t("common.maintain_text"),
        btnText: this.$i18n.t("payday_loan.more_info"),
        btnLink: Configuration.value("VUE_APP_ZALO_URL")
      });
    },

    showModalCloseWebsiteCountdown() {
      this.$router.push({ name: "PlSignIn" });
      this.openCloseWebsiteModal({
        title: this.$i18n.t("common.notification"),
        content: this.$i18n.t("payday_loan.open_website_count_down", {
          open_date: this.openDateCountdownText
        }),
        btnText: this.$i18n.t("payday_loan.more_info"),
        btnLink: Configuration.value("VUE_APP_ZALO_URL")
      });
    },

    showModalCloseWebsite() {
      this.$router.push({ name: "PlSignIn" });
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

    formatCountdownTime(date) {
      return date
        ? moment(date, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
        : null;
    },

    submitRating() {
      this.showModal({
        type: MODAL_TYPE.PL_SUCCESS_NOTIFICATION,
        content: {
          title: this.$t("payday_loan.rating.sent_rating"),
          content: this.$t("payday_loan.rating.tks_for_rating"),
          btnText: this.$t("common.confirm")
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
</style>
