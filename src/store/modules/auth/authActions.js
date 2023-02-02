import router from "../../../router";

export default {
  signOut({ commit }) {
    commit("DESTROY_AUTH");
    router.push({ name: "PaydayLoanIndex" });
  }
};
