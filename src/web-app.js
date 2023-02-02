// A plugin file where you could register global components used across the app
import GlobalComponents from "./globalComponents";
// A plugin file where you could register global directives
import GlobalDirectives from "./globalDirectives";

// Import plugin
import { VTooltip } from "v-tooltip";

// Import stylesheet
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/main.scss";
import "vue-datetime/dist/vue-datetime.css";
import "vue-select/dist/vue-select.css";

// Import js
import "bootstrap";

// library auto imports
import "es6-promise/auto";
import { Settings } from "luxon";
Settings.defaultLocale = "vi";

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import Configuration from "@/helpers/configuration";

Sentry.init({
  dsn: Configuration.value('VUE_APP_SENTRY_DSN'),

  // Alternatively, use `process.env.npm_package_version` for a dynamic release version
  // if your build tool supports it.
  release: "webapp@1.0",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
});

export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(VTooltip, {
      defaultTrigger: window.innerWidth > 768 ? "hover focus click" : "click"
    });
  }
};
