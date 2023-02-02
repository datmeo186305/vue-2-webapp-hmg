<template>
  <modal
      :type="modalType"
      :id="'payday-loan-type-otp-modal'"
      :ariaLabelledby="'myModalLabel-16'"
      :clickOutsideToClose="true"
      :showCloseBtn="false"
      @closeModal="closeModal"
  >
    <template slot="body">
      <div>
        <img
            :src="'/img/pl/dismiss.svg'"
            alt=""
            class="dismiss-modal-btn"
            @click="closeModal"
        />
        <pl-signing-o-t-p-form
            @verifyOtp="verifyOtp"
            @resendOtp="resendOtp"
            :mobile="mobile"
            :show-submit-button="false"
            :errorText="errorText"
        />
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import {mapGetters} from "vuex";
import {MODAL_TYPE} from "../../helpers/constants";
import PlSigningOTPForm from "../Forms/PlSigningOTPForm";
export default {
  name: "PlTypeOTPModal",
  components: {PlSigningOTPForm, Modal},
  props: {
    mobile: {},
    errorText: {}
  },
  data() {
    return {
      modalType: MODAL_TYPE.PL_TYPE_OTP,
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
    verifyOtp() {
      this.$emit("verifyOtp")
    },
    resendOtp() {
      this.$emit("resendOtp")
    }
  }
}
</script>

<style scoped>

</style>
