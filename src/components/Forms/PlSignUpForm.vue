<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form
      ref="signUpForm"
      @submit.prevent="handleSubmit(submit)"
      class="pl-space-between-content"
    >
      <!--  Phone number  -->
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

      <!--  Guide to type password  -->
      <div class="pl-guide-to-type-password pl-space-between-content">
        {{ $t("payday_loan.auth.strong_password") }}
      </div>

      <!--  Confirm policy  -->
      <div class="pl-confirm-policy-sign-up pl-space-between-content">
        <div class="pl-confirm-policy-box">
          <ValidationProvider
            :name="$t('payday_loan.auth.confirm_policy')"
            rules="isConfirmed"
            v-slot="{ passed, errors }"
          >
            <pl-field>
              <pl-checkbox v-model="confirmPolicy" />
              <p
                v-html="$t('payday_loan.auth.confirm_policy')"
                class="pl-confirm-policy"
              />
            </pl-field>
            <div class="pl-invalid-feedback" v-if="errors[0]">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
      </div>

      <div class="text-center pl-space-between-content">
        <pl-button
          :type="disableSubmitBtn ? 'button' : 'submit'"
          id="pl-sign-up-btn-submit"
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
import PlCheckbox from "../Inputs/PlCheckbox";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "PlSignInForm",
  components: { PlCheckbox, PlButton, PlField, PlInput },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      params: {
        mobile: "",
        password: "",
        confirmPassword: ""
      },
      confirmPolicy: false
    };
  },
  computed: {
    ...mapGetters({
      currentSigningOtpMobile: "paydayLoan/currentSigningOtpMobile"
    }),
    disableSubmitBtn() {
      return (
        this.disabledBtn ||
        !this.confirmPolicy ||
        !this.params.mobile ||
        !this.params.password ||
        !this.params.confirmPassword
      );
    }
  },
  watch: {
    "$store.state.paydayLoan.signingOtpMobile": {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (!newVal) this.resetParams();
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
    this.resetParams();
  },
  methods: {
    submit() {
      if (this.disabledBtn || !this.confirmPolicy) return;
      this.disabledBtn = true;

      // Re-enable after 1 seconds
      this.timeout = setTimeout(() => {
        this.disabledBtn = false;
      }, 1000);

      this.$emit("submitForm", {
        mobile: this.params.mobile.replace("+84", "0"),
        password: this.params.password,
        confirmPassword: this.params.confirmPassword
      });
    },
    resetParams() {
      this.params.mobile = null;
      this.params.password = null;
      this.params.confirmPassword = null;
      requestAnimationFrame(() => {
        if (this.$refs.observer) {
          this.$refs.observer.reset();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
