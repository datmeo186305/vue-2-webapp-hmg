<template>
  <div id="sign-contract-term-success-container" class="container-fluid">
    <div class="container-fluid ">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <!-- sign contract terms success -->
          <div>
            <electronic-signing-success
              :title="
                $t('payday_loan.contract_terms_of_service.signed_contract_terms_success')
              "
              :btn-text="$t('common.continue')"
              @btnClick="redirectToAdditionalInformationPage"
            >
              <template slot="body">
                <div class="contract-terms-success-body">
                  <p
                    v-html="
                      $t('payday_loan.contract_terms_of_service.thanks', {
                        name: firstName
                      })
                    "
                    class="contract-terms-success-text-default"
                  />
                  <p class="contract-terms-success-text-default">
                    {{
                      $t(
                        "payday_loan.contract_terms_of_service.signed_contract_terms_success_text"
                      )
                    }}
                  </p>
                </div>
              </template>
            </electronic-signing-success>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_UI_STATUS,
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER
} from "../../helpers/constants";
import ElectronicSigningSuccess from "./components/ElectronicSigningSuccess";

export default {
  name: "PlSignContractTermsSuccess",
  components: { ElectronicSigningSuccess },
  data() {
    return {
      firstName: ""
    };
  },
  computed: {
    ...mapGetters({
      customerName: "customer/currentCustomerName",
      isSignedContractTerms: "paydayLoan/isSignedContractTerms",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus"
    })
  },
  created() {
    if (!this.isSignedContractTerms) {
      return this.$router.push({ name: "PlContractTermsOfService" });
    }
    if (this.customerName) {
      this.firstName = this.customerName;
    }
  },
  mounted() {
    this.setDisplayTopNavigation(false);
    this.setDisplayProgressBar(false);
    this.setCurrentStep(PAYDAY_LOAN_STEP.CONFIRM_INFORMATION);
    this.setCurrentPage("PlContractTermsOfService");
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      resetAuthPage: "paydayLoan/RESET_AUTH_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS",
      setSignedContractTermsStatus:
        "paydayLoan/SET_SIGNED_CONTRACT_TERMS_STATUS",
      setCustomerName: "customer/SET_CUSTOMER_NAME"
    }),
    redirectToAdditionalInformationPage() {
      if (
        this.currentCustomerStatus &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[this.currentCustomerStatus] <
          PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.NOT_COMPLETE_CDE_YET
      ) {
        this.setCustomerStatus(PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET);
      }
      this.setSignedContractTermsStatus(false);
      this.$router.push({ name: "PlAdditionalInformation" });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
@import "src/assets/scss/variables";

#sign-contract-term-success-container {
  min-height: calc(100vh - 124px);
  background: #ffffff;
  padding-top: 48px;
  position: relative;
}

.contract-terms-success-body {
  margin-top: 16px;
}

.contract-terms-success-text-default {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.1px;
  color: $grey-08;
}
</style>
