import Vue from "vue";
import App from "./App.vue";
import DashboardPlugin from "./web-app";

import i18n from "./lang/i18n";
import store from "./store/index.js";

// router setup
import router from "./router";

//Import helper
import "./helpers/validation-config";
import * as filters from "./helpers/filters";

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(DashboardPlugin);

// global library setup
Vue.prototype.$loading = Vue.$loading;

// import firebase from "./helpers/firebase";
// Vue.prototype.$firebase = firebase;

Vue.config.errorHandler = function(err) {
  window.ga &&
    window.ga("send", "event", "Vue.config.errorHandler", err.stack, err.message);
  throw err;
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  i18n
});
