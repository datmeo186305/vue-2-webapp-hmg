<template>
  <div class="pl-radio" :class="[radioClasses]">
    <div class="pl-radio-container" @click.stop="toggleCheck">
      <pl-ripple
        pl-centered
        :pl-active.sync="rippleActive"
        :pl-disabled="disabled"
      >
        <input
          type="radio"
          v-bind="{ id, name, disabled, required, value, checked: isSelected }"
          class="pl-radio"
          :id="`pl-radio-${id}`"
        />
      </pl-ripple>
    </div>
    <label
      :for="`pl-radio-${id}`"
      class="pl-radio-label"
      v-if="$slots.default"
      @click.prevent="toggleCheck"
    >
      <slot />
    </label>
  </div>
</template>

<script>
import PlUuid from "@/core/utils/PlUuid";
import PlRipple from "../Ripple/PlRipple";
export default {
  name: "PlRadio",
  components: { PlRipple },
  model: {
    prop: "model",
    event: "change"
  },
  props: {
    model: [String, Number, Boolean, Object],
    value: {
      type: [String, Number, Boolean, Object],
      default: "on"
    },
    id: {
      type: String,
      default: () => "pl-radio-" + PlUuid()
    },
    name: [String, Number],
    required: Boolean,
    disabled: Boolean
  },
  data: () => ({
    rippleActive: false
  }),
  computed: {
    isSelected() {
      return this.model === this.value;
    },
    radioClasses() {
      return {
        "pl-checked": this.isSelected,
        "pl-disabled": this.disabled,
        "pl-required": this.required
      };
    }
  },
  methods: {
    toggleCheck() {
      if (!this.disabled) {
        this.rippleActive = true;
        this.$emit("change", this.value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
.pl-radio {
  padding-left: 2px;
  width: auto;
  margin-right: 32px;
  display: inline-flex;
  position: relative;

  &:not(.pl-disabled) {
    cursor: pointer;

    .pl-radio-label {
      cursor: pointer;
    }
  }

  .pl-radio-container {
    border: 1.5px solid $grey-10 !important;
    width: $pl-radio-size;
    min-width: $pl-radio-size;
    height: $pl-radio-size;
    top: 2px;
    -webkit-transition: 0.2s !important;
    border-radius: 50%;
    position: relative;
    transform: scale3D(1, 1, 1);

    &:focus {
      outline: none;
    }

    &:before,
    &:after {
      position: absolute;
      transition: $pl-transition-drop;
      content: " ";
    }

    &:before {
      width: $pl-radio-touch-size;
      height: $pl-radio-touch-size;
      top: 50%;
      left: 50%;
      z-index: 6;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      transition: 0.4s cubic-bezier(0.55, 0, 0.55, 0.2);
      content: " ";
      box-sizing: inherit;
    }

    &:after {
      position: absolute;
      content: " ";
      opacity: 0;
      transform: scale3D(0, 0, 0);
      transition: 0.2s !important;
      right: 2.5px;
      bottom: 2.5px;
      top: 2.5px;
      left: 2.5px;
      border-radius: 100%;
    }

    input {
      position: absolute;
      left: -999em;
    }
  }

  label {
    margin-left: 8px;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 0;
    line-height: 24px;
    /* Grey / 08 */

    color: $grey-08;
  }
}

.pl-radio.pl-checked {
  .pl-radio-container {
    border-color: $monex-color-00 !important;
    transition: $pl-transition-stand;
  }

  .pl-radio-container:after {
    opacity: 1;
    transform: scaleX(1);
    background-color: $monex-color-00 !important;
  }
}

.pl-radio .pl-radio-container .pl-ripple {
  width: 48px!important;
  height: 48px!important;
  top: 50%!important;
  left: 50%!important;
  transform: translate(-50%,-50%);
  border-radius: 50%;
  -webkit-mask-image: none;
}

.pl-radio .pl-radio-container .pl-ripple .pl-ripple-wave {
  background-color: #9c27b0;
}
</style>
