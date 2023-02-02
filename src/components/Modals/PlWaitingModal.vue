<template>
  <modal
    :type="modalType"
    :id="'payday-loan-waiting'"
    :ariaLabelledby="'myModalLabel-18'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-waiting-content-container">
        <img src="/img/pl/gif/Coffee.gif" alt="" class="gif-resource"/>

        <p class="pl-modal-waiting-title" v-if="modalContent">
          {{ modalContent.title }}
        </p>
        <p
          class="pl-modal-waiting-content"
          v-if="modalContent"
          v-html="modalContent.content"
        />
      </div>
      <div class="text-center pl-modal-waiting-btn">
        <pl-button class="btn-primary" v-if="modalContent">
          <a :href="modalContent.btnLink" v-if="modalContent.btnLink">{{
            modalContent.btnText
          }}</a>
          <a v-else href="javascript:void(0)" @click="clickBtn">{{
            modalContent.btnText
          }}</a>
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
  name: "PlWaitingModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_WAITING
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
