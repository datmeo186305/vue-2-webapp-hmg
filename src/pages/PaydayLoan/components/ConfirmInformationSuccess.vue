<template>
  <div id="confirm-information-success-container">
    <div class="text-center">
      <img
        :src="'/img/pl/email.svg'"
        alt="email"
        class="pl-inline-block sent-email-img"
      />
    </div>
    <p
      class="pl-space-between-content sent-email-text"
      v-html="
        $t('payday_loan.confirm_information.email_sent', { email: email })
      "
    />
    <div class="pl-space-between-content">
      <pl-button
        id="guide-sign-contract-btn"
        type="button"
        class="btn-secondary"
        @click="seeTheInstructions"
      >
        {{ $t("payday_loan.confirm_information.guide_sign_contract") }}
      </pl-button>
    </div>

    <!--  Modals guide sign letter term of service -->
    <pl-guide-sign-letter-term-of-service-modal
      @click="closeSuccessModal"
      @closeModal="closeSuccessModal"
    />
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import { MODAL_TYPE } from "../../../helpers/constants";
import { mapMutations } from "vuex";
import PlGuideSignLetterTermOfServiceModal from "../../../components/Modals/PlGuideSignLetterTermOfServiceModal";
export default {
  name: "ConfirmInformationSuccess",
  components: { PlGuideSignLetterTermOfServiceModal, PlButton },
  props: ["email"],
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    seeTheInstructions() {
      this.showModal({ type: MODAL_TYPE.PL_GUIDE_SIGN_LETTER_TERM_OF_SERVICE });
    },
    closeSuccessModal() {
      this.destroyModal();
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
#confirm-information-success-container {
  text-align: center;
  max-width: 343px;
  margin: 0 auto;

  img.sent-email-img {
    width: 80px;
    height: 80px;
  }

  .sent-email-text {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding: 0 32px;

    /* Monex Color / 01 */

    color: $monex-color-01;
  }
  .guide-sign-contract {
    background-color: $grey-00;
    border-radius: 4px;
    min-height: 329px;

    .guide-sign-contract-title {
      font-family: $sfUiDisplay;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      margin: 0;
      padding-top: 16px;
      /* identical to box height */

      text-align: center;

      /* Grey / 08 */

      color: $grey-08;
    }
  }
}

#guide-sign-contract-btn {
  max-width: 200px;
}
</style>
