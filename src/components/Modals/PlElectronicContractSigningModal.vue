<template>
  <modal
    :type="modalType"
    :id="'pl-electronic-contract-signing-modal'"
    :ariaLabelledby="'myModalLabel-8'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div>
        <p class="dismiss-modal-btn" @click="closeModal">
          {{ $t("common.cancel") }}
        </p>
        <p class="pl-electronic-signing-modal-title">
          {{ $t("payday_loan.electronic_signing.title") }}
        </p>

        <div class="electronic-signing-area">
          <p id="pl-electronic-signing-guide">
            {{ $t("payday_loan.electronic_signing.signing_guide") }}
          </p>
          <div></div>
          <div class="pl-resign-btn-container">
            <a href="javascript:void(0)" @click="reSign" class="pl-resign-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
                class="pl-inline-block"
              >
                <path
                  d="M3.8986 3.1621V5.45806C3.8986 5.81672 4.18935 6.10746 4.548 6.10746H6.84397C7.20265 6.10746 7.49338 5.81672 7.49338 5.45806C7.49338 5.09941 7.20265 4.80866 6.84397 4.80866L6.31021 4.808C8.05612 3.76367 10.3517 3.99349 11.8557 5.49746C13.6309 7.27272 13.6309 10.1509 11.8557 11.9262C10.0805 13.7014 7.20225 13.7014 5.427 11.9262C4.34652 10.8457 3.89423 9.32018 4.17804 7.84712C4.24588 7.49492 4.0154 7.15442 3.66322 7.08658C3.31104 7.01872 2.97054 7.24918 2.9027 7.60138C2.53819 9.49332 3.12011 11.456 4.50861 12.8446C6.79106 15.127 10.4917 15.127 12.7741 12.8446C15.0565 10.5621 15.0565 6.86152 12.7741 4.57907C10.7092 2.51416 7.48358 2.31735 5.19742 3.98865L5.1974 3.1621C5.1974 2.80344 4.90665 2.5127 4.548 2.5127C4.18935 2.5127 3.8986 2.80344 3.8986 3.1621Z"
                  fill="#ffffff"
                />
              </svg>
              <span class="pl-resign-text">{{
                $t("payday_loan.electronic_signing.re_sign")
              }}</span>
            </a>
          </div>
        </div>

        <div class="text-center pl-space-between-content">
          <pl-button
            id="btn-accept-signing"
            type="button"
            @click="submit"
            class="btn-primary btn-next-signing-otp"
            :disabled="disableBtnNext"
          >
            {{ $t("common.confirm") }}
          </pl-button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { mapGetters } from "vuex";
import { MODAL_TYPE } from "../../helpers/constants";
import PlButton from "../Buttons/PlButton";

export default {
  name: "PlElectronicContractSigningModal",
  components: { PlButton, Modal },
  data() {
    return {
      modalType: MODAL_TYPE.PL_ELECTRONIC_SINGING,
      disableBtnNext: true,
      signature: null
    };
  },
  computed: {
    ...mapGetters({
      modalContent: "modal/currentModalContent"
    })
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    },
    submit() {},
    reSign() {
      this.$emit("reSign");
    }
  }
};
</script>

<style scoped></style>
