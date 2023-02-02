export default {
  SET_FCM_TOKEN(state, token) {
    state.fcm_token = token;
  },

  DESTROY_FCM_TOKEN(state) {
    state.fcm_token = "";
  },
}
