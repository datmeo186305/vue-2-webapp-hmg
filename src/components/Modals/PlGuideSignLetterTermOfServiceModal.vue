<template>
  <modal
    :type="modalType"
    :id="'payday-loan-guide-sign-letter-term-of-service'"
    :ariaLabelledby="'myModalLabel-19'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-guide-sign-contract-content">
        <img
          :src="'/img/pl/dismiss.svg'"
          alt=""
          class="dismiss-modal-btn"
          @click="closeModal"
        />
        <p class="pl-modal-guide-sign-contract-title">
          {{ $t("payday_loan.sign_letter.modal_title") }}
        </p>
        <section
          class="pl-modal-guide-sign-contract-section"
          v-for="(step, index) in steps"
          :key="'step' + index"
        >
          <p class="pl-modal-guide-sign-contract-step">
            {{ step.step_text }}
          </p>
          <h2 class="pl-modal-guide-sign-contract-step-title">
            {{ step.title }}
          </h2>
          <p
            class="pl-modal-guide-sign-contract-step-desc"
            v-html="step.desc"
          />
          <div class="pl-divider" v-if="index < steps.length" />
        </section>
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
  name: "PlGuideSignLetterTermOfServiceModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_GUIDE_SIGN_LETTER_TERM_OF_SERVICE,
      steps: [
        {
          step_text: this.$t("payday_loan.sign_letter.steps_1.step_text"),
          title: this.$t("payday_loan.sign_letter.steps_1.title"),
          desc: this.$t("payday_loan.sign_letter.steps_1.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_letter.steps_2.step_text"),
          title: this.$t("payday_loan.sign_letter.steps_2.title"),
          desc: this.$t("payday_loan.sign_letter.steps_2.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_letter.steps_3.step_text"),
          title: this.$t("payday_loan.sign_letter.steps_3.title"),
          desc: this.$t("payday_loan.sign_letter.steps_3.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_letter.steps_4.step_text"),
          title: this.$t("payday_loan.sign_letter.steps_4.title"),
          desc: this.$t("payday_loan.sign_letter.steps_4.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_letter.steps_5.step_text"),
          title: this.$t("payday_loan.sign_letter.steps_5.title"),
          desc: this.$t("payday_loan.sign_letter.steps_5.desc")
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      modalContent: "modal/currentModalContent"
    })
  },
  methods: {
    closeModal() {
      console.log("closeModal");
      this.$emit("closeModal");
    },
    clickBtn() {
      this.$emit("click");
      this.$store.commit("modal/DESTROY_MODAL");
    }
  }
};
</script>

<style scoped lang="scss"></style>
