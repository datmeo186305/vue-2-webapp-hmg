export default {
  getAccessToken: state => {
    return state.access_token;
  },
  getCoreToken: state => {
    return state.core_token;
  },
  getCurrentExp: state => {
    return state.accessTokenExpDate;
  }
};
