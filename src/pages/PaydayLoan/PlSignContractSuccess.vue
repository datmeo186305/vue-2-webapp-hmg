<template>
  <div id="sign-contract-success-container" class="container-fluid">
    <div class="container-fluid ">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <!-- sign contract success -->
          <div>
            <electronic-signing-success
              :title="
                $t(
                  'payday_loan.contract_terms_of_service.signed_contract_success'
                )
              "
              :btn-text="$t('common.continue')"
              @btnClick="redirectToCurrentLoanPage"
            >
              <template slot="body">
                <div class="contract-success-body">
                  <p
                    v-html="
                      $t('payday_loan.contract_terms_of_service.thanks', {
                        name: firstName
                      })
                    "
                    class="contract-success-text-default"
                  />
                  <p class="contract-success-text-default">
                    {{
                      $t(
                        "payday_loan.contract_terms_of_service.signed_contract_success_text"
                      )
                    }}
                  </p>
                  <br />
                  <p class="contract-success-text-default">
                    {{
                      $t(
                        "payday_loan.contract_terms_of_service.signed_contract_success_loan_id",
                        { loanId: loanCode }
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
import ElectronicSigningSuccess from "./components/ElectronicSigningSuccess";

export default {
  name: "PlSignContractSuccess",
  components: { ElectronicSigningSuccess },
  data() {
    return {
      firstName: "",
      loanCode: ""
    };
  },
  computed: {
    ...mapGetters({
      customerName: "customer/currentCustomerName",
      currentLoanCode: "paydayLoan/currentLoanCode",
      isSignedContract: "paydayLoan/isSignedContract",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus"
    })
  },
  created() {
    if (!this.isSignedContract) {
      // return this.$router.push({ name: "PlSignContract" });
    }
    if (this.customerName) {
      this.firstName = this.customerName;
    }
    if (this.currentLoanCode) {
      this.loanCode = this.currentLoanCode;
    }
  },
  mounted() {
    this.setDisplayTopNavigation(false);
    this.setDisplayProgressBar(false);
    this.setCurrentPage("PlCurrentLoan");
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      resetAuthPage: "paydayLoan/RESET_AUTH_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setSignedContractStatus: "paydayLoan/SET_SIGNED_CONTRACT_STATUS",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setCustomerName: "customer/SET_CUSTOMER_NAME"
    }),
    redirectToCurrentLoanPage() {
      this.setSignedContractStatus(false);
      this.$router.push({ name: "PlCurrentLoan" });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
@import "src/assets/scss/variables";

#sign-contract-success-container {
  min-height: calc(100vh - 124px);
  background: #ffffff;
  padding-top: 48px;
  position: relative;
}

.contract-success-body {
  margin-top: 16px;
}

.contract-success-text-default {
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
