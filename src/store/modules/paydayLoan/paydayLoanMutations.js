import { PAYDAY_LOAN_STEP } from "@/helpers/constants";
import {OTP_TYPE, PAYDAY_LOAN_UI_STATUS} from "../../../helpers/constants";
import i18n from "../../../lang/i18n";

export default {
  SET_CURRENT_STEP(state, currentStep) {
    state.currentStep = currentStep;
  },
  RESET_CURRENT_STEP(state) {
    state.currentStep = PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS;
  },
  SET_PREV_PAGE(state, prevPage) {
    state.prevPage = prevPage;
  },
  RESET_PREV_PAGE(state) {
    state.prevPage = "PaydayLoanIndex";
  },
  SET_CURRENT_PAGE(state, currentPage) {
    state.currentPage = currentPage;
  },
  SET_DISPLAY_STEP_PROGRESS_BAR(state, display) {
    state.displayStepProgressBar = display;
  },
  SET_DISPLAY_TOP_NAVIGATION(state, display) {
    state.displayTopNavigation = display;
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  SET_SIGNING_OTP_MOBILE(state, mobile) {
    state.signingOtpMobile = mobile;
  },
  RESET_SIGNING_OTP_MOBILE(state) {
    state.signingOtpMobile = null;
  },
  SET_SENT_OTP_ONSIGN_STATUS(state, sentOtpOnsign) {
    state.sentOtpOnsign = sentOtpOnsign;
  },
  RESET_SENT_OTP_ONSIGN_STATUS(state) {
    state.sentOtpOnsign = false;
  },
  SET_SIGNED_CONTRACT_TERMS_STATUS(state, signedContractTerm) {
    state.signedContractTerm = signedContractTerm;
  },
  RESET_SIGNED_CONTRACT_TERMS_STATUS(state) {
    state.signedContractTerm = false;
  },
  SET_SIGNED_CONTRACT_STATUS(state, signedContract) {
    state.signedContract = signedContract;
  },
  RESET_SIGNED_CONTRACT_STATUS(state) {
    state.signedContract = false;
  },
  SET_LOAN_CODE(state, loanCode) {
    state.loanCode = loanCode;
  },
  RESET_LOAN_CODE(state) {
    state.loanCode = null;
  },
  SET_AUTH_PAGE(state, currentPage) {
    state.authPage = currentPage;
  },
  SET_VERIFIED_OTP(state, verified) {
    state.verifiedOtp = verified;
  },
  RESET_AUTH_PAGE(state) {
    state.authPage = "PlSignIn";
    state.verifiedOtp = false;
    state.signingOtpMobile = null;
  },
  RESET_SIGN_UP_PAGE(state) {
    state.authPage = "PlSignIn";
    state.verifiedOtp = false;
  },
  SET_CUSTOMER_STATUS(state, status) {
    state.customerStatus =
      status || PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET;
  },
  RESET_CUSTOMER_STATUS(state) {
    state.customerStatus = PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET;
  },
  SET_PAYMENT_STATUS(state, status) {
    state.paymentStatus = status || null;
  },
  RESET_PAYMENT_STATUS(state) {
    state.paymentStatus = null;
  },
  SET_HAS_ACTIVE_LOAN(state, status) {
    state.hasActiveLoan = status;
  },
  RESET_HAS_ACTIVE_LOAN(state) {
    state.hasActiveLoan = false;
  },
  SET_CLOSE_WEBSITE_STATUS(state, status) {
    state.closeWebsiteStatus = status;
  },
  RESET_CLOSE_WEBSITE_STATUS(state) {
    state.closeWebsiteStatus = false;
  },
  SET_COUNTDOWN_TIMER_STATUS(state, status) {
    state.countdownTimerStatus = status;
  },
  RESET_COUNTDOWN_TIMER_STATUS(state) {
    state.countdownTimerStatus = false;
  },
  SET_UNLOCKED_TIMER(state, { type, key, timer }) {
    state.unlockedTimer[type][key] = timer;
  },
  RESET_UNLOCKED_TIMER(state, { type, key }) {
    state.unlockedTimer[type][key] = null;
  },
  INIT_WRONG_OTP_TIMES(state, { type, key }) {
    state.countWrongOTP[type][key] = 1;
  },
  INCREASE_WRONG_OTP_TIMES(state, { type, key }) {
    state.countWrongOTP[type][key]++;
  },
  RESET_WRONG_OTP_TIMES(state, { type, key }) {
    state.countWrongOTP[type][key] = 0;
  },
  SET_CHOOSE_AMOUNT_SUCCESS(state, value) {
    state.chooseAmountSuccess = value;
  },
  RESET_CHOOSE_AMOUNT_SUCCESS(state) {
    state.chooseAmountSuccess = false;
  },
  SET_CONFIRM_INFORMATION_SUCCESS(state, value) {
    state.confirmInformationSuccess = value;
  },
  RESET_CONFIRM_INFORMATION_SUCCESS(state) {
    state.confirmInformationSuccess = false;
  },
  SET_TOP_NAV_TITLE(state, value) {
    state.topNavigationTitle = value;
  },
  RESET_TOP_NAV_TITLE(state) {
    state.topNavigationTitle = i18n.t("payday_loan.salary_24h_title");
  },
  SET_OTP_TYPE(state, value) {
    state.otpType = value;
  },
  RESET_OTP_TYPE(state) {
    state.otpType = OTP_TYPE.VOICE;
  }
};
