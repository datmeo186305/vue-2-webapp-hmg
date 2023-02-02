<template>
  <div class="container-fluid">
    <div
      class="container additional-information-container pl-padding-bottom-default"
    >
      <div class="payday-loan-container">
        <div class="additional-information-content pl-space-between-box">
          <pl-additional-document-form
            @submit="submitForm"
            :customerInfo="customerInfo"
            @showExample="showExample"
          />
        </div>
      </div>
    </div>
    <PlCollateralDocumentExampleModal />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { LoanService } from "../../services/paydayLoan/loan.service";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import PlAdditionalDocumentForm from "../../components/Forms/PlAdditionalDocumentForm";
import PlCollateralDocumentExampleModal from "../../components/Modals/PlCollateralDocumentExampleModal";
import {
  DOCUMENT_TYPE,
  MODAL_TYPE,
  PAYDAY_LOAN_STATUS
} from "../../helpers/constants";
import _ from "lodash";
import { ComService } from "../../services/paydayLoan/com.service";
import formatSlug from "@/core/utils/format-slug";
import Configuration from "@/helpers/configuration";

export default {
  name: "LoanPayment",
  components: { PlCollateralDocumentExampleModal, PlAdditionalDocumentForm },
  data() {
    return {
      disabledBtn: false,
      customerInfo: {
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null,
        collateralDocument: null
      },
      originCustomerInfo: {},
      currentLoan: {}
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setDisplayProgressBar(false);
    this.setDisplayTopNavigation(true);
    if (this.currentCloseWebsiteStatus || this.currentCountdownTimerStatus) {
      return;
    }
    this.getActiveLoan();
    this.getUserInfo();
  },
  methods: {
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      showModal: "modal/SHOW_MODAL",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING"
    }),
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    async submitForm(params) {
      this.showLoading({
        content: {
          title: this.$t("payday_loan.in_progress"),
          content: this.$t("payday_loan.wait_a_minute")
        }
      });
      await this.updateDocument(params);
      await this.hideLoading();
      await this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status:
              formatSlug(
                  this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              )
        }
      });
    },
    async updateDocument(params) {
      let salary1DocumentPath = this.originCustomerInfo.salaryDocument1;
      let salary2DocumentPath = this.originCustomerInfo.salaryDocument2;
      let salary3DocumentPath = this.originCustomerInfo.salaryDocument3;
      let collateralDocument = this.originCustomerInfo.collateralDocument;

      if (params.salaryDocument1 && params.salaryDocument1 instanceof File) {
        salary1DocumentPath = await this.uploadDocument(
          params.salaryDocument1,
          DOCUMENT_TYPE.SALARY_INFORMATION_ONE
        );
      }

      if (params.salaryDocument2 && params.salaryDocument2 instanceof File) {
        salary2DocumentPath = await this.uploadDocument(
          params.salaryDocument2,
          DOCUMENT_TYPE.SALARY_INFORMATION_TWO
        );
      }

      if (params.salaryDocument3 && params.salaryDocument3 instanceof File) {
        salary3DocumentPath = await this.uploadDocument(
          params.salaryDocument3,
          DOCUMENT_TYPE.SALARY_INFORMATION_THREE
        );
      }

      if (
        params.collateralDocument &&
        params.collateralDocument instanceof File
      ) {
        collateralDocument = await this.uploadDocument(
          params.collateralDocument,
          DOCUMENT_TYPE.VEHICLE_REGISTRATION
        );
      }

      return {
        "personalData.salaryDocument1": salary1DocumentPath,
        "personalData.salaryDocument2": salary2DocumentPath,
        "personalData.salaryDocument3": salary3DocumentPath,
        "personalData.collateralDocument": collateralDocument
      };
    },
    showExample() {
      this.showModal({ type: MODAL_TYPE.PL_COLLATERAL_DOCUMENT_EXAMPLE });
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
      if (
        !response.result ||
        response.result.status !== PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
      ) {
        await this.$router.push({
          name: "PlCurrentLoan",
          params: {
            status:
              formatSlug(
                response.result
                  ? response.result.status
                  : PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              )
          }
        });
      }
      this.currentLoan = response.result;
    },
    async getUserInfo() {
      const response = await CustomerService.getById(this.customerId);

      if (response.responseCode == 200) {
        let customerInfo = response.result.personalData;
        if (!customerInfo) return;
        this.originCustomerInfo = JSON.parse(
          JSON.stringify(response.result.personalData)
        );
        if (!_.isEmpty(customerInfo.salaryDocument1)) {
          customerInfo.salaryDocument1 = await ComService.downloadSingleFile(
            this.customerId,
            customerInfo.salaryDocument1
          );
        }

        if (!_.isEmpty(customerInfo.salaryDocument2)) {
          customerInfo.salaryDocument2 = await ComService.downloadSingleFile(
            this.customerId,
            customerInfo.salaryDocument2
          );
        }

        if (!_.isEmpty(customerInfo.salaryDocument3)) {
          customerInfo.salaryDocument3 = await ComService.downloadSingleFile(
            this.customerId,
            customerInfo.salaryDocument3
          );
        }

        if (!_.isEmpty(customerInfo.collateralDocument)) {
          customerInfo.collateralDocument = await ComService.downloadSingleFile(
            this.customerId,
            customerInfo.collateralDocument
          );
        }

        this.customerInfo = customerInfo;
      }
    },
    async uploadDocument(salaryDocument, type) {
      let documentInfo = await ComService.uploadSingleFile(
        {
          document_type: type,
          file: salaryDocument,
          customerId: this.customerId
        },
        { showLoader: false, otherLoader: true }
      );
      if (!documentInfo || !documentInfo.result) return null;
      return documentInfo.result.documentPath;
    },
    handleGetActiveLoanError(response) {
      if (response.errorCode === "DO_NOT_ACTIVE_LOAN_ERROR") {
        this.createNewPaydayLoan();
        return;
      }

      this.showError({
        title:
          Configuration.value('VUE_APP_PRODUCTION') === "true"
            ? this.$t("common.error")
            : response.errorCode,
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : Configuration.value('VUE_APP_PRODUCTION') === "true"
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

@media (max-width: 768px) {
  #payday-loan-layout-container #loan-payment-page .payday-loan-container {
    padding: 0;
  }
}
</style>
