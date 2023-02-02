import state from "./customerState";
import mutations from "./customerMutations";
import getters from "./customerGetters";
import actions from "./customerActions";

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
