<template>
  <div class="container-fluid">
    <div class="container-fluid pl-space-between-box">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <pl-signing-form v-if="!params.mobile" @sendOtp="sendOtp" />
          <pl-signing-o-t-p-form
            v-else
            @verifyOtp="verifyOtp"
            @resendOtp="resendOtp"
            :mobile="params.mobile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlSigningForm from "../../components/Forms/PlSigningForm";
import PlSigningOTPForm from "../../components/Forms/PlSigningOTPForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { AuthService } from "../../services/paydayLoan/auth.service";
import { PL_VALUE_DEFAULT } from "../../helpers/constants";
export default {
  name: "PlSigningOTP",
  components: { PlSigningOTPForm, PlSigningForm },
  data() {
    return {
      params: {
        mobile: "",
        requestId: null,
        signature: null
      },
      countResend: 0,
      countWrongOTP: 0,
      maxResend: PL_VALUE_DEFAULT.MAX_RESEND_OTP,
      maxWrongTypeOTP: PL_VALUE_DEFAULT.MAX_TYPE_WRONG_OTP
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
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(false);
    this.setCurrentPage("PlSigningOTP");
  },
  beforeDestroy() {
    this.destroyModal();
  },
  methods: {
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setSigningOtpMobile: "paydayLoan/SET_SIGNING_OTP_MOBILE",
      resetSigningOtpMobile: "paydayLoan/RESET_SIGNING_OTP_MOBILE",
      destroyModal: "modal/DESTROY_MODAL"
    }),
    async sendOtp(mobile) {
      const response = await AuthService.loginMobileOtp({ mobile: mobile });
      if (response.responseCode == 200) {
        this.params.mobile = mobile;
        this.params.signature = response.result.signature;
        this.params.requestId = response.result.requestId;
        this.setSigningOtpMobile(mobile);
      }
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
      if (this.countWrongOTP >= this.maxWrongTypeOTP) {
        this.showError({
          content: this.$t("payday_loan.over_all_times_type_wrong_otp")
        });
        return;
      }
      const response = await AuthService.verifyMobileOtpLogin({
        mobile: this.params.mobile,
        otp: otp,
        requestId: this.params.requestId,
        signature: this.params.signature
      });
      if (response.responseCode == 200) {
        this.resetSigningOtpMobile();
        await this.$router.push({ name: "PlEKYC" });
        return;
      }
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
        mobile: "",
        requestId: null,
        signature: null
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
</style>
