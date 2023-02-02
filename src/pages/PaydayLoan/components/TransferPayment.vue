<template>
  <div>
    <div class="payment-method-container">
      <h2 class="payment-method-title">
        {{ $t("payday_loan.choose_payment_method.bank_transfer") }}
      </h2>

      <p class="transfer-payment-text">
        {{ $t("payday_loan.choose_payment_method.guide_bank_transfer") }}
      </p>

      <div id="amount-to-be-paid-content">
        <!-- amountToBePaid -->
        <div class="pl-payment-content-container">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label"
              >{{ $t("payday_loan.choose_payment_method.amount_to_be_paid") }}
<!--              <img-->
<!--                :src="'/img/pl/info.svg'"-->
<!--                alt="info"-->
<!--                v-tooltip.top="{-->
<!--                  content: $t(-->
<!--                    'payday_loan.choose_payment_method.amount_to_be_paid_desc'-->
<!--                  )-->
<!--                }"-->
<!--            />-->
            </label>
            <p class="pl-payment-content-value">
              {{ amountToBePaid | formatPrice }}
            </p>
          </div>
          <div class="pl-payment-content-right">
            <!--          <pl-button-->
            <!--            type="button"-->
            <!--            class="btn-primary"-->
            <!--            @click="copyToClipboardNumber(amountToBePaid)"-->
            <!--            >{{ $t("payday_loan.choose_payment_method.copy") }}-->
            <!--          </pl-button>-->
          </div>
        </div>

        <!-- receiverBackCode -->
        <div class="pl-payment-content-container">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label">{{
              $t("payday_loan.choose_payment_method.bank_code_receiver")
            }}</label>
            <p class="pl-payment-content-value">
              {{ vaInfo.bankCode }}
            </p>
          </div>
          <div class="pl-payment-content-right" />
        </div>

        <!-- receiverAccountNumber -->
        <div class="pl-payment-content-container">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label">{{
              $t("payday_loan.choose_payment_method.account_number_receiver")
            }}</label>
            <p class="pl-payment-content-value">
              {{ vaInfo.accountNumber }}
            </p>
          </div>
          <div class="pl-payment-content-right">
            <!--          <pl-button-->
            <!--            type="button"-->
            <!--            class="btn-primary"-->
            <!--            @click="copyToClipboard(vaInfo.accountNumber)"-->
            <!--            >{{ $t("payday_loan.choose_payment_method.copy") }}-->
            <!--          </pl-button>-->
          </div>
        </div>

        <!-- receiverName -->
        <div class="pl-payment-content-container">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label"
              >{{ $t("payday_loan.choose_payment_method.name_receiver") }}
              <img
                :src="'/img/pl/info.svg'"
                alt="info"
                v-tooltip.top="{
                  content: $t(
                    'payday_loan.choose_payment_method.name_receiver_desc'
                  )
                }"
            /></label>
            <p class="pl-payment-content-value">
              {{ vaInfo.accountName }}
            </p>
          </div>
          <div class="pl-payment-content-right" />
        </div>

        <!-- Transfer content-->
        <div class="pl-payment-content-container border-bottom-0">
          <div class="pl-payment-content-left">
            <label class="pl-payment-content-label pl-required">{{
              $t("payday_loan.choose_payment_method.transfer_content")
            }}</label>
            <p class="pl-payment-content-value">
              {{
                currentLoan.loanCode
                  ? currentLoan.loanCode.replace("-", "")
                  : ""
              }}
            </p>
          </div>
          <div class="pl-payment-content-right">
            <!--                              <pl-button-->
            <!--                                type="button"-->
            <!--                                class="btn-primary"-->
            <!--                                @click="copyToClipboard(currentLoan.loanCode)"-->
            <!--                                >{{ $t("payday_loan.choose_payment_method.copy") }}-->
            <!--                              </pl-button>-->
          </div>
        </div>

        <!--                <div id="pl-payment-required">-->
        <!--                  <p-->
        <!--                    v-html="-->
        <!--                      $t('payday_loan.choose_payment_method.required_name_desc', {-->
        <!--                        name: userInfo.firstName-->
        <!--                      })-->
        <!--                    "-->
        <!--                  />-->
        <!--                </div>-->
      </div>
    </div>

    <div class="btn-actions text-center">
      <pl-button
        type="button"
        id="transfer-btn-submit"
        class="btn-primary"
        @click="displayGuideDialog"
      >
        {{ $t("payday_loan.choose_payment_method.payment") }}
      </pl-button>
    </div>

    <pl-guide-transfer-payment-modal></pl-guide-transfer-payment-modal>
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import { MODAL_TYPE, PL_VALUE_DEFAULT } from "../../../helpers/constants";
import Configuration from "@/helpers/configuration";
import { PaymentService } from "../../../services/paydayLoan/payment.service";
import { mapGetters, mapMutations } from "vuex";
import PlGuideTransferPaymentModal from "../../../components/Modals/PlGuideTransferPaymentModal";

export default {
  name: "TransferPayment",
  components: { PlGuideTransferPaymentModal, PlButton },
  props: {
    currentLoan: {
      type: Object
    },
    userInfo: {
      type: Object
    },
    vaInfo: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId"
    }),
    amountToBePaid() {
      return (
        this.currentLoan.expectedAmount +
        this.currentLoan.latePenaltyPayment -
        this.currentLoan.paidAmount
      );
    }
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    // copyToClipboard(text) {
    //   navigator.clipboard.writeText(text ? text.trim().replace("-", "") : "");
    //   this.$emit("displayCopied");
    // },
    // copyToClipboardNumber(number) {
    //   navigator.clipboard.writeText(number);
    //   this.$emit("displayCopied");
    // },

    async createPaymentOrder() {
      return await PaymentService.createPaymentOrder({
        customerId: this.customerId,
        applicationId: this.currentLoan.loanId,
        applicationType: Configuration.value("VUE_APP_PAYMENT_ORDER_NAME")
      });
    },

    async displayGuideDialog() {
      const response = await this.createPaymentOrder();

      if (response.responseCode !== 200) {
        return null;
      }

      this.showModal({
        type: MODAL_TYPE.PL_GUIDE_TRANSFER_PAYMENT,
        content: {
          transferContent: this.currentLoan.loanCode
            ? this.currentLoan.loanCode.replace("-", "")
            : "",
          accountName: this.vaInfo.accountName,
          accountNumber: this.vaInfo.accountNumber,
          amountToBePaid: this.amountToBePaid
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/scss/pl/pl-choose-payment-methods";
</style>
