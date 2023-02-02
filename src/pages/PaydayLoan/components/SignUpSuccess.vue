<template>
  <div class="pl-sign-up-success-container">
    <img :src="'/img/pl/check-mark.svg'" alt="" class="pl-check-mark-icon" />
    <slot name="title">
      <h2 class="pl-sign-up-success-title pl-space-between-content">
        {{ title }}
      </h2>
    </slot>
    <slot name="body">
      <div class="pl-sign-up-success-body pl-space-between-content">
        <p class="pl-sign-up-success-body-text" v-html="bodyText" />
      </div>
    </slot>
    <slot name="footer">
      <div class="text-center pl-space-between-content">
        <pl-button
          id="sign-up-success-btn"
          type="submit"
          class="btn-primary btn-sign-up-success"
          :disabled="disabledBtn"
          @click="btnClick"
        >
          {{ btnText }}
        </pl-button>
      </div>
    </slot>
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import i18n from "./../../../lang/i18n";
export default {
  name: "SignUpSuccess",
  components: { PlButton },
  props: {
    title: {
      type: String,
      default: ""
    },
    bodyText: {
      type: String,
      default: ""
    },
    disabledBtn: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: i18n.t("common.continue")
    }
  },
  methods: {
    btnClick() {
      this.$emit("btnClick");
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-auth";
</style>
