<template>
  <div>
    <div class="payment-method-container">
      <h2 class="payment-method-title">
        {{ $t("payday_loan.choose_payment_method.card_payment") }}
      </h2>

      <div
        id="card-method-img-container"
        class="d-flex justify-content-between"
      >
        <div
          class="d-inline-flex justify-content-center text-center card-method-img-box"
        >
          <img :src="'/img/pl/napas.png'" alt="napas" class="card-method-img" />
        </div>
        <div class="d-inline-flex align-items-center">
          <div id="stick-card" />
        </div>
        <div
          class="d-inline-flex justify-content-center text-center card-method-img-box"
        >
          <img :src="'/img/pl/gpay.png'" alt="gpay" class="card-method-img" />
        </div>
      </div>

      <p class="card-payment-text">
        {{ $t("payday_loan.choose_payment_method.card_payment_napas") }}
      </p>

      <div id="amount-to-be-paid-content">
        <div class="pl-payment-content-container">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label">{{
              $t("payday_loan.choose_payment_method.amount_to_be_paid")
            }}</label>
            <p class="pl-payment-content-value">
              {{ amountToBePaid | formatPrice }}
            </p>

            <p class="pl-payment-content-hint">
              {{
                $t("payday_loan.choose_payment_method.hint_amount_to_be_paid")
              }}
            </p>
          </div>
          <div class="pl-payment-content-right" />
        </div>
      </div>
    </div>
    <div class="btn-actions text-center">
      <pl-button
        type="submit"
        id="finalization-btn-submit"
        class="btn-primary"
        :disabled="disabledBtn"
        @click="finalization"
      >
        {{ $t("payday_loan.choose_payment_method.payment") }}
        <span
          id="card-payment-countdown-timer"
          class="pl-countdown-time"
          v-if="disabledBtn"
          >( {{ countdownTime }}s )</span
        >
      </pl-button>
    </div>
  </div>
</template>

<script>
import { PL_VALUE_DEFAULT } from "../../../helpers/constants";
import moment from "moment";
import { mapGetters } from "vuex";
import PlButton from "../../../components/Buttons/PlButton";

export default {
  name: "CardPayment",
  components: { PlButton },
  props: {
    currentLoan: {
      type: Object
    },
    userInfo: {
      type: Object
    },
    disabledCardPayment: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabledBtn: false,
      countdownTime: 0
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus"
    }),
    amountToBePaid() {
      return (
        this.currentLoan.expectedAmount +
        (parseFloat(this.currentLoan.expectedAmount) *
          PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_DYNAMIC) /
          100 +
        PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_FEE
      );
    }
  },
  watch: {
    disabledCardPayment(newVal) {
      this.disabledBtn = newVal;
      if (newVal) {
        this.countdownTime =
          PL_VALUE_DEFAULT.LOAN_PAYMENT_SUBMIT_COUNTDOWN_TIME;
        this.countdownTimer(this.countdownTime);
      }
    }
  },
  beforeDestroy() {
    this.destroyCountdownTimer();
  },
  methods: {
    async finalization() {
      if (this.disabledBtn) return;
      this.$emit("displayConfirmFinalizationModal");
    },
    countdownTimer(second) {
      let duration = moment.duration(second * 1000, "milliseconds");
      let interval = 1000;
      let intervalProcess = (this.intervalTime = setInterval(() => {
        duration = moment.duration(duration - interval, "milliseconds");
        document.getElementById("card-payment-countdown-timer").textContent =
          "( " + duration.asSeconds() + "s )";
        if (duration.asSeconds() == 0) {
          clearInterval(intervalProcess);
          this.disabledBtn = false;
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
@import "../../../assets/scss/pl/pl-choose-payment-methods";
</style>
