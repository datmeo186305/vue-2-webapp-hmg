import Vue from "vue";
import VueI18n from "vue-i18n";
import vi from "./vi.json";
import en from "./en.json";

Vue.use(VueI18n);

const messages = {
  vi: vi,
  en: en
};
const i18n = new VueI18n({
  locale: "vi",
  messages,
  fallbackLocale: "en"
});

export default i18n;
