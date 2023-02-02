export default {
  SHOW_MODAL(state, payload) {
    state.show = true;
    state.type = payload.type;
    state.content = payload.content;
    let body = document.body;
    body.classList.add("modal-open");
  },
  DESTROY_MODAL(state) {
    state.type = null;
    state.show = false;
    state.content = null;
    let body = document.body;
    body.classList.remove("modal-open");
  }
};
