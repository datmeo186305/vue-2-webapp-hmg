<template>
  <div class="pl-checkbox" :class="[checkClasses]">
    <div class="pl-checkbox-box">
      <div class="pl-checkbox-container" @click.stop="toggleCheck">
        <pl-ripple
            pl-centered
            :pl-active.sync="rippleActive"
            :pl-disabled="disabled"
        >
          <input
              :id="id"
              type="checkbox"
              v-bind="attrs"
              :indeterminate.prop="indeterminate"
          />
        </pl-ripple>
      </div>
    </div>

    <label
      :for="id"
      class="pl-checkbox-label"
      v-if="$slots.default"
      @click.prevent="toggleCheck"
    >
      <slot />
    </label>
  </div>
</template>

<script>
import PlRipple from "../Ripple/PlRipple";
import PlUuid from "@/core/utils/PlUuid";

export default {
  name: "PlCheckbox",
  comments: {
    PlRipple
  },
  components: { PlRipple },
  model: {
    prop: "model",
    event: "change"
  },
  props: {
    id: {
      type: String,
      default: () => "pl-checkbox-" + PlUuid()
    },
    model: [String, Boolean, Object, Number, Array],
    value: {
      type: [String, Boolean, Object, Number]
    },
    name: [String, Number],
    required: Boolean,
    disabled: Boolean,
    indeterminate: Boolean,
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    }
  },
  data: () => ({
    rippleActive: false
  }),
  computed: {
    attrs() {
      const attrs = {
        id: this.id,
        name: this.name,
        disabled: this.disabled,
        required: this.required,
        "true-value": this.trueValue,
        "false-value": this.falseValue
      };

      if (this.value) {
        if (typeof this.value !== "object") {
          attrs.value = String(this.value);
        }
      }

      return attrs;
    },
    isSelected() {
      if (this.isModelArray) {
        return this.model.includes(this.value);
      }

      if (this.hasValue) {
        return this.model === this.value;
      }

      return this.model === this.trueValue;
    },
    isModelArray() {
      return Array.isArray(this.model);
    },
    checkClasses() {
      return {
        "pl-checked": this.isSelected,
        "pl-disabled": this.disabled,
        "pl-required": this.required,
        "pl-indeterminate": this.indeterminate
      };
    },
    hasValue() {
      // eslint-disable-next-line no-prototype-builtins
      return this.value;
    }
  },
  methods: {
    removeItemFromModel(newModel) {
      const index = newModel.indexOf(this.value);

      if (index !== -1) {
        newModel.splice(index, 1);
      }
    },
    handleArrayCheckbox() {
      const newModel = this.model;

      if (!this.isSelected) {
        newModel.push(this.value);
      } else {
        this.removeItemFromModel(newModel);
      }

      this.$emit("change", newModel);
    },
    handleSingleSelectCheckbox() {
      this.$emit("change", this.isSelected ? null : this.value);
    },
    handleSimpleCheckbox() {
      this.$emit("change", this.isSelected ? this.falseValue : this.trueValue);
    },
    toggleCheck() {
      if (!this.disabled) {
        this.rippleActive = true;

        if (this.isModelArray) {
          this.handleArrayCheckbox();
        } else if (this.hasValue) {
          this.handleSingleSelectCheckbox();
        } else {
          this.handleSimpleCheckbox();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.pl-checkbox {
  width: auto;
  padding-left: 2px;
  display: inline-flex;
  position: relative;

  &:not(.pl-disabled) {
    cursor: pointer;

    .pl-checkbox-label {
      cursor: pointer;
    }
  }

  .pl-checkbox-container {
    border: 2px solid $grey-08 !important;
    width: $pl-radio-size;
    min-width: $pl-radio-size;
    height: $pl-radio-size;
    position: relative;
    border-radius: 2px;
    transition: $pl-transition-stand;

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
      width: $pl-checkbox-touch-size;
      height: $pl-checkbox-touch-size;
      top: 50%;
      left: 50%;
      z-index: 11;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    &:after {
      width: 5px;
      height: 13px;
      top: 0;
      left: 5px;
      z-index: 12;
      border: 2px solid transparent;
      border-top: 0;
      border-left: 0;
      opacity: 0;
      transform: rotate(45deg) scale3D(0.15, 0.15, 1);
    }

    .pl-ripple {
      width: $pl-checkbox-touch-size !important;
      height: $pl-checkbox-touch-size !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }

    input {
      position: absolute;
      left: -999em;
    }
  }

  .pl-checkbox-label {
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

.pl-checkbox.pl-indeterminate {
  .pl-checkbox-container {
    &:after {
      width: 12px;
      height: 2px;
      top: 50%;
      left: 50%;
      z-index: 7;
      border-style: solid;
      border-width: 0 0 2px;
      opacity: 0;
      transform: translate(-50%, -50%) !important;
    }
  }
}

.pl-checkbox.pl-checked {
  .pl-checkbox-container {
    &:after {
      opacity: 1;
      transform: rotate(45deg) scale3D(1, 1, 1);
      transition: $pl-transition-stand;
    }
  }
}

.pl-checkbox.pl-disabled.pl-checked {
  .pl-checkbox-container {
    border-color: transparent !important;
  }
}

.pl-checkbox.pl-required {
  label:after {
    position: absolute;
    top: 5px;
    right: 0;
    transform: translateX(calc(100% + 2px));
    background : url("/img/pl/mandatory.svg") no-repeat;
    content : "";
    line-height: 1em;
    vertical-align: top;
  }
}

.pl-checkbox.pl-checked .pl-checkbox-container:after {
  border-color: $monex-color-00 !important;
  top: 0;
  left: 5px;
}

.pl-checkbox-box {
  padding: 3px;
}
</style>
