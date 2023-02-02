<template>
  <div class="current-loan-info">
    <div id="current-loan-sign-btn-container">
      <div class="current-loan-headline">
        <h2 class="pl-headline current-loan-info-title">
          {{ $t("payday_loan.current_loan.current_loan_info") }}
        </h2>
        <div>
          <!--          <pl-button-->
          <!--            v-if="currentLoan.loanStatus === 'IN_REPAYMENT'"-->
          <!--            type="button"-->
          <!--            class="btn-primary pl-btn-sign-contract pl-btn-finalization"-->
          <!--            @click="finalization"-->
          <!--            :disabled="-->
          <!--              disabledBtn ||-->
          <!--                paymentStatus === 'ORDER_PENDING' ||-->
          <!--                paymentStatus === 'ORDER_VERIFYING' ||-->
          <!--                paymentStatus === 'ORDER_PROCESSING'-->
          <!--            "-->
          <!--            >{{ $t("payday_loan.current_loan.finalization") }}-->
          <!--          </pl-button>-->
        </div>
      </div>
      <div
        class="current-loan-contract-email"
        v-if="showMessageGuideCompleteContract"
      >
        <pl-inline-message
          v-if="showMessageGuideSignContract"
          :message-type="'INFORMATION'"
          v-html="$t('payday_loan.current_loan.awaiting_borrow_sign_contract')"
          class="please-contract-text"
        />

        <pl-inline-message
          v-else-if="showMessageWaitingEpaySignature"
          :message-type="'INFORMATION'"
          v-html="$t('payday_loan.current_loan.awaiting_epay_sign_contract')"
          class="please-contract-text"
        />

        <pl-inline-message
          v-else
          :message-type="'WARNING'"
          v-html="$t('payday_loan.current_loan.please_wait_approval')"
          class="please-contract-text"
        />
      </div>
      <div
        class="current-loan-contract-email"
        v-else-if="showMessagePaymentProcessing"
      >
        <pl-inline-message
          :message-type="'WARNING'"
          v-html="$t('payday_loan.current_loan.payment_processing')"
          class="please-contract-text"
        />
      </div>
    </div>
    <div id="current-loan-amount-container">
      <ul class="pl-list">
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.total_amount") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.expectedAmount | formatPrice }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.loan_code") }}
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.loanCode }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label pl-service-fee-label">
            {{ $t("payday_loan.current_loan.service_fee") }}
            <img
              :src="'/img/pl/info.svg'"
              alt="info"
              v-tooltip.right="{
                content: $t('payday_loan.current_loan.service_fee_description')
              }"
            />
          </p>
          <p class="pl-list-item-content">
            {{ currentLoan.totalServiceFees | formatPrice }}
          </p>
        </li>
        <li
          class="pl-list-item"
          v-if="currentLoan.loanStatus === 'IN_REPAYMENT'"
        >
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.settlement_date") }}
          </p>
          <p class="pl-list-item-content">
            {{ settlementDate }}
          </p>
        </li>

        <li
          class="pl-list-item"
          v-if="currentLoan.loanStatus === 'IN_REPAYMENT'"
        >
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.punish_start_time") }}
          </p>
          <p class="pl-list-item-content">
            {{ punishStartTime }}
          </p>
        </li>

        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.loan_status") }}
          </p>
          <div class="pl-list-item-content">
            <pl-status-label :status-type="loanStatusContent.labelStatus">
              {{ loanStatusContent.label }}
            </pl-status-label>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="text-center"
      id="sign-contract-btn-submit"
      v-if="currentLoan.loanStatus === 'FUNDED'"
    >
      <!--      <pl-button-->
      <!--        id="pl-current-loan-see-instruction-btn"-->
      <!--        class="btn-secondary"-->
      <!--        @click="seeTheInstructions"-->
      <!--        type="button"-->
      <!--        >{{ $t("payday_loan.current_loan.see_the_intro") }}</pl-button-->
      <!--      >-->
      <pl-button
        class="btn-primary"
        id="pl-current-loan-view-contract-btn"
        @click="viewContract"
        type="button"
        >{{ $t("payday_loan.current_loan.view_contract") }}
      </pl-button>
    </div>

    <div
      class="text-center"
      id="awaiting-document-btn"
      v-else-if="currentLoan.loanStatus === 'DOCUMENT_AWAITING'"
    >
      <pl-button
        class="btn-primary"
        id="pl-current-loan-additional-document-btn"
        @click="additionalDocument"
        type="button"
        >{{ $t("payday_loan.current_loan.additional_document") }}
      </pl-button>
    </div>

    <div
      class="text-center"
      id="finalization-btn"
      v-else-if="currentLoan.loanStatus === 'IN_REPAYMENT'"
    >
      <pl-button
        type="button"
        id="pl-current-loan-finalization-btn"
        class="btn-primary pl-btn-finalization"
        :disabled="disabledBtnFinalization"
        @click="finalization"
        >{{ $t("payday_loan.current_loan.finalization") }}
      </pl-button>
    </div>

    <!--  Modals guide sign contract -->
    <pl-guide-sign-contract-modal
      @click="closeSuccessModal"
      @closeModal="closeSuccessModal"
    />
  </div>
</template>

<script>
import PlInlineMessage from "./InlineMessage";
import PlStatusLabel from "./StatusLabel";
import PlButton from "../../../components/Buttons/PlButton";
import {
  GPAY_RESULT_STATUS,
  LABEL_STATUS,
  MODAL_TYPE,
  PAYDAY_LOAN_STATUS,
  SIGN_STATUS
} from "../../../helpers/constants";
import { mapGetters, mapMutations } from "vuex";
import PlGuideSignContractModal from "../../../components/Modals/PlGuideSignContractModal";
import moment from "moment";

export default {
  name: "PlCurrentLoanDetailInfo",
  components: {
    PlGuideSignContractModal,
    PlInlineMessage,
    PlStatusLabel,
    PlButton
  },
  props: {
    currentLoan: {
      type: [Object, null]
    },
    userInfo: {
      type: [Object, null]
    },
    contractInfo: {
      type: [Object, null]
    }
  },
  data() {
    return {
      disabledBtn: false,
      currentDate: new Date()
    };
  },
  computed: {
    ...mapGetters({
      paymentStatus: "paydayLoan/currentPaymentStatus"
    }),
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
    },
    showMessageGuideSignContract() {
      return (
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.FUNDED &&
        (!this.contractInfo.status ||
          this.contractInfo.status === SIGN_STATUS.ACCEPTED ||
          this.contractInfo.status === SIGN_STATUS.AWAITING_BORROWER_SIGNATURE)
      );
    },
    showMessageWaitingEpaySignature() {
      return (
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.FUNDED &&
        this.contractInfo.status === SIGN_STATUS.AWAITING_EPAY_SIGNATURE
      );
    },
    showMessageGuideCompleteContract() {
      return (
        this.currentLoan.loanStatus ===
          PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE ||
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING ||
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.FUNDED ||
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.INITIALIZED
      );
    },
    showMessagePaymentProcessing() {
      return (
        this.currentLoan.loanStatus === PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
        (this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
          this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
          this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING)
      );
    },
    disabledBtnFinalization() {
      return (
        this.disabledBtn ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING
      );
    }
  },
  created() {},
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    seeTheInstructions() {
      this.showModal({ type: MODAL_TYPE.PL_GUIDE_SIGN_CONTRACT });
    },
    viewContract() {
      this.$emit("viewContract");
    },
    finalization() {
      if (this.disabledBtn) return;
      this.$emit("finalization");
    },
    closeSuccessModal() {
      this.destroyModal();
    },
    additionalDocument() {
      this.$router.push({ name: "PlAdditionalDocument" });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

.current-loan-info-title {
  width: 100%;
}

.current-loan-headline {
  display: flex;
  align-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.pl-btn.pl-btn-sign-contract {
  max-width: 104px;
  height: 28px;
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: $white;
  flex: none;
}

.pl-btn.pl-btn-finalization {
  background-color: $system-color-indigo;

  &:hover,
  &:focus,
  &:active {
    background-color: #8f8dfa;
  }
}

#current-loan-amount-container {
  margin-top: 16px;
  border-top: 1px solid $grey-02;
  border-bottom: 1px solid $grey-02;

  .pl-list-item:last-child {
    border-bottom: 0;
  }
}

.current-loan-contract-email {
  margin-top: 16px;
  padding: 0 16px;
}

#current-loan-sign-btn-container {
  margin-bottom: 20px;
}

.pl-service-fee-label {
  display: flex;

  img {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
}

.please-contract-text {
  display: block;
}

#sign-contract-btn-submit {
  place-content: center;
  margin-top: 16px;
  display: flex;
  gap: 8px;
  align-items: center;

  .pl-btn {
    max-width: 143.5px;
  }
}

#awaiting-document-btn {
  place-content: center;
  margin-top: 16px;
  display: flex;
  align-items: center;

  #pl-current-loan-additional-document-btn {
    max-width: 200px;
  }
}

#finalization-btn {
  place-content: center;
  margin-top: 16px;
  display: flex;
  align-items: center;

  #pl-current-loan-finalization-btn {
    max-width: 200px;
  }
}
</style>
