<template>
  <modal
    :type="modalType"
    :id="'payday-loan-success'"
    :ariaLabelledby="'myModalLabel-07'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-success-content-container">
        <div class="text-center">
          <img src="/img/pl/gif/Celebrate.gif" alt="" class="gif-resource"/>

          <p class="pl-modal-success-title">{{ title }}</p>
          <p class="pl-modal-success-content">
            {{ content }}
          </p>
        </div>
      </div>
      <slot name="actions">
        <div class="text-center pl-modal-success-btn">
          <pl-button class="btn-primary" @click="clickBtn">{{
            btnText
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
export default {
  name: "PlSuccessModal",
  components: { PlButton, Modal },
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    btnText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalType: MODAL_TYPE.PL_SUCCESS
    };
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
