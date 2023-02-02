<template>
  <modal
    :type="modalType"
    :id="'payday-loan-guide-sign-contract'"
    :ariaLabelledby="'myModalLabel-15'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-guide-sign-contract-content">
        <img :src="'/img/pl/dismiss.svg'" alt="" class="dismiss-modal-btn" @click="closeModal"/>
        <p class="pl-modal-guide-sign-contract-title">
          {{ $t("payday_loan.sign_contract.modal_title") }}
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
          <div class="pl-divider" v-if="index < steps.length"/>
        </section>
      </div>
      <div class="text-center pl-sign-contract-btn">
        <pl-button class="btn-primary" @click="clickBtn"
          >{{ $t("payday_loan.sign_contract.understand") }}
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
  name: "PlGuideSignContractModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_GUIDE_SIGN_CONTRACT,
      steps: [
        {
          step_text: this.$t("payday_loan.sign_contract.steps_1.step_text"),
          title: this.$t("payday_loan.sign_contract.steps_1.title"),
          desc: this.$t("payday_loan.sign_contract.steps_1.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_contract.steps_2.step_text"),
          title: this.$t("payday_loan.sign_contract.steps_2.title"),
          desc: this.$t("payday_loan.sign_contract.steps_2.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_contract.steps_3.step_text"),
          title: this.$t("payday_loan.sign_contract.steps_3.title"),
          desc: this.$t("payday_loan.sign_contract.steps_3.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_contract.steps_4.step_text"),
          title: this.$t("payday_loan.sign_contract.steps_4.title"),
          desc: this.$t("payday_loan.sign_contract.steps_4.desc")
        },
        {
          step_text: this.$t("payday_loan.sign_contract.steps_5.step_text"),
          title: this.$t("payday_loan.sign_contract.steps_5.title"),
          desc: this.$t("payday_loan.sign_contract.steps_5.desc")
        }
      ]
    };
  },
  methods: {
    closeModal() {
      console.log("closeModal");
      this.$emit("closeModal")
    },
    clickBtn() {
      this.$emit("click");
      this.$store.commit("modal/DESTROY_MODAL");
    }
  },
  computed: {
    ...mapGetters({
      modalContent: "modal/currentModalContent"
    })
  }
};
</script>

<style scoped lang="scss"></style>
