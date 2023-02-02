export default {
  SET_CARD_INFO(state, payload = {}) {
    state.cardInfo = payload;
  },
  RESET_CARD_INFO(state) {
    state.cardInfo = {};
  }
};
