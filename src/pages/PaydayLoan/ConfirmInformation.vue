<template>
  <div class="container-fluid">
    <div
      class="container confirm-information-container pl-padding-bottom-default"
    >
      <div class="payday-loan-container">
        <div class="confirm-information-content pl-space-between-box">
          <pl-confirm-information-form
            @submit="submitForm"
            :customer-info="customerInfo"
          />
        </div>
      </div>
    </div>
    <pl-not-employee-modal />
  </div>
</template>

<script>
import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER
} from "../../helpers/constants";
import PlConfirmInformationForm from "../../components/Forms/PlConfirmInformationForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { CoreService } from "../../services/paydayLoan/core.service";
import PlNotEmployeeModal from "../../components/Modals/PlNotEmployeeModal";
import Configuration from "@/helpers/configuration";
import { ComService } from "../../services/paydayLoan/com.service";

export default {
  name: "ConfirmInformation",
  components: {
    PlNotEmployeeModal,
    PlConfirmInformationForm
  },
  data() {
    return {
      params: {},
      customerInfo: {},
      companyInfo: {
        name: null,
        businessCode: null,
        owner: null,
        address: null
      }
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      customerMobile: "customer/currentCustomerMobile",
      passwordHash: "customer/currentPasswordHash",
      password: "customer/currentPassword",
      ekycCardInfo: "ekyc/currentCardInfo",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(true);
    this.setCurrentStep(PAYDAY_LOAN_STEP.CONFIRM_INFORMATION);
    this.setCurrentPage("PlConfirmInformation");
    this.resetConfirmInformationSuccessStatus();
    if (this.currentCloseWebsiteStatus || this.currentCountdownTimerStatus) {
      return;
    }
    this.getCustomerInfo();
  },
  beforeDestroy() {
    this.resetEkycInfo();
  },
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCoreToken: "auth/SET_CORE_TOKEN",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      setCustomerEmail: "customer/SET_EMAIL",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      setConfirmInformationSuccessStatus:
        "paydayLoan/SET_CONFIRM_INFORMATION_SUCCESS",
      resetConfirmInformationSuccessStatus:
        "paydayLoan/RESET_CONFIRM_INFORMATION_SUCCESS"
    }),
    ...mapActions({
      showEmployeeErrorModal: "modal/openIsNotEmployeeErrorModal",
      showError: "modal/openErrorModal"
    }),
    async submitForm(params) {
      const isEmployee = await this.checkIsEmployeeWorkingForTNG(
        params.organizationName
      );
      if (!isEmployee) {
        this.showEmployeeErrorModal({
          title: this.$t(
            "payday_loan.confirm_information.employee_code_not_exist"
          ),
          content: this.$t(
            "payday_loan.confirm_information.check_employee_code"
          )
        });
        return;
      }
      this.params = params;
      await this.updateCustomerInfo(this.customerId, params);
    },
    async checkIsEmployeeWorkingForTNG(code) {
      const response = await CustomerService.checkIsEmployeeWorkingAtTNG(code);
      if (response.responseCode === 200) {
        return !(
          response.result.isEmployee && response.result.isEmployee === "false"
        );
      }
      return false;
    },
    async updateCustomerInfo(id, params) {
      if (!this.customerInfo.mobileNumber) {
        this.showError({
          content: this.$t("common.something_went_wrong")
        });
        return;
      }

      let validateRequestResult = await CustomerService.validateConfirmInformationRequest(
        id,
        params
      );

      if (validateRequestResult.responseCode !== 200) {
        return;
      }

      if (this.customerInfo.stepOne && this.customerInfo.stepOne === "DONE") {
        const confirmInformationResponse = await CustomerService.confirmInformation(
          id,
          params
        );
        if (confirmInformationResponse.responseCode == 200) {
          await this.createApprovalLetter(params);
          this.redirectToAcceptConfirmLetterPage();
          return;
        }
      }

      const stepOneData = await this.borrowerStepOne(id, params);
      if (
        stepOneData &&
        stepOneData.result &&
        stepOneData.result.access_token
      ) {
        this.setCoreToken(stepOneData.result.access_token);
        const confirmInformationResponse = await CustomerService.confirmInformation(
          id,
          { ...params, coreUserId: stepOneData.result.userId }
        );
        if (confirmInformationResponse.responseCode == 200) {
          await this.createApprovalLetter(params);
          await this.redirectToAcceptConfirmLetterPage();
        }
        return;
      }
      await this.showError({
        content:
          Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.something_went_wrong")
            : stepOneData.message
      });
    },

    async getCompanyInfoById(companyId) {
      const response = await CustomerService.getCompanyInfo({
        companyId: companyId
      });
      if (response.responseCode === 200) {
        this.companyInfo = response.result;
      }
      return response;
    },

    async createApprovalLetter(params) {
      return await ComService.createApprovalLetter({
        name: params.firstName,
        dateOfBirth: params.dateOfBirth,
        nationalId: params.identityNumberOne,
        customerId: this.customerId,
        employeeCode: params.organizationName,
        idIssuePlace: params.idIssuePlace
      });
    },

    redirectToAcceptConfirmLetterPage() {
      this.setConfirmInformationSuccessStatus(true);
      this.resetEkycInfo();
      this.setCustomerEmail(this.params.emailAddress);

      if (
        this.currentCustomerStatus &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
          PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_ACCEPTING_TERM_YET
      ) {
        this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET);
      }
      this.hideLoading();
      this.$router.push({ name: "PlContractTermsOfService" });
    },

    async getCustomerInfo() {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: false
      });
      if (response.responseCode == 200) {
        this.customerInfo = response.result.personalData;
        await this.getCompanyInfoById(this.customerInfo.companyId);
      }
      return response;
    },

    async borrowerStepOne(id, params) {
      return await CoreService.borrowerStepOne({
        password: this.password,
        confirmPassword: this.password,
        mobileNumber: this.customerInfo.mobileNumber,
        customerId: this.customerId,
        emailAddress: params.emailAddress,
        identityNumberSix: params.identityNumberSix,
        firstName: params.firstName,
        dateOfBirth: params.dateOfBirth,
        gender: params.gender,
        identityNumberOne: params.identityNumberOne,
        addressOneLine1: params.addressOneLine1,
        addressTwoLine1: params.addressTwoLine1,
        //Company Name
        borrowerProfileTextVariable2: this.companyInfo.name,
        //Business company code
        borrowerProfileTextVariable3: this.companyInfo.businessCode,
        //Company director
        borrowerProfileTextVariable4: this.companyInfo.owner,
        //Company Address
        borrowerProfileTextVariable5: this.companyInfo.address,
        //Company phone number
        borrowerProfileTextVariable6: this.companyInfo.mobile
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
</style>
