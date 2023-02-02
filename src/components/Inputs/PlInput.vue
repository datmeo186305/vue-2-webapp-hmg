<template>
  <div class="pl-input">
    <img :src="leftIcon" alt="" v-if="leftIcon" class="pl-input-left-icon" />
    <input
        v-if="numericOnly"
        v-numericOnly
      :type="type"
      :placeholder="placeholder"
      v-on="listeners"
      :name="name"
      :value="value"
      v-model="inputVal"
      :disabled="disabled"
    />
    <input
      v-else-if="phoneNumberOnly"
      v-phoneNumberOnly
      :type="type"
      :placeholder="placeholder"
      v-on="listeners"
      :name="name"
      :value="value"
      v-model="inputVal"
      :disabled="disabled"
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
    <img
      :src="rightIcon"
      alt=""
      v-if="rightIcon && type !== 'password'"
      class="pl-input-right-icon"
    />
    <img
      :src="
        showPassword ? '/img/pl/password-show.svg' : '/img/pl/password-hide.svg'
      "
      alt=""
      v-else-if="type === 'password'"
      class="pl-input-right-icon pl-input-password-right-icon"
      @click="togglePassword"
    />
  </div>
</template>

<script>
export default {
  name: "PlInput",
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
    phoneNumberOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPassword: false
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
</style>
