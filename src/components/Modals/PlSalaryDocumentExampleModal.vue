<template>
  <modal
    :type="modalType"
    :id="'payday-loan-salary-document-example'"
    :ariaLabelledby="'myModalLabel-26'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    :showTopCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-salary-example-body">
        <img
          :src="'/img/pl/dismiss.svg'"
          alt=""
          class="dismiss-modal-btn"
          @click="closeModal"
        />
        <div class="row g-2 g-md-1 g-lg-2 gap-2">
          <div class="col-12">
            <p class="pl-modal-salary-example-title">
              {{ $t("payday_loan.choose_amount.salary_example_title") }}
            </p>
            <div class="pl-modal-salary-example-content">
              <img :src="'/img/pl/salary-example.png'" alt="example" />
            </div>
          </div>

          <div class="pl-divider"></div>

          <div class="col-12">
            <p class="pl-modal-salary-example-title">
              {{ $t("payday_loan.choose_amount.sample_timesheet_title") }}
            </p>
            <div class="pl-modal-salary-example-content">
              <img :src="'/img/pl/sample-timesheet.png'" alt="example" />
            </div>
          </div>
        </div>

      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import {mapMutations} from "vuex";

export default {
  name: "PlSalaryDocumentExampleModal",
  components: { Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_SALARY_DOCUMENT_EXAMPLE
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
      this.$emit("click");
      this.destroyModal();
    }
  }
};
</script>

<style scoped lang="scss"></style>
