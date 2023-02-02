<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      @submit.prevent="handleSubmit(submit)"
      class="pl-space-between-content"
    >
      <!--  password  -->
      <ValidationProvider
        vid="password"
        :name="$t('payday_loan.auth.password')"
        rules="required|min:6|max:50"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.auth.password") }}
        </label>
        <pl-field>
          <pl-input
            v-model="params.password"
            left-icon="/img/pl/password.svg"
            type="password"
            name="mobile"
            :placeholder="$t('payday_loan.auth.type_password')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Confirm password  -->
      <ValidationProvider
        :name="$t('payday_loan.auth.password')"
        rules="required|confirmed:password"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.auth.repeat_password") }}
        </label>
        <pl-field>
          <pl-input
            v-model="params.confirmPassword"
            left-icon="/img/pl/password.svg"
            type="password"
            name="mobile"
            :placeholder="$t('payday_loan.auth.type_repeat_password')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <div class="text-center pl-space-between-content">
        <pl-button
          :type="disableSubmitBtn ? 'button' : 'submit'"
          id="pl-reset-pass-btn-submit"
          class="btn-primary btn-pl-auth-submit"
          :disabled="disableSubmitBtn"
        >
          {{ $t("common.confirm") }}
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
  name: "PlResetPasswordForm",
  components: { PlButton, PlField, PlInput },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      params: {
        password: "",
        confirmPassword: ""
      }
    };
  },
  computed: {
    disableSubmitBtn() {
      return (
        this.disabledBtn ||
        !this.params.password ||
        !this.params.confirmPassword
      );
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

      this.$emit("submitForm", this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
