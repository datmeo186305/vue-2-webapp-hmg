<template>
  <div id="loan-payment-page" class="container-fluid">
    <div class="container loan-payment-container pl-padding-bottom-default">
      <div class="payday-loan-container">
        <h2 id="choose-payment-method-title">
          {{ $t("payday_loan.choose_payment_method.choose_method") }}
        </h2>

        <!-- Switch tab -->
        <switch-tab-payment-method
          :active-tab="activeTab"
          @switchTab="switchTab"
        />

        <!-- Card payment method -->
        <card-payment
          :current-loan="currentLoan"
          :user-info="userInfo"
          :disabled-card-payment="disabledCardPayment"
          @displayConfirmFinalizationModal="displayConfirmFinalizationModal"
          v-show="activeTab === activeTabs.CARD"
        />

        <!--  Transfer payment method -->
        <transfer-payment
          :current-loan="currentLoan"
          :user-info="userInfo"
          :va-info="vaInfo"
          v-show="activeTab === activeTabs.TRANSFER"
          @displayCopied="displayCopied"
        />
      </div>
    </div>
    <transition name="fade">
      <div class="pl-copied-box" v-show="showCopied">
        <div class="pl-copied">
          {{ $t("payday_loan.choose_payment_method.copied") }}
        </div>
      </div>
    </transition>

    <pl-confirm-finalization-modal @confirm="confirmFinalization" />
  </div>
</template>
<script>
import CardPayment from "./components/CardPayment";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { LoanService } from "../../services/paydayLoan/loan.service";
import {
  ERROR_CODE,
  MODAL_TYPE,
  PAYDAY_LOAN_STATUS
} from "../../helpers/constants";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import formatSlug from "@/core/utils/format-slug";
import SwitchTabPaymentMethod from "./components/SwitchTabPaymentMethod";
import TransferPayment from "./components/TransferPayment";
import { PaymentService } from "../../services/paydayLoan/payment.service";
import changeAlias from "@/core/utils/no-accent-vietnamese";
import PlConfirmFinalizationModal from "../../components/Modals/PlConfirmFinalizationModal";
import Configuration from "@/helpers/configuration";

export default {
  name: "ChoosePaymentMethod",
  components: {
    PlConfirmFinalizationModal,
    TransferPayment,
    SwitchTabPaymentMethod,
    CardPayment
  },
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
        paidAmount: 0
      },
      userInfo: {
        email: null,
        firstName: null,
        phoneNumber: null
      },
      activeTab: "TRANSFER",
      activeTabs: {
        CARD: "CARD",
        TRANSFER: "TRANSFER"
      },
      vaInfo: {
        accountNumber: null,
        accountName: null,
        bankCode: null
      },
      showCopied: false,
      disabledCardPayment: false
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
    this.setCurrentPage("PlChoosePaymentMethod");
    this.initInfoPayment();
  },
  methods: {
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setTopNavigationTitle: "paydayLoan/SET_TOP_NAV_TITLE",
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan"
    }),

    async initInfoPayment() {
      this.showLoading({
        content: {
          title: this.$t("payday_loan.in_progress"),
          content: this.$t("payday_loan.wait_a_minute")
        }
      });
      await this.getActiveLoan(false, true);
      await this.initInfoVA(false, true);
      setTimeout(() => {
        this.hideLoading();
      }, 1000);
    },

    async initInfoVA(showLoading = true, otherLoader = false) {
      const userInfo = await this.getUserInfo(showLoading, otherLoader);
      if (!userInfo) return;

      await this.getVirtualAccount(showLoading, otherLoader);
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
          loanStatus: loanInfo.status,
          repaymentStatus: loanInfo.repaymentStatus
        };
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
    async getUserInfo(showLoading = true, otherLoader = false) {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: showLoading,
        otherLoader: otherLoader
      });

      if (response.responseCode == 200) {
        let info = response.result;
        this.userInfo = {
          email: info.personalData.identityNumberSix,
          phoneNumber: info.personalData.mobileNumber,
          firstName: info.personalData.firstName
        };
        return info;
      }
      return null;
    },
    displayConfirmFinalizationModal() {
      this.showModal({ type: MODAL_TYPE.PL_CONFIRM_FINALIZATION });
    },
    confirmFinalization() {
      this.disabledCardPayment = true;
      this.finalization();
    },
    async finalization() {
      const response = await PaymentService.initRepaymentGpay(
        this.customerId,
        this.currentLoan.loanId,
        this.currentLoan.loanCode
      );
      if (!response || !response.result || !response.result.order_url) return;
      window.location.href = response.result.order_url;
    },
    async getRepaymentList(showLoading = true, otherLoader = false) {
      const response = await PaymentService.getRepaymentList(
        {
          customerId: this.customerId,
          loanId: this.currentLoan.loanId
        },
        {
          showModalResponseError: false,
          showModalResponseCodeError: false,
          showLoader: showLoading,
          otherLoader: otherLoader
        }
      );

      if (response.responseCode == 200) {
        let paidAmount = 0;
        for (let i = 0; i < response.result.length; i++) {
          paidAmount += response.result[i].amount;
        }

        this.currentLoan.paidAmount = paidAmount;
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
    switchTab(activeTab) {
      this.activeTab = activeTab;
    },
    displayCopied() {
      this.showCopied = true;
      setTimeout(() => {
        this.showCopied = false;
      }, 3000);
    },
    async createVirtualAccount(
      customerId,
      accountName,
      showLoading = true,
      otherLoader = false
    ) {
      const response = await PaymentService.createVA(
        {
          customerId: customerId,
          accountName: changeAlias(accountName)
        },
        { showLoader: showLoading, otherLoader: otherLoader }
      );
      if (!response || response.responseCode !== 200) return null;
      return response.result;
    },
    async getVirtualAccount(showLoading = true, otherLoader = false) {
      const response = await PaymentService.getVA(
        {
          customerId: this.customerId
        },
        {
          showModalResponseError: false,
          showModalResponseCodeError: false,
          showLoader: showLoading,
          otherLoader: otherLoader
        }
      );
      if (!response) {
        return null;
      }
      if (response.result && response.responseCode === 200) {
        this.vaInfo = {
          accountNumber: response.result.accountNumber,
          accountName: response.result.accountName,
          bankCode: response.result.bankCode
        };
        return response.result;
      }

      if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
        const newVaInfo = await this.createVirtualAccount(
          this.customerId,
          this.userInfo.firstName,
          showLoading,
          otherLoader
        );
        this.vaInfo = {
          accountNumber: newVaInfo.accountNumber,
          accountName: newVaInfo.accountName,
          bankCode: newVaInfo.bankCode
        };
        return this.vaInfo;
      }

      return null;
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-choose-payment-methods";
</style>
