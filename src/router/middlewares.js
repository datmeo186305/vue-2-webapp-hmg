import $store from "../store";
import i18n from "../lang/i18n";
import {
  PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER,
  PAYDAY_LOAN_STATUS_PAGE,
  PAYDAY_LOAN_STATUS
} from "../helpers/constants";
import formatSlug from "./../core/utils/format-slug";
import Configuration from "../helpers/configuration";

// import { AuthService } from '@/services/auth.service'

/**
 * Current user state initialization
 * @WARN Must be always first in middleware chain
 */
export async function initCurrentUserStateMiddleware(to, from, next) {
  next();

  // const hasAccess = $store.state.auth.hasAccess
  // if (AuthService.hasRefreshToken() && !hasAccess) {
  //   try {
  //     await AuthService.debounceRefreshTokens()
  //     await $store.dispatch('user/getCurrent')
  //     next()
  //   } catch (e) {
  //     console.log(e)
  //   }
  // } else {
  //   next()
  // }
}

/**
 * Check access permission to auth router
 */
export function checkAccessMiddleware(to, from, next) {
  const hasAccess = $store.state.auth.hasAccess;
  const isAuthRoute = to.matched.some(item => item.meta.requireAuth);
  const requireStatus = to.matched.find(item => item.meta.requireStatus);
  $store.commit("modal/DESTROY_MODAL");
  if (isAuthRoute && hasAccess) {
    if (
      requireStatus &&
      PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[
        $store.state.paydayLoan.customerStatus
      ] !== PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[requireStatus.meta.requireStatus]
    ) {
      if (
        requireStatus &&
        $store.state.paydayLoan.hasActiveLoan
      ) {
        return next({
          name: "PlCurrentLoan",
          params: {
            status: formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
          }
        });
      } else if (
        requireStatus &&
        !$store.state.paydayLoan.hasActiveLoan &&
        PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER[
          $store.state.paydayLoan.customerStatus
        ] >= PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER.COMPLETED_CDE
      )
        return next({ name: "PlChooseAmountToBorrow" });

      return next({
        name: PAYDAY_LOAN_STATUS_PAGE[$store.state.paydayLoan.customerStatus]
      });
    }

    return next();
  }
  if (isAuthRoute) {
    $store.dispatch("modal/openErrorModal", {
      title: "UNAUTHORIZED",
      content: "Bạn phải thực hiện đăng nhập để thực hiện chức năng này"
    });
    return next({ path: "/" + Configuration.value('VUE_APP_PARTNER') + "/sign-in" });
  }
  next();
}

export function setPageTitleMiddleware(to, from, next) {
  const pageTitle = to.matched.find(item => item.meta.title);

  if (pageTitle) {
    $store.commit("paydayLoan/SET_TOP_NAV_TITLE", i18n.t("payday_loan.salary_24h_title"));
    window.document.title =
      pageTitle.meta.title + " - " + i18n.t("common.project_name");
  } else {
    window.document.title = "" + i18n.t("common.project_name");
  }
  next();
}
