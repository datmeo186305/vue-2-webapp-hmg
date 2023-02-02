import { MODAL_TYPE } from "@/helpers/constants";
import i18n from "../../../lang/i18n";
export default {
  openLoginModal({ commit }) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.LOGIN
    });
  },
  openErrorModal({ commit }, payload = {}) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.PL_ERROR,
      content: {
        title: payload.title || i18n.t("common.error"),
        content: payload.content || ""
      }
    });
  },
  openIsNotEmployeeErrorModal({ commit }, payload = {}) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.PL_NOT_EMPLOYEE,
      content: {
        title: payload.title || i18n.t("common.error"),
        content: payload.content || ""
      }
    });
  },
  openFailedModal({ commit }, payload = {}) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.PL_FAILED,
      content: {
        title: payload.title || i18n.t("common.error"),
        content: payload.content || ""
      }
    });
  },
  openCloseWebsiteModal({ commit }, payload = {}) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.PL_WAITING,
      content: {
        title: payload.title || i18n.t("common.notification"),
        content: payload.content || "",
        btnText: payload.btnText || i18n.t("payday_loan.more_info"),
        btnLink: payload.btnLink || null
      }
    });
  },
  openRatingModal({ commit }) {
    commit("DESTROY_MODAL");
    commit("SHOW_MODAL", {
      type: MODAL_TYPE.PL_RATING,
      content: {}
    });
  }
};
