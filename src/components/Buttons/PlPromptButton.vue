<template>
  <button
    :type="type"
    :id="id"
    @click="clickBtn"
    class="pl-prompt-btn"
    :class="{ 'btn-disabled': disabled }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "PlPromptButton",
  props: {
    id: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "button"
    },
    to: {
      type: Object,
      default: null
    },
    disabled: Boolean
  },
  methods: {
    clickBtn() {
      if (this.to) {
        this.$router.push(this.to);
      }
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
.pl-prompt-btn {
  width: 160px;
  height: 48px;
  background: $white;
  box-shadow: inset 0px 1px 0px $grey-01;


  &[type="button"]:not(:disabled),
  &[type="reset"]:not(:disabled),
  &[type="submit"]:not(:disabled),
  &button:not(:disabled) {
    cursor: pointer;
  }
}

.pl-prompt-btn.btn-primary:not(:disabled):not(.disabled).active:focus,
.pl-prompt-btn.btn-primary:not(:disabled):not(.disabled):active:focus,
.show > .pl-prompt-btn.btn-primary.dropdown-toggle:focus,
.pl-prompt-btn.btn-primary:focus,
.pl-prompt-btn.btn-secondary:focus {
  box-shadow: inset 0px 1px 0px $grey-01;
  outline: none;
}

.pl-prompt-btn.btn-primary {
  letter-spacing: 0.1px;
  color: $monex-color-00;
  border: none !important;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    border: none !important;
    color: $system-color-green;
    background: $white;
  }

  &.btn-disabled {
    background: $grey-11;
    color: $grey-12;
    border: none !important;
  }

  &.btn-disabled:hover {
    cursor: auto;
  }
}

.pl-prompt-btn.btn-secondary {
  border: none !important;
  cursor: pointer;
  color: $grey-10;

  &:hover,
  &:active,
  &:focus {
    border: none !important;
    background: $white;
    color: $grey-06;
  }

  &.btn-disabled {
    background: $grey-11;
    color: $grey-12;
    border: none !important;
  }

  &.btn-disabled:hover {
    cursor: auto;
  }

  &:not(:disabled):not(.disabled):active:focus {
    box-shadow: inset 0px 1px 0px $grey-01;
  }
}

@media (max-width: 768px) {
  .pl-prompt-btn {
    max-width: 271px;
  }
}
</style>
