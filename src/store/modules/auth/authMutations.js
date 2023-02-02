import * as Sentry from "@sentry/browser";

export default {
  SET_AUTH(state, auth) {
    state.hasAccess = auth.hasAccess || false;
    state.access_token = auth.access_token;
    state.visitor_id = auth.visitor_id;
    state.accessTokenExpDate = auth.accessTokenExpDate;
  },
  DESTROY_AUTH(state) {
    state.hasAccess = false;
    state.core_token = null;
    state.accessTokenExpDate = null;
    state.visitor_id = null;
    state.access_token = null;
    Sentry.configureScope(scope => scope.setUser(null));

  },
  SET_ATOKEN_EXP_DATE(state, expDate) {
    state.accessTokenExpDate = expDate;
  },
  SET_CORE_TOKEN(state, coreToken) {
    state.core_token = coreToken;
  }
};
