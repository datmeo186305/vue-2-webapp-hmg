import state from "./shuffleState";
import mutations from "./shuffleMutation";
import getters from "./shuffleGetters";
import actions from "./shuffleActions";

export default {
  namespaced: false,
  state,
  mutations,
  getters,
  actions
};
