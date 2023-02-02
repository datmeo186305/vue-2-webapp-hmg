<template>
  <modal
    :type="modalType"
    :id="'payday-loan-guide-transfer-payment-modal'"
    :ariaLabelledby="'myModalLabel-24'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div>
        <img
          :src="'/img/pl/dismiss.svg'"
          alt=""
          class="dismiss-modal-btn"
          @click="closeModal"
        />
        <div id="guide-transfer-title">
          <h2>{{ $t("payday_loan.guide_transfer.title") }}</h2>
        </div>
        <div class="guide-transfer-content">
          <section class="pl-modal-guide-section">
            <p class="pl-modal-guide-step">
              {{ $t("payday_loan.guide_transfer.step", { step: 1 }) }}
            </p>
            <p class="pl-modal-guide-step-desc">
              {{ $t("payday_loan.guide_transfer.step_1") }}
            </p>
            <div class="pl-divider" />
          </section>

          <section class="pl-modal-guide-section">
            <p class="pl-modal-guide-step">
              {{ $t("payday_loan.guide_transfer.step", { step: 2 }) }}
            </p>
            <p
              class="pl-modal-guide-step-desc"
              v-if="modalContent"
              v-html="
                $t('payday_loan.guide_transfer.step_2', {
                  account_name: modalContent.accountName || '',
                  account_number: modalContent.accountNumber || ''
                })
              "
            />

            <div class="pl-copy-box justify-content-between align-items-center">
              <img :src="'/img/pl/mb-logo.svg'" class="mb-logo" alt="mbbank" />
              <p class="pl-copy-box-content" v-if="modalContent">
                {{ modalContent.accountNumber }}
              </p>
              <div class="pl-copy-box-btn" v-if="modalContent">
                <p
                  v-if="!copiedAccountNumber"
                  @click="
                    copyToClipboardAccountNumber(modalContent.accountNumber)
                  "
                  class="pl-copy-text"
                >
                  {{ $t("payday_loan.guide_transfer.copy_account_number") }}
                </p>
                <p class="pl-copied" v-else>
                  <span class="sprite-group-3-success-message-icon" />
                  {{ $t("payday_loan.guide_transfer.copied") }}
                </p>
              </div>
            </div>

            <div class="pl-divider" />
          </section>

          <section class="pl-modal-guide-section">
            <p class="pl-modal-guide-step">
              {{ $t("payday_loan.guide_transfer.step", { step: 3 }) }}
            </p>
            <p class="pl-modal-guide-step-desc">
              {{ $t("payday_loan.guide_transfer.step_3.amount") }}
            </p>

            <div class="pl-copy-box justify-content-between align-items-center">
              <p class="pl-copy-box-content" v-if="modalContent">
                {{ modalContent.amountToBePaid | formatPrice }}
              </p>
              <div class="pl-copy-box-btn" v-if="modalContent">
                <p
                  v-if="!copiedAmount"
                  @click="copyToClipboardAmount(modalContent.amountToBePaid)"
                  class="pl-copy-text"
                >
                  {{ $t("payday_loan.guide_transfer.copy_amount") }}
                </p>
                <p class="pl-copied" v-else>
                  <span class="sprite-group-3-success-message-icon" />
                  {{ $t("payday_loan.guide_transfer.copied") }}
                </p>
              </div>
            </div>

            <p class="pl-modal-guide-step-desc">
              {{ $t("payday_loan.guide_transfer.step_3.content") }}
            </p>

            <div class="pl-copy-box justify-content-between align-items-center">
              <p class="pl-copy-box-content" v-if="modalContent">
                {{ modalContent.transferContent }}
              </p>
              <div class="pl-copy-box-btn" v-if="modalContent">
                <p
                    v-if="!copiedContent"
                    @click="copyToClipboardContent(modalContent.transferContent)"
                    class="pl-copy-text"
                >
                  {{ $t("payday_loan.guide_transfer.copy_content") }}
                </p>
                <p class="pl-copied" v-else>
                  <span class="sprite-group-3-success-message-icon" />
                  {{ $t("payday_loan.guide_transfer.copied") }}
                </p>
              </div>
            </div>

            <div class="pl-divider" />
          </section>

          <section class="pl-modal-guide-section">
            <p class="pl-modal-guide-step">
              {{ $t("payday_loan.guide_transfer.step", { step: 4 }) }}
            </p>
            <p class="pl-modal-guide-step-desc">
              {{ $t("payday_loan.guide_transfer.step_4") }}
            </p>
          </section>
        </div>
      </div>

      <div class="text-center pl-sign-contract-btn">
        <pl-button
          class="btn-primary"
          id="close-guide-sign-letter-btn"
          @click="clickBtn"
          >{{ $t("payday_loan.sign_letter.understand") }}
        </pl-button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import PlButton from "../Buttons/PlButton";
import { mapGetters } from "vuex";

export default {
  name: "PlGuideTransferPaymentModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_GUIDE_TRANSFER_PAYMENT,
      copiedAmount: false,
      copiedAccountNumber: false,
      copiedContent: false,
    };
  },
  computed: {
    ...mapGetters({
      modalContent: "modal/currentModalContent"
    })
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
      this.$store.commit("modal/DESTROY_MODAL");
    },
    clickBtn() {
      this.$emit("click");
      this.$store.commit("modal/DESTROY_MODAL");
    },

    copyToClipboardAccountNumber(text) {
      this.copyToClipboard(text ? text.trim().replace("-", "") : "");
      this.copiedAccountNumber = true;
      this.copiedAmount = false;
      this.copiedContent = false;
    },

    copyToClipboardAmount(number) {
      this.copyToClipboard(number);
      this.copiedAmount = true;
      this.copiedAccountNumber = false;
      this.copiedContent = false;
    },

    copyToClipboardContent(text) {
      this.copyToClipboard(text);
      this.copiedAmount = false;
      this.copiedAccountNumber = false;
      this.copiedContent = true;
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
</style>
