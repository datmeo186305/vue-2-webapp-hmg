<template>
  <div class="container-fluid">
    <div
      class="container additional-information-container pl-padding-bottom-default"
    >
      <div class="payday-loan-container">
        <div class="additional-information-content pl-space-between-box">
          <pl-additional-information-form
            @submit="submitForm"
            @showSalaryExample="showSalaryExample"
            :customerInfo="customerInfo"
          />
        </div>
      </div>
    </div>
    <pl-salary-document-example-modal/>
  </div>
</template>

<script>
import {
  DOCUMENT_TYPE,
  MODAL_TYPE,
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER
} from "../../helpers/constants";
import { mapGetters, mapMutations } from "vuex";
import PlAdditionalInformationForm from "../../components/Forms/PlAdditionalInformationForm";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { ComService } from "../../services/paydayLoan/com.service";
import PlSalaryDocumentExampleModal from "../../components/Modals/PlSalaryDocumentExampleModal";

export default {
  name: "AdditionalInformation",
  components: { PlSalaryDocumentExampleModal, PlAdditionalInformationForm },
  data() {
    return {
      params: {},
      customerInfo: {
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null
      },
      originCustomerInfo: {}
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      customerMobile: "customer/currentCustomerMobile",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setCurrentStep(PAYDAY_LOAN_STEP.ADDITIONAL_INFORMATION);
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(true);
    this.setCurrentPage("PlAdditionalInformation");
    if (this.currentCloseWebsiteStatus || this.currentCountdownTimerStatus) {
      return;
    }
    this.getCustomerInfo();
  },
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    async submitForm(params) {
      this.showLoading({
        content: {
          title: this.$t("payday_loan.in_progress"),
          content: this.$t("payday_loan.wait_a_minute")
        }
      });

      await this.uploadAdditionalInformationDocument(params);

      const additionalResponse = await this.additionalCustomerInfo({
        maritalStatus: params.maritalStatus,
        educationType: params.educationType,
        borrowerDetailTextVariable1: params.borrowerDetailTextVariable1,
        borrowerEmploymentHistoryTextVariable1:
          params.borrowerEmploymentHistoryTextVariable1
      });

      await this.hideLoading();

      if (additionalResponse.responseCode !== 200) {
        return;
      }

      if (
        this.currentCustomerStatus &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
          PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.COMPLETED_CDE
      ) {
        await this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE);
      }
      await this.$router.push({ name: "PlChooseAmountToBorrow" });
    },
    showSalaryExample() {
      this.showModal({ type: MODAL_TYPE.PL_SALARY_DOCUMENT_EXAMPLE });
    },
    async uploadAdditionalInformationDocument(params) {
      let salary1DocumentPath = this.originCustomerInfo.salaryDocument1;
      let salary2DocumentPath = this.originCustomerInfo.salaryDocument2;
      let salary3DocumentPath = this.originCustomerInfo.salaryDocument3;

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

      return {
        salaryDocument1: salary1DocumentPath,
        salaryDocument2: salary2DocumentPath,
        salaryDocument3: salary3DocumentPath
      };
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
    async additionalCustomerInfo(params) {
      return await CustomerService.additionalInformation(
        this.customerId,
        params,
        { showLoader: false, otherLoader: true }
      );
    },
    async getCustomerInfo() {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: false
      });
      if (response.responseCode == 200) {
        this.originCustomerInfo = JSON.parse(
          JSON.stringify(response.result.personalData)
        );
        let customerInfoData = response.result.personalData;

        if (customerInfoData.errorGetTngInfo) {
          this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET);
          return this.$router.push({ name: "PlContractTermsOfService" });
        }

        customerInfoData.salaryDocument1 = null;
        customerInfoData.salaryDocument2 = null;
        customerInfoData.salaryDocument3 = null;
        this.customerInfo = customerInfoData;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
</style>
