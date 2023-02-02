<template>
  <modal
    :type="modalType"
    :id="'payday-loan-notification-success'"
    :ariaLabelledby="'myModalLabel-03'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-success-content-container">
        <div class="text-center">
          <img
            src="/img/pl/success-prompt-icon.png"
            alt=""
            class="gif-resource"
          />

          <p class="pl-modal-success-title" v-if="modalContent">
            {{ modalContent.title }}
          </p>
          <p class="pl-modal-success-content" v-if="modalContent">
            {{ modalContent.content }}
          </p>
        </div>
      </div>
      <slot name="actions" v-if="modalContent">
        <div class="text-center pl-modal-success-btn">
          <pl-button class="btn-primary" @click="clickBtn">{{
            modalContent.btnText
          }}</pl-button>
        </div>
      </slot>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import PlButton from "../Buttons/PlButton";
import { mapGetters } from "vuex";
export default {
  name: "PlSuccessNotificationModal",
  components: { PlButton, Modal },
  data() {
    return {
      modalType: MODAL_TYPE.PL_SUCCESS_NOTIFICATION
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
    },
    clickBtn() {
      this.$emit("click");
      this.$store.commit("modal/DESTROY_MODAL");
    }
  }
};
</script>

<style scoped lang="scss"></style>
