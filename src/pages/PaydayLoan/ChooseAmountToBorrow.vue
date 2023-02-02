<template>
  <div class="container-fluid">
    <div class="container-fluid pl-space-between-box">
      <div
        class="container choose-amount-to-borrow-container pl-padding-bottom-default"
      >
        <div class="payday-loan-container">
          <pl-choose-amount-to-borrow-form
            @submit="submit"
            @showExample="showExample"
            @resetChosenVoucher="resetChosenVoucher"
            :customer-info="customerInfo"
            :chosenVoucher="chosenVoucher"
          />
        </div>
      </div>
    </div>
    <!--  Modals -->
    <PlSuccessModal
      :title="$t('payday_loan.choose_amount.choose_amount_successful')"
      :content="
        $t('payday_loan.choose_amount.choose_amount_successful_content')
      "
      :btn-text="$t('payday_loan.choose_amount.back_to_home')"
      @click="closeSuccessModal"
    />
    <PlFailedModal />

    <PlCollateralDocumentExampleModal />

    <!--  Modals guide sign contract -->
    <PlChooseVoucherModal @applyVoucher="chooseVoucher" />
  </div>
</template>

<script>
import {
  DOCUMENT_TYPE,
  MODAL_TYPE,
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_STATUS_PAGE,
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_UI_STATUS
} from "../../helpers/constants";
import { mapGetters, mapMutations } from "vuex";
import PlChooseAmountToBorrowForm from "../../components/Forms/PlChooseAmountToBorrowForm";
import PlSuccessModal from "../../components/Modals/PlSuccessModal";
import { ComService } from "../../services/paydayLoan/com.service";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { LoanService } from "../../services/paydayLoan/loan.service";
import _ from "lodash";
import PlFailedModal from "../../components/Modals/PlFailedModal";
import PlCollateralDocumentExampleModal from "../../components/Modals/PlCollateralDocumentExampleModal";
import PlChooseVoucherModal from "../../components/Modals/PlChooseVoucherModal";
import formatSlug from "@/core/utils/format-slug";
import * as Sentry from "@sentry/browser";

export default {
  name: "ChooseAmountToBorrow",
  components: {
    PlChooseVoucherModal,
    PlCollateralDocumentExampleModal,
    PlFailedModal,
    PlSuccessModal,
    PlChooseAmountToBorrowForm
  },
  data() {
    return {
      currentLoan: {},
      customerInfo: {},
      originCustomerInfo: {},
      params: {},
      chosenVoucher: null
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      customerMobile: "customer/currentCustomerMobile",
      coreToken: "auth/getCoreToken",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setCurrentStep(PAYDAY_LOAN_STEP.CHOOSE_AMOUNT_TO_BORROW);
    this.setDisplayProgressBar(true);
    this.setDisplayTopNavigation(true);
    this.setCurrentPage("PlChooseAmountToBorrow");
    this.resetChooseAmountSuccess();
    if (this.currentCloseWebsiteStatus || this.currentCountdownTimerStatus) {
      return;
    }
    this.getCustomerInfo();
  },
  beforeDestroy() {
    this.destroyModal();
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      setHasActiveLoan: "paydayLoan/SET_HAS_ACTIVE_LOAN",
      setChooseAmountSuccess: "paydayLoan/SET_CHOOSE_AMOUNT_SUCCESS",
      resetChooseAmountSuccess: "paydayLoan/RESET_CHOOSE_AMOUNT_SUCCESS"
    }),
    chooseVoucher(value) {
      this.chosenVoucher = value;
    },
    resetChosenVoucher() {
      this.chosenVoucher = null;
    },
    showExample() {
      this.showModal({ type: MODAL_TYPE.PL_COLLATERAL_DOCUMENT_EXAMPLE });
    },
    async submit(params) {
      this.params = params;
      this.showLoading({
        content: {
          title: this.$t("payday_loan.in_progress"),
          content: this.$t("payday_loan.wait_a_minute")
        }
      });

      await this.uploadCollateralDocument(params.collateralDocument);

      const loanData = await this.createNewLoan();
      if (!loanData || !loanData.responseCode || loanData.responseCode != 200) {
        this.hideLoading();
        return;
      }

      this.setChooseAmountSuccess(true);
      this.setHasActiveLoan(true);
      this.showModal({ type: MODAL_TYPE.PL_SUCCESS });
      this.hideLoading();
    },

    async uploadCollateralDocument(collateralDocument) {
      if (collateralDocument && collateralDocument instanceof File) {
        await this.uploadDocument(collateralDocument);
        return;
      }

      //Update old img to upload document in core

      let fileExtension = this.getUrlExtension(
        this.originCustomerInfo.collateralDocument
      );

      let fileName =
        "collateral-document-" + this.customerId + "." + fileExtension;

      await this.urltoFile(collateralDocument, fileName, fileExtension).then(
        file => {
          this.uploadDocument(file);
        }
      );
    },

    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType });
        })
        .catch(e => {
          Sentry.captureException(e);
        });
    },

    getUrlExtension(url) {
      if (!url) return "";
      return url
        .split(/[#?]/)[0]
        .split(".")
        .pop()
        .trim();
    },

    async createNewLoan() {
      return await LoanService.createLoan(
        {
          coreToken: this.coreToken,
          mobile: this.customerMobile,
          purpose: this.params.purpose,
          customerId: this.customerId,
          expectedAmount: this.params.amount,
          voucherTransactionId: this.params.voucherTransactionId
        },
        {
          showLoader: false,
          otherLoader: true,
          showModalResponseError: false,
          showModalResponseCodeError: false
        }
      );
    },

    async getActiveLoan() {
      const response = await LoanService.getActiveLoan(
        this.customerId,
        this.coreToken,
        {
          showModalResponseCodeError: false
        }
      );
      if (response.responseCode == 200 && !_.isEmpty(response.result)) {
        await this.$router.push({
          name: "PlCurrentLoan",
          params: {
            status: formatSlug(
              response.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            )
          }
        });
      }
    },

    async uploadDocument(image) {
      let imageInfo = await ComService.uploadSingleFile(
        {
          document_type: DOCUMENT_TYPE.VEHICLE_REGISTRATION,
          file: image,
          customerId: this.customerId
        },
        { showLoader: false, otherLoader: true }
      );
      if (!imageInfo || !imageInfo.result) return null;
      return imageInfo.result.documentPath;
    },

    closeSuccessModal() {
      this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status: formatSlug(PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING)
        }
      });
    },

    async getCustomerInfo() {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: false
      });
      if (response.responseCode != 200) {
        return;
      }

      this.customerInfo = response.result.personalData;

      if (
        this.customerInfo.paydayLoanStatus !==
        PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE
      ) {
        this.setCustomerStatus(this.customerInfo.paydayLoanStatus);
        if (
          this.customerInfo.paydayLoanStatus ===
          PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET
        ) {
          await this.$router.push({
            name: PAYDAY_LOAN_STATUS_PAGE[this.customerInfo.paydayLoanStatus]
          });
        }
        return;
      }

      await this.getActiveLoan();

      this.originCustomerInfo = JSON.parse(
        JSON.stringify(response.result.personalData)
      );
      if (
        this.customerInfo &&
        !_.isEmpty(this.customerInfo.collateralDocument)
      ) {
        this.customerInfo.collateralDocument = await ComService.downloadSingleFile(
          this.customerId,
          this.customerInfo.collateralDocument
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
</style>
