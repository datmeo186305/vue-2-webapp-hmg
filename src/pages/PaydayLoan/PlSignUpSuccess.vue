<template>
  <div class="container-fluid pl-auth-layout">
    <div class="container-fluid pl-content-auth">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <!-- Sign up success -->
          <div class="pl-auth-form">
            <sign-up-success
              :title="$t('payday_loan.auth.register_successfully')"
              :bodyText="signUpSuccessBodyText"
              :btn-text="$t('payday_loan.auth.login_now')"
            >
              <template slot="footer">
                <div class="text-center pl-space-between-content">
                  <pl-button
                    id="sign-up-success-btn"
                    type="submit"
                    class="btn-primary btn-sign-up-success"
                    @click="btnClick"
                  >
                    <span>{{ $t("payday_loan.auth.login_now") }}</span>
                    <span
                      id="sign-up-success-countdown-timer"
                      class="pl-countdown-time"
                      >( {{ countdownTime }}s )</span
                    >
                  </pl-button>
                </div>
              </template>
            </sign-up-success>
          </div>
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
import { mapGetters, mapMutations } from "vuex";
import SignUpSuccess from "./components/SignUpSuccess";
import moment from "moment";
import { PL_VALUE_DEFAULT } from "../../helpers/constants";
import PlButton from "../../components/Buttons/PlButton";
export default {
  name: "PlSignUpSuccess",
  components: { PlButton, SignUpSuccess },
  data() {
    return {
      signUpSuccessBodyText: this.$t(
        "payday_loan.auth.register_successfully_text",
        { mobile: "" }
      ),
      countdownTime: PL_VALUE_DEFAULT.REDIRECT_TO_SIGN_IN_COUNTDOWN_TIME
    };
  },
  computed: {
    ...mapGetters({
      currentSigningOtpMobile: "paydayLoan/currentSigningOtpMobile"
    })
  },
  created() {
    this.signUpSuccessBodyText = this.$t(
      "payday_loan.auth.register_successfully_text",
      { mobile: this.currentSigningOtpMobile }
    );
  },
  mounted() {
    this.setDisplayTopNavigation(true);
    this.setDisplayProgressBar(false);
    this.setCurrentPage("PlSignIn");
    this.countdownTimer(this.countdownTime);
  },
  beforeDestroy() {
    this.resetAuthPage();
    this.destroyCountdownTimer();
  },
  methods: {
    ...mapMutations({
      resetAuthPage: "paydayLoan/RESET_AUTH_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE"
    }),
    btnClick() {
      this.$router.push({ name: "PlSignIn" });
    },
    countdownTimer(second) {
      let duration = moment.duration(second * 1000, "milliseconds");
      let interval = 1000;
      let intervalProcess = (this.intervalTime = setInterval(() => {
        duration = moment.duration(duration - interval, "milliseconds");
        document.getElementById("sign-up-success-countdown-timer").textContent =
          "( " + duration.asSeconds() + "s )";
        if (duration.asSeconds() == 0) {
          clearInterval(intervalProcess);
          this.$router.push({ name: "PlSignIn" });
        }
      }, interval));
    },
    destroyCountdownTimer() {
      clearInterval(this.intervalTime);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
@import "src/assets/scss/variables";
.pl-countdown-time {
  margin: 0;
  padding-left: 4px;
  color: $white;
  font-family: $sfUiDisplay;
  font-weight: 400;
}
</style>
