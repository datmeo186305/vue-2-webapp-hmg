<template>
  <div id="current-loan-container" class="container-fluid">
    <salary24h-introduce />
    <div
      class="container current-loan-info-container pl-padding-bottom-with-provider"
    >
      <div class="payday-loan-container">
        <pl-current-loan-detail-info
          class="pl-space-between-box"
          :current-loan="currentLoan"
          :user-info="userInfo"
          :contract-info="contractInfo"
          @viewContract="viewContract"
          @finalization="finalization"
        />
        <pl-current-loan-user-info
          :user-info="userInfo"
          class="pl-space-between-box"
        />
      </div>
    </div>
    <div id="pl-provider-info-container" class="container-fluid">
      <div class="container">
        <div class="payday-loan-container">
          <p
            class="pl-provider-info"
            v-html="$t('payday_loan.provider_info')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Salary24hIntroduce from "./components/Salary24hIntroduce";
import { mapActions, mapGetters, mapMutations } from "vuex";
import PlCurrentLoanDetailInfo from "./components/CurrentLoanDetailInfo";
import PlCurrentLoanUserInfo from "./components/CurrentLoanUserInfo";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { LoanService } from "../../services/paydayLoan/loan.service";
import {
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS,
  PL_VALUE_DEFAULT,
  REPAYMENT_STATUS
} from "../../helpers/constants";
import formatSlug from "@/core/utils/format-slug";
import moment from "moment";
import Configuration from "@/helpers/configuration";

export default {
  name: "CurrentLoan",
  components: {
    PlCurrentLoanUserInfo,
    PlCurrentLoanDetailInfo,
    Salary24hIntroduce
  },
  data() {
    return {
      currentLoan: {
        id: null,
        expectedAmount: null,
        loanCode: null,
        disbursementDate: null,
        loanStatus: null,
        totalServiceFees: 0,
        expectedTenure: 0,
        repaymentStatus: null,
        createdAt: null
      },
      contractInfo: {
        status: null
      },
      userInfo: {
        fullName: null,
        dateOfBirth: null,
        gender: null,
        identityNumberOne: null,
        workingTime: null,
        totalSalary: null,
        email: null,
        accountReceiveSalary: null,
        bank: null,
        phoneNumber: null
      },
      currentDate: new Date(),
      openDate: null,
      closeDate: null,
      closeStatus: false,
      countdownTime: PL_VALUE_DEFAULT.COUNTDOWN_TIME,
      countdownStartTime: PL_VALUE_DEFAULT.COUNTDOWN_START_TIME,
      countdownTimeStatus: false
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      customerMobile: "customer/currentCustomerMobile",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus",
      isChooseAmountSuccess: "paydayLoan/isChooseAmountSuccess"
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
    this.initPageTitle(this.$route.params.status);
  },
  mounted() {
    this.setDisplayProgressBar(false);
    this.setDisplayTopNavigation(false);
    this.setCurrentPage("PlCurrentLoan");
    this.initInfo();
  },
  methods: {
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setPaymentStatus: "paydayLoan/SET_PAYMENT_STATUS",
      resetChooseAmountSuccess: "paydayLoan/RESET_CHOOSE_AMOUNT_SUCCESS",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      resetHasActiveLoan: "paydayLoan/RESET_HAS_ACTIVE_LOAN"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan",
      openCloseWebsiteModal: "modal/openCloseWebsiteModal"
    }),
    viewContract() {
      this.$router.push({ name: "PlSignContract" });
    },
    finalization() {
      this.$router.push({ name: "PlLoanPayment" });
    },

    initPageTitle(status) {
      let pageTitle = this.getPageTitle(status);
      window.document.title =
        pageTitle + " - " + this.$t("common.project_name");
    },

    initCountdownStatus() {
      this.countdownTimeStatus =
        new Date(this.countdownTime).getTime() > new Date().getTime() &&
        new Date(this.countdownStartTime).getTime() < new Date().getTime() &&
        Configuration.value("VUE_APP_PRODUCTION") === "true";
      if (this.customerMobile) {
        if (
          PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(
            this.customerMobile
          )
        ) {
          this.countdownTimeStatus = false;
        }
      }
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
    //   if (this.customerMobile) {
    //     if (
    //       PL_VALUE_DEFAULT.PHONE_NUMBER_WHITE_LIST_PATTERN.test(
    //         this.customerMobile
    //       )
    //     ) {
    //       this.closeStatus = false;
    //     }
    //   }
    // },

    async initInfo() {
      if (this.isChooseAmountSuccess) {
        this.showLoading({
          content: {
            title: this.$t("payday_loan.in_progress"),
            content: this.$t("payday_loan.wait_a_minute")
          }
        });
        setTimeout(async () => {
          this.hideLoading();
          this.resetChooseAmountSuccess();
          await this.getActiveLoan(false, true);
          await this.getContractCurrentLoan(false, true);
        }, 5000);
        return;
      }
      await this.getActiveLoan();
      await this.getContractCurrentLoan();
    },
    async getContractCurrentLoan(showLoading = true, otherLoader = false) {
      if (!this.currentLoan.id || !this.customerId) return;
      const response = await LoanService.getContract(
        { loanId: this.currentLoan.id, customerId: this.customerId },
        {
          showModalResponseCodeError: false,
          showLoader: showLoading,
          otherLoader: otherLoader
        }
      );
      if (response.responseCode == 200) {
        let contractInfo = response.result;
        this.contractInfo.status = contractInfo.status;
      }
    },
    async getActiveLoan(showLoading = true, otherLoader = false) {
      const response = await LoanService.getActiveLoan(
        this.customerId,
        this.coreToken,
        {
          showModalResponseCodeError: false,
          showLoader: showLoading,
          otherLoader: otherLoader
        }
      );
      if (response.errorCode) {
        this.resetHasActiveLoan();
        return this.handleGetActiveLoanError(response);
      }
      if (response.responseCode == 200) {
        let loanInfo = response.result;

        if (
          this.countdownTimeStatus &&
          loanInfo.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT
        ) {
          this.showModalCloseWebsiteCountdown();
          return;
        }

        if (
          this.currentCloseWebsiteStatus &&
          loanInfo.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT
        ) {
          this.showModalCloseWebsite();
          return;
        }
        this.currentLoan = {
          ...this.currentLoan,
          id: loanInfo.id,
          loanCode: loanInfo.loanCode,
          expectedAmount: loanInfo.expectedAmount || 0,
          loanStatus: loanInfo.status,
          totalServiceFees: loanInfo.totalServiceFees || 0,
          expectedTenure: loanInfo.expectedTenure || 0,
          repaymentStatus: loanInfo.repaymentStatus,
          createdAt: loanInfo.createdAt
        };
        this.setPaymentStatus(loanInfo.repaymentStatus);
        if (
          this.$route.params.status !==
          formatSlug(loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
        ) {
          await this.$router.replace({
            name: "PlCurrentLoan",
            params: {
              status: formatSlug(
                loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              )
            }
          });
          this.initPageTitle(
            loanInfo.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
          );
        }
      }
      await this.getUserInfo();
    },

    formatGetSalaryDate(value) {
      return value
        ? moment(new Date(value), "DD/MM/YYYY HH:mm:ss")
            .add(1, "day")
            .format("DD/MM/YYYY HH:mm:ss")
        : "N/A";
    },

    showModalCloseWebsiteCountdown() {
      this.$router.push({ name: "PaydayLoanIndex" });
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
      this.$router.push({ name: "PaydayLoanIndex" });
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
    async getUserInfo() {
      const response = await CustomerService.getById(this.customerId);

      if (response.responseCode == 200) {
        let info = response.result;
        this.userInfo = {
          ...this.userInfo,
          fullName: info.personalData.firstName,
          dateOfBirth: info.personalData.dateOfBirth,
          gender: info.personalData.gender,
          identityNumberOne: info.personalData.identityNumberOne,
          workingTime: info.personalData.borrowerEmploymentHistoryTextVariable1,
          totalSalary: info.personalData.annualIncome,
          email: info.personalData.identityNumberSix,
          phoneNumber: info.personalData.mobileNumber,
          accountReceiveSalary: info.financialData.accountNumber,
          bank: info.financialData.bankCode
        };
      }
    },
    getPageTitle(status) {
      const currentLoanStatus = this.getStatusFromSlug(status);

      if (!currentLoanStatus) {
        return this.$t(`page_title.current_loan`);
      }

      let paydayLoanStatuses = Object.values(PAYDAY_LOAN_STATUS);
      let gpayStatuses = Object.values(GPAY_RESULT_STATUS);
      let repaymentStatuses = Object.values(REPAYMENT_STATUS);

      if (paydayLoanStatuses.includes(currentLoanStatus)) {
        return this.$t(
          `payday_loan.current_loan.status.${currentLoanStatus.toLowerCase()}`
        );
      }

      if (gpayStatuses.includes(currentLoanStatus)) {
        return this.$t(
          `payday_loan.current_loan.gpay_status.${currentLoanStatus.toLowerCase()}`
        );
      }

      if (repaymentStatuses.includes(currentLoanStatus)) {
        return this.$t(
          `payday_loan.current_loan.repayment_status.${currentLoanStatus.toLowerCase()}`
        );
      }

      return this.$t(`page_title.current_loan`);
    },
    getStatusFromSlug(value) {
      return value ? value.toUpperCase()?.replace(/-/g, "_") : null;
    },
    handleGetActiveLoanError(response) {
      if (response.errorCode === "DO_NOT_ACTIVE_LOAN_ERROR") {
        this.createNewPaydayLoan();
        return;
      }

      this.showError({
        title:
          Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.error")
            : response.errorCode,
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.something_went_wrong")
            : response.message
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/variables";

#current-loan-container {
  position: relative;
  min-height: calc(100vh - 64px);
}

@media (max-width: 768px) {
  #payday-loan-layout-container
    .current-loan-info-container
    .payday-loan-container {
    padding: 0;
  }
}
</style>
