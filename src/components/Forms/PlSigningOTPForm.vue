<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <div class="pl-signing-otp-container">
        <div class="text-center">
          <img
            :src="'/img/pl/phone-otp.svg'"
            alt="phoneOTP"
            class="pl-inline-block"
          />
        </div>
        <p class="pl-space-between-content type-otp-text">
          {{ $t("payday_loan.type_otp") }}
        </p>

        <div class="pl-space-between-content">
          <div class="form-sm mt-2 forgot-password-otp-input">
            <div class="d-flex digit-group">
              <otp-input
                ref="plSigningOtpInput"
                input-classes="pl-text-otp"
                separator=""
                placeholder=""
                :display-status-line="true"
                :num-inputs="6"
                :should-auto-focus="true"
                :value="otpValue"
                :disabled="disabled"
                @on-change="handleOnChange"
                @on-complete="handleOnComplete"
              />
            </div>
          </div>
          <div class="pl-error-otp" v-if="errorText || errorSendOTPText">
            {{ errorText || errorSendOTPText }}
          </div>
        </div>

        <slot name="guide">
          <p
            class="pl-space-between-content sent-otp-text"
            v-html="$t('payday_loan.sent_otp_success', { phone: mobile })"
          />
        </slot>

        <div class="pl-space-between-content resend-otp">
          <div v-if="!hiddenCountdown">
            <img
              :src="'/img/pl/arrow-counterclockwise.svg'"
              alt="resendOTP"
              class="pl-inline-block"
            />
            <span class="resend-otp-text">{{
              $t("payday_loan.send_otp_after")
            }}</span>
            <span id="signing-otp-countdown-timer" class="pl-countdown-time"
              >{{ countdownTime }}s</span
            >
          </div>
          <template v-else>
            <div>
              <img
                :src="'/img/pl/arrow-counterclockwise.svg'"
                alt="resendOTP"
                class="pl-inline-block"
              />
              <span class="resend-otp-text">
                <a
                  href="javascript:void(0)"
                  @click="resendOtp"
                  class="resend-otp-btn"
                  >{{ $t("payday_loan.resent_otp") }}</a
                ></span
              >
            </div>
          </template>
          <div v-if="showOtherOtpMethod">
            <button
              :disabled="!hiddenCountdown"
              class="otp-method-choice"
              @click="openChooseOtpMethodModal()"
            >
              {{ $t("payday_loan.choose_otp_method.choose_other_otp_method") }}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.52857 2.86192C5.26823 3.12227 5.26823 3.54438 5.52857 3.80473L9.72385 7.99999L5.52857 12.1953C5.26823 12.4556 5.26823 12.8777 5.52857 13.1381C5.78893 13.3984 6.21103 13.3984 6.47139 13.1381L11.138 8.47139C11.3984 8.21106 11.3984 7.78892 11.138 7.52859L6.47139 2.86192C6.21103 2.60157 5.78893 2.60157 5.52857 2.86192Z"
                  fill="#3A3A3C"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          class="text-center pl-space-between-content"
          v-if="showSubmitButton"
        >
          <pl-button
            id="btn-next-form-signing-otp"
            type="submit"
            class="btn-primary btn-next-signing-otp"
            :disabled="disableBtnNext || disabled"
          >
            {{ $t("common.confirm") }}
          </pl-button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlButton from "../Buttons/PlButton";
import OtpInput from "../Inputs/OtpInput";
import moment from "moment";
import { PL_VALUE_DEFAULT } from "../../helpers/constants";

export default {
  name: "PlSigningOTPForm",
  components: { OtpInput, PlButton },
  props: {
    mobile: {},
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    errorText: {
      type: String
    },
    errorSendOTPText: {
      type: String
    },
    otpValue: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showOtherOtpMethod: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      otp: null,
      disableBtnNext: true,
      countdownTime: PL_VALUE_DEFAULT.RESEND_OTP_COUNTDOWN_TIME,
      intervalTime: null,
      hiddenCountdown: false
    };
  },
  watch: {
    "$store.state.paydayLoan.otpType": {
      deep: true,
      immediate: true,
      handler(newVal, oldValue) {
        if (oldValue && newVal !== oldValue) {
          this.resetCountdownTimer();
        }
      }
    },
    errorSendOTPText(newVal) {
      if (newVal) {
        this.destroyCountdownTimer();
      }
    }
  },
  mounted() {
    this.countdownTimer(this.countdownTime);
  },
  beforeDestroy() {
    this.destroyCountdownTimer();
  },
  methods: {
    submit() {
      if (this.disableBtnNext) return;
      this.$emit("verifyOtp", this.otp);
    },
    resendOtp() {
      this.$emit("resendOtp", this.mobile);
      this.resetCountdownTimer();
    },
    resetCountdownTimer() {
      this.hiddenCountdown = false;
      this.countdownTimer(this.countdownTime);
    },
    handleOnComplete(value) {
      this.otp = value;
      this.disableBtnNext = false;
      if (!this.showSubmitButton) {
        this.submit();
        return;
      }
      document.getElementById("btn-next-form-signing-otp").focus();
    },
    handleOnChange(value) {
      this.otp = value;
      this.disableBtnNext = true;
    },
    countdownTimer(second) {
      let duration = moment.duration(second * 1000, "milliseconds");
      let interval = 1000;
      let intervalProcess = (this.intervalTime = setInterval(() => {
        duration = moment.duration(duration - interval, "milliseconds");
        document.getElementById("signing-otp-countdown-timer").textContent =
          duration.asSeconds() + "s";
        if (duration.asSeconds() == 0) {
          clearInterval(intervalProcess);
          this.hiddenCountdown = true;
        }
      }, interval));
    },
    destroyCountdownTimer() {
      clearInterval(this.intervalTime);
      this.hiddenCountdown = true;
    },
    openChooseOtpMethodModal() {
      if (!this.hiddenCountdown) {
        return;
      }
      this.$emit("openChooseOtpMethodModal");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-signing-otp";
</style>
