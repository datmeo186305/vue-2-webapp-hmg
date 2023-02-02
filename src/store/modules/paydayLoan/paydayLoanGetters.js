import { PAYDAY_LOAN_STEP } from "../../../helpers/constants";

export default {
  currentStep: state => {
    return state.currentStep || PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS;
  },
  prevPage: state => {
    return state.prevPage;
  },
  currentPage: state => {
    return state.currentPage;
  },
  displayStepProgressBar: state => {
    return state.displayStepProgressBar;
  },
  displayTopNavigation: state => {
    return state.displayTopNavigation;
  },
  userInfo: state => {
    return state.userInfo;
  },
  currentSigningOtpMobile: state => {
    return state.signingOtpMobile;
  },
  isVerifiedOtp: state => {
    return state.verifiedOtp;
  },
  currentCustomerStatus: state => {
    return state.customerStatus;
  },
  currentPaymentStatus: state => {
    return state.paymentStatus;
  },
  currentHasActiveLoan: state => {
    return state.hasActiveLoan;
  },
  currentLoanCode: state => {
    return state.loanCode;
  },
  currentCloseWebsiteStatus: state => {
    return state.closeWebsiteStatus;
  },
  currentCountdownTimerStatus: state => {
    return state.countdownTimerStatus;
  },
  isSignedContractTerms: state => {
    return state.signedContractTerm;
  },
  isSignedContract: state => {
    return state.signedContract;
  },
  currentSignContractUnlockedTimer: state => {
    return state.unlockedTimer.contract;
  },
  currentSignContractTermsUnlockedTimer: state => {
    return state.unlockedTimer.contractTerms;
  },
  currentTypeWrongOTPSignContract: state => {
    return state.countWrongOTP.contract;
  },
  currentTypeWrongOTPSignContractTerms: state => {
    return state.countWrongOTP.contractTerms;
  },
  isChooseAmountSuccess: state => {
    return state.chooseAmountSuccess;
  },
  isConfirmInformationSuccess: state => {
    return state.confirmInformationSuccess;
  },
  isSentOtpOnsign: state => {
    return state.sentOtpOnsign;
  },
  currentTopNavigationTitle: state => {
    return state.topNavigationTitle;
  },
  currentOtpType: state => {
    return state.otpType;
  }
};
