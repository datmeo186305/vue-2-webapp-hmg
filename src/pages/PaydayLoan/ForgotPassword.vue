<template>
  <div class="container-fluid pl-auth-layout">
    <div class="container-fluid pl-content-auth">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <!-- Reset password form -->
          <div
            class="pl-auth-form"
            v-if="params.mobile && verifiedOtp && !resetSuccess"
          >
            <div class="pl-title-forgot-password">
              <p>{{ $t("payday_loan.auth.reset_password") }}</p>
              <img :src="'/img/pl/icon-monex.svg'" alt="" />
            </div>
            <pl-reset-password-form @submitForm="resetPass" />
          </div>

          <!-- Verify OTP form -->
          <div
            class="pl-auth-form"
            v-else-if="params.mobile && !verifiedOtp && !resetSuccess"
          >
            <pl-signing-o-t-p-form
              @verifyOtp="verifyOtp"
              @resendOtp="resendOtp"
              :otp-value="otpValue"
              :mobile="params.mobile"
            />
          </div>

          <!-- Forgot password form -->
          <div class="pl-auth-form" v-else>
            <div class="pl-title-forgot-password">
              <p>{{ $t("payday_loan.auth.forgot_password") }}</p>
              <img :src="'/img/pl/icon-monex.svg'" alt="" />
            </div>
            <pl-forgot-password-form @submitForm="submit" />
          </div>

          <!--          <link-to-store class="pl-space-between-box" />-->
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
import PlForgotPasswordForm from "../../components/Forms/PlForgotPasswordForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import PlSigningOTPForm from "../../components/Forms/PlSigningOTPForm";
import { AuthService } from "../../services/paydayLoan/auth.service";
import { PL_VALUE_DEFAULT } from "../../helpers/constants";
import PlResetPasswordForm from "../../components/Forms/PlResetPasswordForm";
import Configuration from "@/helpers/configuration";

export default {
  name: "ForgotPassword",
  components: {
    PlResetPasswordForm,
    PlSigningOTPForm,
    PlForgotPasswordForm
  },
  data() {
    return {
      params: {
        mobile: "",
        newPassword: "",
        requestId: null,
        signature: null,
        confirmPassword: "",
        otp: null
      },
      otpValue: [],
      errorText: "",
      verifiedOtp: false,
      resetSuccess: false,
      countResend: 0,
      countWrongOTP: 0,
      maxResend: PL_VALUE_DEFAULT.MAX_RESEND_OTP,
      maxWrongTypeOTP: PL_VALUE_DEFAULT.MAX_TYPE_WRONG_OTP
    };
  },
  computed: {
    ...mapGetters({
      currentSigningOtpMobile: "paydayLoan/currentSigningOtpMobile",
      isVerifiedOtp: "paydayLoan/isVerifiedOtp"
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
    },
    "$store.state.paydayLoan.verifiedOtp": {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.verifiedOtp = newVal;
      }
    }
  },
  beforeDestroy() {
    this.resetAuthPage();
  },
  created() {
    this.resetSession();
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(false);
    this.setAuthPage("PlForgotPassword");
    this.setVerifiedOtp(false);
    this.setCurrentPage("PlSignIn");
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
      resetAuthPage: "paydayLoan/RESET_AUTH_PAGE",
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
      this.sendOtp(params.mobile);
    },
    btnClick() {
      this.$router.push({ name: "PlSignIn" });
    },
    async sendOtp(mobile) {
      this.errorText = null;
      const response = await AuthService.resetPassword(
        {
          mobile: mobile,
          provider: "CMC"
        },
        { showModalResponseCodeError: false, showModalResponseError: false }
      );
      if (response.errorCode) {
        return this.handleResetPassError(response);
      }
      if (response.responseCode == 200) {
        this.params.mobile = mobile;
        this.params.signature = response.result.signature;
        this.params.requestId = response.result.requestId;
        this.setSigningOtpMobile(mobile);
      }
    },
    handleResetPassError(response) {
      this.showError({
        title:
          Configuration.value('VUE_APP_PRODUCTION') === "true"
            ? this.$t("common.error")
            : response.errorCode,
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : Configuration.value('VUE_APP_PRODUCTION') === "true"
            ? this.$t("payday_loan.auth.phone_number_not_valid")
            : response.message
      });
    },
    async resendOtp(mobile) {
      this.countWrongOTP = 0;
      if (this.countResend >= this.maxResend) {
        this.showError({
          content: this.$t("payday_loan.over_times_resend_otp")
        });
        return;
      }
      await this.sendOtp(mobile);
      this.countResend++;
    },
    async verifyOtp(otp) {
      this.errorText = null;
      this.otpValue = otp.split("");
      let haveError = this.checkErrorBeforeVerifyOtp();
      if (haveError) return;

      const response = await AuthService.resetPasswordVerifiedOtp({
        mobile: this.params.mobile,
        otp: otp,
        requestId: this.params.requestId,
        signature: this.params.signature
      });
      if (response.responseCode == 200) {
        this.params.otp = otp;
        this.verifiedOtp = true;
        this.setVerifiedOtp(true);
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
      this.otpValue = [];
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
    async resetPass(params) {
      this.params.newPassword = params.password;
      this.params.confirmPassword = params.confirmPassword;
      const response = await AuthService.resetPasswordOtp({
        mobile: this.params.mobile,
        otp: this.params.otp,
        requestId: this.params.requestId,
        signature: this.params.signature,
        password: params.password,
        password_again: params.confirmPassword
      });
      if (response.responseCode == 200) {
        this.resetSuccess = true;
        await this.$router.push({ name: "PlForgotPassSuccess" });
      }
    },
    resetParams() {
      this.params = {
        mobile: "",
        requestId: null,
        signature: null,
        newPassword: "",
        confirmPassword: "",
        otp: null
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
