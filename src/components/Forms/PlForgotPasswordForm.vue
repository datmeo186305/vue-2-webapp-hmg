<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      @submit.prevent="handleSubmit(submit)"
      class="pl-space-between-content"
    >
      <ValidationProvider
        :name="$t('payday_loan.auth.phone_number')"
        rules="required|validPhoneNumberOrNotExistRule"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field"
          >{{ $t("payday_loan.auth.phone_number_login") }}
        </label>
        <pl-field>
          <pl-input
            v-model="params.mobile"
            left-icon="/img/pl/phone.svg"
            type="text"
            name="mobile"
            phone-number-only
            :placeholder="$t('payday_loan.auth.type_phone')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <div class="text-center pl-space-between-content">
        <pl-button
          :type="disableSubmitBtn ? 'button' : 'submit'"
          id="pl-forgot-pass-btn-submit"
          class="btn-primary btn-pl-auth-submit"
          :disabled="disableSubmitBtn"
        >
          {{ $t("payday_loan.auth.receive_otp") }}
        </pl-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlInput from "../Inputs/PlInput";
import PlField from "../Field/PlField";
import PlButton from "../Buttons/PlButton";
export default {
  name: "PlSignInForm",
  components: { PlButton, PlField, PlInput },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      params: {
        mobile: ""
      }
    };
  },
  computed: {
    disableSubmitBtn() {
      return this.disabledBtn || !this.params.mobile;
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    submit() {
      this.disabledBtn = true;

      // Re-enable after 1 seconds
      this.timeout = setTimeout(() => {
        this.disabledBtn = false;
      }, 1000);

      this.$emit("submitForm", {
        mobile: this.params.mobile.replace("+84", "0")
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "../../assets/scss/pl/pl-auth";
</style>
