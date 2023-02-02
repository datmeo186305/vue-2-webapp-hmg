export default {
  SHOW_PROMPT(state, payload) {
    state.show = true;
    state.content = payload.content;
  },
  DESTROY_PROMPT(state) {
    state.show = false;
    state.content = null;
  }
};
