<template>
  <div>
    <div id="amount-to-be-paid-box">
      <p class="amount-to-be-paid-title">
        {{ $t("payday_loan.loan_payment.amount_to_be_paid") }}
      </p>
      <p class="text-right amount-to-be-paid">
        {{ amountToBePaid | formatPrice }}
      </p>
    </div>
    <div class="loan-payment-headline">
      <h2 class="pl-headline loan-payment-title">
        {{ $t("payday_loan.loan_payment.detail") }}
      </h2>
    </div>
    <div id="loan-payment-info-container">
      <ul class="pl-list">
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.total_amount") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.expectedAmount | formatPrice }}
          </p>
        </li>
        <!--        <li class="pl-list-item">-->
        <!--          <p class="pl-list-item-label pl-service-fee-label">-->
        <!--            {{ $t("payday_loan.loan_payment.payment_fee") }}-->
        <!--            <img-->
        <!--              :src="'/img/pl/info.svg'"-->
        <!--              alt="info"-->
        <!--              v-tooltip.right="{-->
        <!--                content: $t('payday_loan.loan_payment.payment_fee_description')-->
        <!--              }"-->
        <!--            />-->
        <!--          </p>-->
        <!--          <p class="pl-list-item-content">-->
        <!--            {{ paymentFee | formatPrice }}-->
        <!--          </p>-->
        <!--        </li>-->

        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.amount_paid") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.paidAmount | formatPrice }}
          </p>
        </li>

        <!--        <li class="pl-list-item">-->
        <!--          <p class="pl-list-item-label">-->
        <!--            {{ $t("payday_loan.loan_payment.remaining_amount") }}-->
        <!--          </p>-->
        <!--          <p class="pl-list-item-content">-->
        <!--            N/A-->
        <!--          </p>-->
        <!--        </li>-->

        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.late_penalty_payment") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.latePenaltyPayment | formatPrice }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.service_fee") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.totalServiceFees | formatPrice }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.loan_code") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.loanCode }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.settlement_date") }}
          </p>
          <p class="pl-list-item-content">
            {{ settlementDate }}
          </p>
        </li>

        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.punish_start_time") }}
          </p>
          <p class="pl-list-item-content">
            {{ punishStartTime }}
          </p>
        </li>

        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.loan_payment.loan_status") }}
          </p>
          <div class="pl-list-item-content" v-if="loanStatusContent">
            <pl-status-label :status-type="loanStatusContent.labelStatus">
              {{ loanStatusContent.label }}
            </pl-status-label>
          </div>
          <p class="pl-list-item-content pl-list-item-content-empty" v-else>
            {{ $t("payday_loan.loan_payment.no_description") }}
          </p>
        </li>
      </ul>
    </div>

    <div class="text-center loan-payment-btn pl-space-between-content">
      <pl-button
        type="submit"
        id="finalization-btn-submit"
        class="btn-primary"
        @click="finalization"
      >
        {{ $t("payday_loan.loan_payment.finalization_loan") }}
      </pl-button>
    </div>
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import PlStatusLabel from "./StatusLabel";
import {
  LABEL_STATUS,
  PAYDAY_LOAN_STATUS,
  PL_VALUE_DEFAULT
} from "../../../helpers/constants";
import moment from "moment";
export default {
  name: "DetailLoanPayment",
  components: { PlStatusLabel, PlButton },
  props: {
    currentLoan: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    amountToBePaid() {
      return (
        this.currentLoan.expectedAmount +
        this.currentLoan.latePenaltyPayment -
        this.currentLoan.paidAmount
      );
    },
    settlementDate() {
      if (!this.currentLoan.createdAt) {
        return "N/A";
      }
      const createdDate = new Date(this.currentLoan.createdAt);
      return moment(createdDate)
        .add(this.currentLoan.expectedTenure, "days")
        .format("DD/MM/YYYY");
    },

    punishStartTime() {
      if (!this.currentLoan.createdAt) {
        return "N/A";
      }

      const createdDate = new Date(this.currentLoan.createdAt);
      return (
          "00h Ngày " +
          moment(createdDate)
              .add(parseInt(this.currentLoan.expectedTenure) + 1, "days")
              .format("DD/MM/YYYY")
      );
    },
    paymentFee() {
      return (
        (parseFloat(this.currentLoan.expectedAmount) *
          PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_DYNAMIC) /
          100 +
        PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_FEE
      );
    },
    loanStatusContent() {
      if (this.currentLoan.repaymentStatus) {
        if (this.currentLoan.repaymentStatus === "OVERDUE") {
          return {
            label: this.$t(
              `payday_loan.current_loan.repayment_status.${this.currentLoan.repaymentStatus.toLowerCase()}`
            ),
            labelStatus: LABEL_STATUS.CANCEL
          };
        }
      }
      switch (this.currentLoan.loanStatus) {
        case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        case PAYDAY_LOAN_STATUS.INITIALIZED:
        case PAYDAY_LOAN_STATUS.FUNDED:
        case PAYDAY_LOAN_STATUS.AUCTION:
          return {
            label: this.$t(
              `payday_loan.current_loan.status.${this.currentLoan.loanStatus.toLowerCase()}`
            ),
            labelStatus: LABEL_STATUS.PENDING
          };
        case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
          return {
            label: this.$t(
              `payday_loan.current_loan.status.${this.currentLoan.loanStatus.toLowerCase()}`
            ),
            labelStatus: LABEL_STATUS.SUCCESS
          };
        case PAYDAY_LOAN_STATUS.REJECTED:
        case PAYDAY_LOAN_STATUS.WITHDRAW:
          return {
            label: this.$t(
              `payday_loan.current_loan.status.${this.currentLoan.loanStatus.toLowerCase()}`
            ),
            labelStatus: LABEL_STATUS.REJECT
          };
        case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
          return {
            label: this.$t(
              `payday_loan.current_loan.status.${this.currentLoan.loanStatus.toLowerCase()}`
            ),
            labelStatus: LABEL_STATUS.DISBURSEMENT
          };
        default:
          return {
            label: this.currentLoan.loanStatus,
            labelStatus: LABEL_STATUS.REJECT
          };
      }
    }
  },
  created() {},
  methods: {
    finalization() {
      this.$emit("finalization");
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-loan-payment";
</style>
