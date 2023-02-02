export default {
  SHOW_LOADING(state, payload = {}) {
    state.show = true;
    state.content = payload.content || null;
    let body = document.body;
    body.classList.add("modal-open");
  },

  HIDE_LOADING(state) {
    state.show = false;
    state.content = null;
    let body = document.body;
    body.classList.remove("modal-open");
  }
};
