<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <ValidationProvider
        :name="$t('auth.phone_number')"
        rules="required|validPhoneNumber"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field"
          >{{ $t("payday_loan.type_phone") }}
        </label>
        <pl-field>
          <pl-input
            v-model="mobile"
            type="text"
            name="mobile"
            numericOnly
            :placeholder="$t('payday_loan.type_phone')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <div class="text-center pl-space-between-box">
        <pl-button type="submit" class="btn-primary" :disabled="disabledBtn">
          {{ $t("common.continue") }}
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
  name: "PlSigningForm",
  components: { PlButton, PlField, PlInput },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      mobile: ""
    };
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

      this.$emit("sendOtp", this.mobile);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-signing-otp";
</style>