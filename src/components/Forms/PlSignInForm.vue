<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      @submit.prevent="handleSubmit(submit)"
      class="pl-space-between-content"
      id="pl-form-sign-in"
    >
      <ValidationProvider
        :name="$t('payday_loan.auth.phone_number')"
        rules="required|validPhoneNumber"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field"
          >{{ $t("payday_loan.auth.phone_number") }}
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

      <ValidationProvider
        :name="$t('payday_loan.auth.type_password')"
        rules="required"
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
            name="password"
            :placeholder="$t('payday_loan.auth.type_password')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <div class="link-to-pl-forgot-password">
        <router-link :to="{ name: 'PlForgotPassword' }"
          >{{ $t("payday_loan.auth.forgot_password_text") }}
        </router-link>
      </div>

      <div class="text-center pl-space-between-content">
        <pl-button
          type="submit"
          id="pl-sign-in-btn-submit"
          class="btn-primary btn-pl-auth-submit"
          :disabled="disabledBtn"
        >
          {{ $t("payday_loan.auth.login") }}
        </pl-button>
      </div>

      <button
        type="button"
        id="pl-app-sign-in-submit"
        hidden
        @click="appSubmit"
      >
        Submit
      </button>
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
        mobile: "",
        password: ""
      }
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

      this.$emit("submitForm", {
        mobile: this.params.mobile.replace("+84", "0"),
        password: this.params.password
      });
    },
    appSubmit() {
      let username = window.document.getElementsByName("mobile")[0].value;
      let password = window.document.getElementsByName("password")[0].value;
      this.$emit("submitForm", {
        mobile: username.replace("+84", "0"),
        password: password
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
