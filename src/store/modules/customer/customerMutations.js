export default {
  SET_CUSTOMER_INFO(state, payload) {
    state.customerId = payload.customerId;
    state.customerMobile = payload.customerMobile;
    state.passwordHash = payload.passwordHash;
  },
  RESET_CUSTOMER_INFO(state,) {
    state.customerId = null;
    state.customerMobile = null;
    state.customerName = null;
    state.passwordHash = null;
    state.password = null;
    state.email = null;
    state.rateInfo = null;
  },
  SET_PASSWORD(state, password) {
    state.password = password;
  },
  SET_EMAIL(state, email) {
    state.email = email;
  },
  SET_CUSTOMER_NAME(state, firstName) {
    state.customerName = firstName;
  },
  SET_RATE_INFO(state, rateInfo) {
    state.rateInfo = rateInfo;
  },
  RESET_RATE_INFO(state) {
    state.rateInfo = null;
  }
};
