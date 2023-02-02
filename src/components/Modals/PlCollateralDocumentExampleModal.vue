<template>
  <modal
    :type="modalType"
    :id="'payday-loan-collateral-document-example'"
    :ariaLabelledby="'myModalLabel-25'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    :showTopCloseBtn="true"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-collateral-document-example-content">
        <img :src="'/img/pl/collateral-document.png'" alt="example"/>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";

export default {
  name: "PlCollateralDocumentExampleModal",
  components: { Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_COLLATERAL_DOCUMENT_EXAMPLE
    };
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