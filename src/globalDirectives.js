import { directive as vClickOutside } from "vue-clickaway";
import { VTooltip } from "v-tooltip";
/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(Vue) {
    Vue.directive("click-outside", vClickOutside);
    Vue.directive("tooltip", VTooltip);
    Vue.directive("numericOnly", {
      bind(el) {
        el.addEventListener("keyup", () => {
          let regex = /^[0-9]*$/;
          if (!regex.test(el.value)) {
            el.value = el.value.slice(0, -1);
          }
        });
      }
    });
    Vue.directive("phoneNumberOnly", {
      bind(el) {
        el.addEventListener("keyup", () => {
          let regex = /^[+0-9]*$/;
          if (!regex.test(el.value)) {
            el.value = el.value.slice(0, -1);
          }
        });
      }
    });
  }
};

export default GlobalDirectives;
