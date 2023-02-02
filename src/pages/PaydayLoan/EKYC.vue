<template>
  <div class="container-fluid">
    <!-- eKYC upload   -->
    <ekyc-upload
      @completeEkyc="completeEkyc"
      @redirectToConfirmInformationPage="redirectToConfirmInformationPage"
      :customer-info="customerInfo"
    />

    <!--  Modals -->
    <PlSuccessModal
      :title="$t('payday_loan.eKYC_successful')"
      :content="$t('payday_loan.eKYC_successful_content')"
      :btn-text="$t('common.confirm')"
      @click="closeSuccessModal"
    />
  </div>
</template>

<script>
import PlSuccessModal from "../../components/Modals/PlSuccessModal";
import EkycUpload from "./components/EkycUpload";
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  ERROR_CODE,
  MODAL_TYPE,
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER,
  PL_VALUE_DEFAULT
} from "../../helpers/constants";
import _ from "lodash";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { ComService } from "../../services/paydayLoan/com.service";
import { PaymentService } from "../../services/paydayLoan/payment.service";
import changeAlias from "@/core/utils/no-accent-vietnamese";

export default {
  name: "EKYC",
  components: { EkycUpload, PlSuccessModal },
  data() {
    return {
      customerInfo: {}
    };
  },
  computed: {
    ...mapGetters({
      customerMobile: "customer/currentCustomerMobile",
      customerId: "customer/currentCustomerId",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setDisplayProgressBar(true);
    this.setDisplayTopNavigation(true);
    this.setCurrentStep(PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS);
    this.setCurrentPage("PlEKYC");
    this.resetEkycInfo();
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
      showModal: "modal/SHOW_MODAL",
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      destroyModal: "modal/DESTROY_MODAL",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setEkycInfo: "ekyc/SET_CARD_INFO",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      setCustomerName: "customer/SET_CUSTOMER_NAME"
    }),
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    closeSuccessModal() {
      this.$router.push({ name: "PlConfirmInformation" });
    },
    async redirectToConfirmInformationPage() {
      if (
        this.currentCustomerStatus &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
          PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_FILL_EKYC_YET
      ) {
        this.setCustomerStatus(
          PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET
        );
      }
      await this.$router.push({ name: "PlConfirmInformation" });
    },
    async completeEkyc(ekycCompleteData) {
      if (!ekycCompleteData || !ekycCompleteData.idCardInfo) {
        this.showError({
          content: this.$t("common.unknown_error")
        });
        return;
      }

      this.setCustomerName(ekycCompleteData.idCardInfo.name);

      let ekycInfo = this.bindEkycData(ekycCompleteData.idCardInfo);
      this.setEkycInfo(ekycInfo);

      await this.getVirtualAccount(this.customerId, ekycInfo.name);

      if (
        this.currentCustomerStatus &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
          PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_FILL_EKYC_YET
      ) {
        await this.setCustomerStatus(
          PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET
        );
      }

      await this.showModal({ type: MODAL_TYPE.PL_SUCCESS });
    },
    async createVirtualAccount(customerId, accountName) {
      return await PaymentService.createVA(
        {
          customerId: customerId,
          accountName: changeAlias(accountName)
        },
        { showModalResponseError: false, showModalResponseCodeError: false }
      );
    },
    async getVirtualAccount(customerId, accountName) {
      const response = await PaymentService.getVA(
        {
          customerId: customerId
        },
        { showModalResponseError: false, showModalResponseCodeError: false }
      );
      if (!response) {
        return null;
      }
      if (response.result && response.responseCode === 200) {
        return response.result;
      }

      if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
        return await this.createVirtualAccount(customerId, accountName);
      }

      return null;
    },
    bindEkycData(idCardInfo) {
      return {
        name: idCardInfo.name || "",
        dob: idCardInfo.dob || "",
        id_address: idCardInfo.address || "",
        id_origin: idCardInfo.home || "",
        gender: idCardInfo.gender || "",
        id_number: idCardInfo.id || "",
        dateOfIssue: idCardInfo.dateOfIssue || "",
        placeOfIssue: idCardInfo.placeOfIssue || "",
        documentType: idCardInfo.documentType || "",
        features: idCardInfo.features || "",
        expiredDate: idCardInfo.expiredDate || ""
      };
    },
    async getCustomerInfo() {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: false
      });
      if (response.responseCode == 200) {
        if (!response.result || !response.result.personalData) {
          return null;
        }
        let customerInfoData = response.result.personalData;

        if (response.result.kalapaData) {
          if (!response.result.kalapaData.createdAt) {
            customerInfoData.frontId = null;
            customerInfoData.backId = null;
            customerInfoData.selfie = null;
            this.customerInfo = customerInfoData;
            return;
          }

          let ekycExpiredAt =
            PL_VALUE_DEFAULT.UNIX_TIMESTAMP_SAVE_EKYC_INFO +
            new Date(response.result.kalapaData.createdAt).getTime();
          if (new Date().getTime() > ekycExpiredAt) {
            customerInfoData.frontId = null;
            customerInfoData.backId = null;
            customerInfoData.selfie = null;
            this.customerInfo = customerInfoData;
            return;
          }
        }

        await this.redirectToConfirmInformationPage();
        // await this.downloadEkycImages();
      }
    },
    async downloadEkycImages(customerInfoData) {
      if (customerInfoData && !_.isEmpty(customerInfoData.frontId)) {
        customerInfoData.frontId = await ComService.downloadSingleFile(
          this.customerId,
          customerInfoData.frontId
        );
      }

      if (customerInfoData && !_.isEmpty(customerInfoData.backId)) {
        customerInfoData.backId = await ComService.downloadSingleFile(
          this.customerId,
          customerInfoData.backId
        );
      }

      if (customerInfoData && !_.isEmpty(customerInfoData.selfie)) {
        customerInfoData.selfie = await ComService.downloadSingleFile(
          this.customerId,
          customerInfoData.selfie
        );
      }

      this.customerInfo = customerInfoData;
    }
  }
};
</script>

<style scoped lang="scss"></style>
