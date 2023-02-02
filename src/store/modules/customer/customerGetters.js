export default {
  currentCustomerId: state => {
    return state.customerId;
  },
  currentCustomerMobile: state => {
    return state.customerMobile;
  },
  currentPasswordHash: state => {
    return state.passwordHash;
  },
  currentPassword: state => {
    return state.password;
  },
  currentCustomerEmail: state => {
    return state.email;
  },
  currentCustomerName: state => {
    return state.customerName;
  },
  currentRateInfo: state => {
    return state.rateInfo;
  },
}
