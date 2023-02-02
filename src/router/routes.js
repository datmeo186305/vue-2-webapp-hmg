import paydayLoanPages from "./routePages/paydayLoan";
import PlNotFound from "../pages/PaydayLoan/PlNotFound";
import i18n from "../lang/i18n";
import Configuration from "../helpers/configuration";

export const routes = [
  {
    path: "",
    redirect: "/" + Configuration.value('VUE_APP_PARTNER'),
    name: "Home",
    meta: {
      requireAuth: false
    }
  },
  paydayLoanPages,
  {
    path: '/:catchAll(.*)',
    component: PlNotFound,
    name: 'PlNotFound',
    meta: {
      requireAuth: false,
      title: i18n.t("page_title.not_found")
    }
  }
];
