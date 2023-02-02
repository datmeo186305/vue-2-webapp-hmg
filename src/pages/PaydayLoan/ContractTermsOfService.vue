<template>
  <div class="container-fluid">
    <div class="container pl-padding-bottom-default">
      <div class="payday-loan-container">
        <div class="pl-space-between-box">
          <get-tng-information-failed v-if="errorGetTngInfo" />
          <confirm-information-success v-else :email="email" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { PAYDAY_LOAN_STEP } from "../../helpers/constants";
import ConfirmInformationSuccess from "./components/ConfirmInformationSuccess";
import GetTngInformationFailed from "./components/GetTngInformationFailed";

export default {
  name: "ContractTermsOfService",
  components: { GetTngInformationFailed, ConfirmInformationSuccess },
  data() {
    return {
      email: null,
      errorGetTngInfo: false
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "paydayLoan/userInfo",
      currentCustomerId: "customer/currentCustomerId",
      currentCustomerEmail: "customer/currentCustomerEmail",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      currentCountdownTimerStatus: "paydayLoan/currentCountdownTimerStatus"
    })
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(true);
    this.setCurrentStep(PAYDAY_LOAN_STEP.CONFIRM_INFORMATION);
    this.setCurrentPage("PlContractTermsOfService");
    if (this.currentCloseWebsiteStatus || this.currentCountdownTimerStatus) {
      return;
    }
    this.getUserInfo();
  },
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS"
    }),
    async getUserInfo() {
      if (this.currentCustomerEmail) {
        this.email = this.currentCustomerEmail;
      }

      const response = await CustomerService.getById(this.currentCustomerId);
      if (!response || !response.result || !response.result.personalData) {
        return;
      }
      this.email = response.result.personalData.emailAddress;
      this.errorGetTngInfo = response.result.personalData.errorGetTngInfo;
    }
    // async returnConfirmInformationPage() {
    //   const response = await CustomerService.returnConfirmInformation(
    //       this.currentCustomerId
    //   );
    //   if (!response || response.responseCode !== 200) {
    //     return;
    //   }
    //   this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET);
    //   await this.$router.push({name: "PlConfirmInformation"});
    // }
  }
};
</script>

<style scoped></style>
