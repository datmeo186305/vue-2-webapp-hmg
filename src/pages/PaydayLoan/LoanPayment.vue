<template>
  <div id="loan-payment-page" class="container-fluid">
    <div class="container loan-payment-container pl-padding-bottom-default">
      <div class="payday-loan-container">
        <!-- Detail -->
        <detail-loan-payment
          :current-loan="currentLoan"
          @finalization="finalization"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { LoanService } from "../../services/paydayLoan/loan.service";
import { PAYDAY_LOAN_STATUS } from "../../helpers/constants";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import formatSlug from "@/core/utils/format-slug";
import DetailLoanPayment from "./components/DetailLoanPayment";
import { PaymentService } from "../../services/paydayLoan/payment.service";
import moment from "moment";
import Configuration from "@/helpers/configuration";

export default {
  name: "LoanPayment",
  components: { DetailLoanPayment },
  data() {
    return {
      currentLoan: {
        loanId: null,
        loanCode: null,
        repaymentListId: null,
        latePenaltyPayment: 0,
        totalServiceFees: 0,
        expectedAmount: 0,
        loanStatus: null,
        repaymentStatus: null,
        getSalaryAt: null,
        paidAmount: 0,
        expectedTenure: 0
      },
      userInfo: {
        email: null,
        coreUserId: null,
        phoneNumber: null,
        firstNameTNG: null,
        lastNameTNG: null
      }
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus"
    })
  },
  created() {
    this.setTopNavigationTitle(this.$route.meta.title);
  },
  mounted() {
    this.setDisplayProgressBar(false);
    this.setDisplayTopNavigation(true);
    this.setCurrentPage("PlLoanPayment");
    this.getUserInfo();
    this.getActiveLoan();
  },
  methods: {
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setTopNavigationTitle: "paydayLoan/SET_TOP_NAV_TITLE"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan"
    }),
    async getRepaymentList() {
      const response = await PaymentService.getRepaymentList(
        {
          customerId: this.customerId,
          loanId: this.currentLoan.loanId
        },
        { showModalResponseError: false, showModalResponseCodeError: false }
      );

      if (!response || response.responseCode !== 200) {
        return;
      }
      let paidAmount = 0;
      for (let i = 0; i < response.result.length; i++) {
        paidAmount += response.result[i].amount;
      }

      this.currentLoan.paidAmount = paidAmount;
    },
    async getActiveLoan() {
      const response = await LoanService.getActiveLoan(
        this.customerId,
        this.coreToken,
        { showModalResponseCodeError: false }
      );
      if (response.errorCode) {
        return this.handleGetActiveLoanError(response);
      }
      if (response.responseCode == 200) {
        let loanInfo = response.result;
        this.currentLoan = {
          ...this.currentLoan,
          loanId: loanInfo.id,
          loanCode: loanInfo.loanCode,
          expectedAmount: loanInfo.expectedAmount || 0,
          totalServiceFees: loanInfo.totalServiceFees || 0,
          latePenaltyPayment: loanInfo.latePenaltyPayment || 0,
          expectedTenure: loanInfo.expectedTenure || 0,
          loanStatus: loanInfo.status,
          repaymentStatus: loanInfo.repaymentStatus,
          createdAt: loanInfo.createdAt
        };
        this.disabledBtn =
          this.currentLoan.loanStatus !== PAYDAY_LOAN_STATUS.IN_REPAYMENT;
        if (this.currentLoan.loanStatus !== PAYDAY_LOAN_STATUS.IN_REPAYMENT) {
          return await this.$router.push({
            name: "PlCurrentLoan",
            params: {
              status: formatSlug(
                this.currentLoan.loanStatus || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              )
            }
          });
        }
        await this.getRepaymentList();
      }
    },

    formatGetSalaryDate(value) {
      return value
        ? moment(new Date(value), "DD/MM/YYYY HH:mm:ss")
            .add(1, "day")
            .format("DD/MM/YYYY HH:mm:ss")
        : "N/A";
    },

    async getUserInfo() {
      const response = await CustomerService.getById(this.customerId);

      if (response.responseCode == 200) {
        let info = response.result;
        this.userInfo = {
          ...this.userInfo,
          email: info.personalData.identityNumberSix,
          phoneNumber: info.personalData.mobileNumber,
          coreUserId: info.personalData.coreUserId,
          firstNameTNG: info.tngData.ten,
          lastNameTNG: info.tngData.hoDem
        };
      }
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
    },
    finalization() {
      this.$router.push({ name: "PlChoosePaymentMethod" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-loan-payment";
</style>
