<template>
  <div class="pl-input">
    <img :src="leftIcon" alt="" v-if="leftIcon" class="pl-input-left-icon" />
    <input
      :type="type"
      :placeholder="placeholder"
      v-on="listeners"
      :name="name"
      :value="value"
      v-model="inputVal"
      :disabled="disabled"
      v-numericOnly
      v-if="numericOnly"
    />
    <input
      v-else
      :type="type"
      :placeholder="placeholder"
      v-on="listeners"
      :name="name"
      :value="value"
      v-model="inputVal"
      :disabled="disabled"
    />
    <div class="pl-right-apply-discount">
      <div v-if="voucher && applyStatus" class="applied-discount-text">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="#007aff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.66667 11.0572L3.13807 8.5286C2.87772 8.26827 2.45561 8.26827 2.19526 8.5286C1.93491 8.78893 1.93491 9.21107 2.19526 9.4714L5.19526 12.4714C5.45561 12.7317 5.87772 12.7317 6.13807 12.4714L13.4714 5.13807C13.7317 4.87772 13.7317 4.45561 13.4714 4.19526C13.2111 3.93491 12.7889 3.93491 12.5286 4.19526L5.66667 11.0572Z"
            fill="#007aff"
          />
        </svg>
        <p>
          {{ $t("payday_loan.choose_amount.applied") }}
        </p>
      </div>
      <button
        type="button"
        id="apply-voucher-btn"
        @click="apply"
        :disabled="disabled || !inputVal"
        v-else
      >
        {{ $t("payday_loan.choose_amount.apply") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlApplyDiscount",
  props: {
    type: {
      type: String,
      default: "text"
    },
    leftIcon: {
      type: String,
      default: ""
    },
    rightIcon: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    numericOnly: {
      type: Boolean,
      default: false
    },
    applyStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPassword: false,
      voucher: null
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    isPassword() {
      return this.type === "password";
    },
    listeners() {
      let l = { ...this.$listeners };
      delete l.input;
      return l;
    }
  },
  watch: {
    applyStatus() {
      this.voucher = this.inputVal;
    },
    showPassword(toggle) {
      if (toggle) {
        this.setTypeText();
      } else {
        this.setTypePassword();
      }
    },
    type() {
      this.setShowPassword(!this.isPassword);
    }
  },
  created() {
    this.setShowPassword(!this.isPassword);
  },
  beforeDestroy() {
    this.setShowPassword(true);
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    setShowPassword(state) {
      this.showPassword = state;
    },
    setTypePassword() {
      this.$el.getElementsByTagName("input")[0].type = "password";
    },
    setTypeText() {
      this.$el.getElementsByTagName("input")[0].type = "text";
    },
    apply() {
      this.voucher = this.inputVal;
      this.$emit("applyVoucher", this.voucher);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.pl-input {
  background: $grey-00;
  border-radius: 4px;
  width: 100%;

  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  padding: 12.5px 12px 11.5px;
  border: none;
  outline: none;
  display: flex;
  justify-content: space-between;
  color: $grey-08;

  input {
    padding: 0;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    width: 100%;
    border: none;
    background-color: transparent;
    outline: none;
    color: $grey-08;
    &::placeholder {
      color: $grey-06;
    }

    &:focus-visible {
      border: none;
      outline: none;
    }
  }

  .pl-input-left-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .pl-input-right-icon {
    margin-left: 8px;
    width: 20px;
    height: 20px;
  }

  .pl-input-password-right-icon {
    cursor: pointer;
  }
}

.pl-right-apply-discount {
  width: auto;
  flex: none;

  p {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: right;
    color: $system-color-blue;
  }

  button {
    width: 58px;
    padding: 0;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: right;
    color: $system-color-blue;
    border: none;
    background: transparent;

    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }
}

.applied-discount-text {
  display: flex;
  gap: 8px;
}
</style>
