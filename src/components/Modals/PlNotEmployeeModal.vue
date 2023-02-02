<template>
  <modal
    :type="modalType"
    :id="'payday-loan-error'"
    :ariaLabelledby="'myModalLabel-14'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-error-content-container">
        <p class="pl-modal-error-title" v-if="modalContent">
          {{ modalContent.title }}
        </p>
        <p class="pl-modal-error-content" v-if="modalContent">
          {{ modalContent.content }}
        </p>
      </div>
      <div class="text-center pl-modal-error-btn">
        <pl-button class="btn-primary" @click="clickBtn"
          >{{ $t("common.ok") }}
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
  name: "PlNotEmployeeModal",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_NOT_EMPLOYEE
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
  },
  computed: {
    ...mapGetters({
      modalContent: "modal/currentModalContent"
    })
  }
};
</script>

<style scoped lang="scss"></style>
