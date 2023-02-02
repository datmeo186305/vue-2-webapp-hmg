<template>
  <div class="container-fluid pl-auth-layout">
    <div class="container-fluid pl-content-auth">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <!-- Verify OTP form -->
          <div class="pl-auth-form" v-if="params.mobile && !verifiedOtp">
            <pl-signing-o-t-p-form
              @verifyOtp="verifyOtp"
              @resendOtp="resendOtp"
              :otp-value="otp"
              :mobile="params.mobile"
            />
          </div>

          <!-- Sign up form -->
          <div class="pl-auth-form" v-else>
            <div class="pl-title-sign-up">
              <p>{{ $t("payday_loan.auth.register") }}</p>
              <img :src="'/img/pl/icon-monex.svg'" alt="" />
            </div>
            <pl-sign-up-form @submitForm="submit" />
            <div class="pl-footer-sign-up">
              <p>{{ $t("payday_loan.auth.have_account") }}</p>
              <router-link :to="{ name: 'PlSignIn' }" class="pl-link-in-line"
                >{{ $t("payday_loan.auth.back_to_sign_in") }}
              </router-link>
            </div>
          </div>

          <!--          <link-to-store class="pl-link-to-store-sign-up"/>-->
        </div>
      </div>
    </div>
    <img
      src="/img/pl/bg-illustration.png"
      class="pl-bottom-auth-container pl-bottom-auth-bg"
      alt=""
    />
  </div>
</template>

<script>
import PlSignUpForm from "../../components/Forms/PlSignUpForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import PlSigningOTPForm from "../../components/Forms/PlSigningOTPForm";
import { AuthService } from "../../services/paydayLoan/auth.service";
import {OTP_TYPE, PL_VALUE_DEFAULT} from "../../helpers/constants";

export default {
  name: "SignUp",
  components: { PlSigningOTPForm, PlSignUpForm },
  data() {
    return {
      signUpSuccessBodyText: this.$t(
        "payday_loan.auth.register_successfully_text",
        { mobile: "" }
      ),
      params: {
        mobile: null,
        password: "",
        provider: OTP_TYPE.ZALO,
        signature: "",
        requestId: ""
      },
      otp: [],
      errorText: "",
      countResend: 0,
      countWrongOTP: 0,
      maxResend: PL_VALUE_DEFAULT.MAX_RESEND_OTP,
      maxWrongTypeOTP: PL_VALUE_DEFAULT.MAX_TYPE_WRONG_OTP,
      verifiedOtp: false
    };
  },
  computed: {
    ...mapGetters({
      currentSigningOtpMobile: "paydayLoan/currentSigningOtpMobile"
    })
  },
  watch: {
    "params.mobile"() {
      this.countWrongOTP = 0;
      this.countResend = 0;
    },
    "$store.state.paydayLoan.signingOtpMobile": {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (!newVal) this.resetParams();
      }
    }
  },
  created() {
    this.resetSession();
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(false);
    this.setAuthPage("PlSignUp");
    this.setVerifiedOtp(false);
    this.setCurrentPage("PlSignIn");
  },
  beforeDestroy() {
    this.resetSignUpPage();
  },
  methods: {
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    ...mapMutations({
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setSigningOtpMobile: "paydayLoan/SET_SIGNING_OTP_MOBILE",
      resetSigningOtpMobile: "paydayLoan/RESET_SIGNING_OTP_MOBILE",
      setAuthPage: "paydayLoan/SET_AUTH_PAGE",
      setVerifiedOtp: "paydayLoan/SET_VERIFIED_OTP",
      resetSignUpPage: "paydayLoan/RESET_SIGN_UP_PAGE",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      resetCustomerStatus: "paydayLoan/RESET_CUSTOMER_STATUS",
      resetPaymentStatus: "paydayLoan/RESET_PAYMENT_STATUS",
      resetHasActiveLoan: "paydayLoan/RESET_HAS_ACTIVE_LOAN",
      resetCustomerInfo: "customer/RESET_CUSTOMER_INFO",
      resetSignedContractTermsStatus:
          "paydayLoan/RESET_SIGNED_CONTRACT_TERMS_STATUS",
      resetSignedContractStatus: "paydayLoan/RESET_SIGNED_CONTRACT_STATUS",
      resetLoanCode: "paydayLoan/RESET_LOAN_CODE",
      resetSentOtpOnsignStatus: "paydayLoan/RESET_SENT_OTP_ONSIGN_STATUS",
      destroyAuth: "auth/DESTROY_AUTH",
      resetChooseAmountSuccess: "paydayLoan/RESET_CHOOSE_AMOUNT_SUCCESS",
      resetConfirmInformationSuccessStatus:
          "paydayLoan/RESET_CONFIRM_INFORMATION_SUCCESS",
      resetRateInfo: "customer/RESET_RATE_INFO",
      resetOtpType: "paydayLoan/RESET_OTP_TYPE"
    }),
    submit(params) {
      this.params.password = params.password;
      this.params.provider = params.provider;
      this.sendOtp(params.mobile, params.provider);
    },
    async sendOtp(mobile, provider) {
      const response = await AuthService.createCustomerAccount(
        {
          mobile: mobile,
          provider: provider,
        }
      );
      this.setSigningOtpMobile(mobile);

      if (response.responseCode == 200) {
        this.params.mobile = mobile;
        this.params.signature = response.result.signature;
        this.params.requestId = response.result.requestId;
        return;
      }

      this.resetSigningOtpMobile();
    },
    async resendOtp() {
      this.countWrongOTP = 0;
      if (this.countResend >= this.maxResend) {
        this.showError({
          content: this.$t("payday_loan.over_times_resend_otp")
        });
        return;
      }
      await this.sendOtp(this.params.mobile, this.params.provider);
      this.countResend++;
    },
    async verifyOtp(otp) {
      this.errorText = null;
      this.otp = otp.split("");
      let haveError = this.checkErrorBeforeVerifyOtp();
      if (haveError) return;

      const response = await AuthService.createVerifiedCustomerAccount({
        mobile: this.params.mobile,
        otp: otp,
        requestId: this.params.requestId,
        signature: this.params.signature,
        password: this.params.password
      });
      if (response.responseCode == 200) {
        this.setVerifiedOtp(true);
        this.verifiedOtp = true;
        await this.$router.push({ name: "PlSignUpSuccess" });
        return;
      }
      this.handleErrorVerifyOtp(response);
    },
    checkErrorBeforeVerifyOtp() {
      if (this.countWrongOTP >= this.maxWrongTypeOTP) {
        this.showError({
          content: this.$t("payday_loan.over_all_times_type_wrong_otp")
        });
        return true;
      }
      return false;
    },
    handleErrorVerifyOtp(response) {
      this.errorText = response.message;
      this.otp = [];
      this.countWrongOTP++;

      this.showError({
        content:
          this.countWrongOTP === this.maxWrongTypeOTP
            ? this.$t("payday_loan.over_all_times_type_wrong_otp")
            : this.$t("payday_loan.n_type_wrong_otp", {
                remaining: this.maxWrongTypeOTP - this.countWrongOTP
              })
      });
    },
    resetParams() {
      this.params = {
        mobile: null,
        password: "",
        signature: "",
        requestId: ""
      };
      this.otp = [];
    },
    resetSession() {
      this.destroyAuth();
      this.resetEkycInfo();
      this.resetCustomerStatus();
      this.resetPaymentStatus();
      this.resetHasActiveLoan();
      this.resetCustomerInfo();
      this.resetSignedContractTermsStatus();
      this.resetSignedContractStatus();
      this.resetLoanCode();
      this.resetSentOtpOnsignStatus();
      this.resetChooseAmountSuccess();
      this.resetConfirmInformationSuccessStatus();
      this.resetRateInfo();
      this.resetOtpType();
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
