<template>
  <v-select
    :options="options"
    v-model="inputVal"
    :value="inputVal"
    :searchable="searchable"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    v-on="inputListeners"
    :label="label"
    :appendToBody="appendToBody"
    :searchInputQuerySelector="searchInputQuerySelector"
    :selectOnKeyCodes="selectOnKeyCodes"
    :selectOnTab="selectOnTab"
    :dir="dir"
    :inputId="inputId"
    :noDrop="noDrop"
    :clearSearchOnBlur="clearSearchOnBlur"
    :resetOnOptionsChange="resetOnOptionsChange"
    :createOption="createOption"
    :filter="filter"
    :filterBy="filterBy"
    :filterable="filterable"
    :pushTags="pushTags"
    :tabindex="tabindex"
    :taggable="taggable"
    :onTab="onTab"
    :getOptionKey="getOptionKey"
    :getOptionLabel="getOptionLabel"
    :reduce="reduce"
    :components="components"
    :autocomplete="autocomplete"
    :closeOnSelect="closeOnSelect"
    :clearSearchOnSelect="clearSearchOnSelect"
    :transition="transition"
    class="pl-select"
  >
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        {{ $t("common.no_search_result") }} <em>{{ search }}</em
        >.
      </template>
      <em style="opacity: 0.5;" v-else>
        {{ $t("common.no_options") }}
      </em>
    </template>
    <template v-slot:open-indicator="">
      <img
        :src="'/img/pl/icon-right.svg'"
        alt="right"
        class="pl-icon-indicator vs__open-indicator"
      />
    </template>
  </v-select>
</template>

<script>
import vSelect from "vue-select";
export default {
  name: "PlSelect",
  components: {
    vSelect
  },
  props: {
    /**
     * Enable/disable filtering the options.
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: false
    },

    /**
     * Disable the entire component.
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Can the user clear the selected property.
     * @type {Boolean}
     */
    clearable: {
      type: Boolean,
      default: false
    },

    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * Sets a Vue transition property on the `.vs__dropdown-menu`.
     * @type {String}
     */
    transition: {
      type: String,
      default: "vs__fade"
    },

    /**
     * Enables/disables clearing the search text when an option is selected.
     * @type {Boolean}
     */
    clearSearchOnSelect: {
      type: Boolean,
      default: true
    },

    /**
     * Close a dropdown when an option is chosen. Set to false to keep the dropdown
     * open (useful when combined with multi-select, for example)
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },

    /**
     * Value of the 'autocomplete' field of the input
     * element.
     * @type {String}
     */
    autocomplete: {
      type: String,
      default: "off"
    },

    /**
     * An object with any custom components that you'd like to overwrite
     * the default implementation of in your app. The keys in this object
     * will be merged with the defaults.
     * @see https://vue-select.org/guide/components.html
     * @type {Function}
     */
    components: {
      type: Object,
      default: () => ({})
    },

    /**
     * Contains the currently selected value. Very similar to a
     * `value` attribute on an <input>. You can listen for changes
     * using 'change' event using v-on
     * @type {Object||String||null}
     */
    initValue: {
      type: [Object || String || null],
      default: Object
    },

    /**
     * Equivalent to the `placeholder` attribute on an `<input>`.
     * @type {String}
     */
    placeholder: {
      type: String,
      default: ""
    },
    /**
     * An array of strings or objects to be used as dropdown choices.
     * If you are using an array of objects, vue-select will look for
     * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
     * custom label key can be set with the `label` prop.
     * @type {Array}
     */
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Tells vue-select what key to use when generating option
     * labels when each `option` is an object.
     * @type {String}
     */
    label: {
      type: String,
      default: "label"
    },

    /**
     * When working with objects, the reduce
     * prop allows you to transform a given
     * object to only the information you
     * want passed to a v-model binding
     * or @input event.
     */
    reduce: {
      type: Function,
      default: option => option
    },

    /**
     * Decides whether an option is selectable or not. Not selectable options
     * are displayed but disabled and cannot be selected.
     *
     * @type {Function}
     * @since 3.3.0
     * @param {Object|String} option
     * @return {Boolean}
     */
    selectable: {
      type: Function
    },

    /**
     * Callback to generate the label text. If {option}
     * is an object, returns option[this.label] by default.
     *
     * Label text is used for filtering comparison and
     * displaying. If you only need to adjust the
     * display, you should use the `option` and
     * `selected-option` slots.
     *
     * @type {Function}
     * @param  {Object || String} option
     * @return {String}
     */
    getOptionLabel: {
      type: Function
    },

    /**
     * Generate a unique identifier for each option. If `option`
     * is an object and `option.hasOwnProperty('id')` exists,
     * `option.id` is used by default, otherwise the option
     * will be serialized to JSON.
     *
     * If you are supplying a lot of options, you should
     * provide your own keys, as JSON.stringify can be
     * slow with lots of objects.
     *
     * The result of this function *must* be unique.
     *
     * @type {Function}
     * @param  {Object || String} option
     * @return {String}
     */
    getOptionKey: {
      type: Function
    },

    /**
     * Select the current value if selectOnTab is enabled
     * @deprecated since 3.3
     */
    onTab: {
      type: Function,
      default: function() {
        if (this.selectOnTab && !this.isComposing) {
          this.typeAheadSelect();
        }
      }
    },

    /**
     * Enable/disable creating options from searchEl.
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: false
    },

    /**
     * Set the tabindex for the input field.
     * @type {Number}
     */
    tabindex: {
      type: Number,
      default: null
    },

    /**
     * When true, newly created tags will be added to
     * the options list.
     * @type {Boolean}
     */
    pushTags: {
      type: Boolean,
      default: false
    },

    /**
     * When true, existing options will be filtered
     * by the search text. Should not be used in conjunction
     * with taggable.
     * @type {Boolean}
     */
    filterable: {
      type: Boolean,
      default: true
    },

    /**
     * Callback to determine if the provided option should
     * match the current search text. Used to determine
     * if the option should be displayed.
     * @type   {Function}
     * @param  {Object || String} option
     * @param  {String} label
     * @param  {String} search
     * @return {Boolean}
     */
    filterBy: {
      type: Function,
      default(option, label, search) {
        return (label || "").toLowerCase().indexOf(search.toLowerCase()) > -1;
      }
    },

    /**
     * Callback to filter results when search text
     * is provided. Default implementation loops
     * each option, and returns the result of
     * this.filterBy.
     * @type   {Function}
     * @param  {Array} list of options
     * @param  {String} search text
     * @param  {Object} vSelect instance
     * @return {Boolean}
     */
    filter: {
      type: Function,
      default(options, search) {
        return options.filter(option => {
          let label = this.getOptionLabel(option);
          if (typeof label === "number") {
            label = label.toString();
          }
          return this.filterBy(option, label, search);
        });
      }
    },

    /**
     * User defined function for adding Options
     * @type {Function}
     */
    createOption: {
      type: Function,
      default(option) {
        return typeof this.optionList[0] === "object"
          ? { [this.label]: option }
          : option;
      }
    },

    /**
     * When false, updating the options will not reset the selected value. Accepts
     * a `boolean` or `function` that returns a `boolean`. If defined as a function,
     * it will receive the params listed below.
     *
     * @since 3.4 - Type changed to {Boolean|Function}
     *
     * @type {Boolean|Function}
     * @param {Array} newOptions
     * @param {Array} oldOptions
     * @param {Array} selectedValue
     */
    resetOnOptionsChange: {
      default: false,
      validator: value => ["function", "boolean"].includes(typeof value)
    },

    /**
     * If search text should clear on blur
     * @return {Boolean} True when single and clearSearchOnSelect
     */
    clearSearchOnBlur: {
      type: Function,
      default: function({ clearSearchOnSelect, multiple }) {
        return clearSearchOnSelect && !multiple;
      }
    },

    /**
     * Disable the dropdown entirely.
     * @type {Boolean}
     */
    noDrop: {
      type: Boolean,
      default: false
    },

    /**
     * Sets the id of the input element.
     * @type {String}
     * @default {null}
     */
    inputId: {
      type: String
    },

    /**
     * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
     * @type {String}
     * @default 'auto'
     */
    dir: {
      type: String,
      default: "auto"
    },

    /**
     * When true, hitting the 'tab' key will select the current select value
     * @type {Boolean}
     * @deprecated since 3.3 - use selectOnKeyCodes instead
     */
    selectOnTab: {
      type: Boolean,
      default: false
    },

    /**
     * Keycodes that will select the current option.
     * @type Array
     */
    selectOnKeyCodes: {
      type: Array,
      default: () => [13]
    },

    /**
     * Query Selector used to find the search input
     * when the 'search' scoped slot is used.
     *
     * Must be a valid CSS selector string.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
     * @type {String}
     */
    searchInputQuerySelector: {
      type: String,
      default: "[type=search]"
    },

    /**
     * Used to modify the default keydown events map
     * for the search input. Can be used to implement
     * custom behaviour for key presses.
     */
    mapKeydown: {
      type: Function,
      /**
       * @param map {Object}
       * @param vm {VueSelect}
       * @return {Object}
       */
      default: map => map
    },

    /**
     * Append the dropdown element to the end of the body
     * and size/position it dynamically. Use it if you have
     * overflow or z-index issues.
     * @type {Boolean}
     */
    appendToBody: {
      type: Boolean,
      default: false
    },

    /**
     * When `appendToBody` is true, this function is responsible for
     * positioning the drop down list.
     *
     * If a function is returned from `calculatePosition`, it will
     * be called when the drop down list is removed from the DOM.
     * This allows for any garbage collection you may need to do.
     *
     * @since v3.7.0
     * @see http://vue-select.org/guide/positioning.html
     */
    calculatePosition: {
      type: Function,
      /**
       * @param dropdownList {HTMLUListElement}
       * @param component {Vue} current instance of vue select
       * @param width {string} calculated width in pixels of the dropdown menu
       * @param top {string} absolute position top value in pixels relative to the document
       * @param left {string} absolute position left value in pixels relative to the document
       * @return {function|void}
       */
      default(dropdownList, component, { width, top, left }) {
        dropdownList.style.top = top;
        dropdownList.style.left = left;
        dropdownList.style.width = width;
      }
    }
  },
  data() {
    return {
      inputVal: null,
      originValue: null
    };
  },
  computed: {
    inputListeners() {
      return {
        ...this.$listeners,
        input: undefined
      };
    }
  },
  watch: {
    inputVal(newVal) {
      this.$emit("input", newVal);
    },
    initValue(newValue) {
      this.inputVal = JSON.parse(JSON.stringify(newValue));
    }
  },
  mounted() {
    this.inputVal = JSON.parse(JSON.stringify(this.initValue));
  }
};
</script>

<style scoped lang="scss"></style>
