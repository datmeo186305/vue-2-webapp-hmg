<template>
  <button
    :type="type"
    :id="id"
    @click="clickBtn"
    class="pl-btn"
    :class="{ 'btn-disabled': disabled }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "PlButton",
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
.pl-btn {
  width: 330px;
  height: 48px;
  border-radius: 38px;

  &[type="button"]:not(:disabled),
  &[type="reset"]:not(:disabled),
  &[type="submit"]:not(:disabled),
  &button:not(:disabled) {
    cursor: pointer;
  }
}

.pl-btn.btn-primary:not(:disabled):not(.disabled).active:focus,
.pl-btn.btn-primary:not(:disabled):not(.disabled):active:focus,
.show > .pl-btn.btn-primary.dropdown-toggle:focus,
.pl-btn.btn-primary:focus,
.pl-btn.btn-secondary:focus {
  box-shadow: none;
  outline: none;
}

.pl-btn.btn-primary {
  background: $monex-color-00;
  border: none !important;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
      $monex-color-00;
    border: none !important;
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

.pl-btn.btn-secondary {
  background: $grey-01;
  border: none !important;
  cursor: pointer;
  color: $grey-08;

  &:hover,
  &:active,
  &:focus {
    background: $grey-02;
    border: none !important;
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
    box-shadow: none;
  }
}

@media (max-width: 768px) {
  .pl-btn {
    max-width: 271px;
  }
}
</style>
