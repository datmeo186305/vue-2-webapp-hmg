<template>
  <modal
    :type="modalType"
    :id="'pl-confirm-finalization-modal'"
    :ariaLabelledby="'myModalLabel-26'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    :showTopCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-confirm-finalization-body text-center">
        <!--        <p class="pl-modal-confirm-finalization-title">-->
        <!--          {{ $t("payday_loan.choose_payment_method.confirm_finalization_title") }}-->
        <!--        </p>-->
        <img src="/img/pl/gif/Coffee.gif" alt="" class="gif-resource"/>

        <p class="pl-modal-confirm-finalization-content">
          {{
            $t(
              "payday_loan.choose_payment_method.confirm_finalization_content",
              { minute: 10 }
            )
          }}
        </p>
        <div class="text-center pl-confirm-finalization-btn">
          <pl-button
            class="btn-primary"
            id="close-confirm-finalization-btn"
            @click="clickBtn"
            >{{ $t("common.continue") }}
          </pl-button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import PlButton from "../Buttons/PlButton";
import { mapMutations } from "vuex";

export default {
  name: "PlConfirmFinalizationModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_CONFIRM_FINALIZATION
    };
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    closeModal() {
      this.$emit("closeModal");
      this.destroyModal();
    },
    clickBtn() {
      this.$emit("confirm");
      this.destroyModal();
    }
  }
};
</script>

<style scoped lang="scss"></style>
