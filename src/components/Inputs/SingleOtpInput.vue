<template>
  <div class="single-otp-input">
    <input
      ref="input"
      :type="inputType"
      min="0"
      max="9"
      maxlength="1"
      pattern="[0-9]"
      :placeholder="placeholder"
      v-model="model"
      :class="inputClasses"
      :disabled="disabled"
      @input="handleOnChange"
      @keydown="handleOnKeyDown"
      @paste="handleOnPaste"
      @focus="handleOnFocus"
      @blur="handleOnBlur"
    />
    <span v-if="!isLastChild && separator">
      <span v-html="separator"/>
    </span>

    <div
      v-if="displayStatusLine"
      class="otp-status-line"
      :class="{ active: model }"
    />
  </div>
</template>

<script>
export default {
  name: "SingleOtpInput",
  props: {
    value: {
      type: String
    },
    separator: {
      type: String
    },
    placeholder: {
      type: String,
      default: "0"
    },
    focus: {
      type: Boolean
    },
    displayStatusLine: {
      type: Boolean,
      default: false
    },
    inputClasses: {
      type: String
    },
    shouldAutoFocus: {
      type: Boolean
    },
    inputType: {
      type: String,
      default() {
        return "tel";
      }
    },
    isLastChild: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: this.value || ""
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.model = newValue;
      }
    },
    // whenever question changes, this function will run
    focus(newFocusValue, oldFocusValue) {
      // Check if focusedInput changed
      // Prevent calling function if input already in focus
      if (oldFocusValue !== newFocusValue && this.$refs.input && this.focus) {
        this.$refs.input.focus();
        this.$refs.input.select();
      }
    }
  },
  mounted() {
    if (this.$refs.input && this.focus && this.shouldAutoFocus) {
      this.$refs.input.focus();
    }
  },
  methods: {
    handleOnChange() {
      if (this.model.length > 1) {
        this.model = this.model.slice(0, 1);
      }
      return this.$emit("on-change", this.model);
    },
    handleOnKeyDown(event) {
      // Only allow characters 0-9, DEL, Backspace and Pasting
      const keyEvent = event || window.event;
      const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode;
      if (
        this.isCodeNumeric(charCode) ||
        charCode === 8 ||
        charCode === 86 ||
        charCode === 46
      ) {
        this.$emit("on-keydown", event);
      } else {
        keyEvent.preventDefault();
      }
    },
    isCodeNumeric(charCode) {
      // numeric keys and numpad keys
      return (
        (charCode >= 48 && charCode <= 57) ||
        (charCode >= 96 && charCode <= 105)
      );
    },
    handleOnPaste(event) {
      return this.$emit("on-paste", event);
    },
    handleOnFocus() {
      this.$refs.input.select();
      return this.$emit("on-focus");
    },
    handleOnBlur() {
      return this.$emit("on-blur");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/assets/scss/variables";
.single-otp-input {
  align-items: center;
  padding: 0 2px;
  line-height: 2.4rem;

  input {
    margin: 0;
    height: 40px;
    width: 40px;
  }
}

.otp-status-line {
  width: 100%;
  height: 2px;
  border-radius: 3px;
  background-color: $grey-04;
  transition: background-color 0.5s ease;
}

.otp-status-line.active {
  background-color: $monex-color-00;
  transition: background-color 0.5s ease;
}
</style>
