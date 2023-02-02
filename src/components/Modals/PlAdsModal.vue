<template>
  <modal
    :type="modalType"
    :id="'payday-loan-ads'"
    :ariaLabelledby="'myModalLabel-13'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <pl-womens-day/>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import PlWomensDay from "../Ads/PlWomensDay";

export default {
  name: "PlAdsModal",
  components: {PlWomensDay, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_ADS
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
