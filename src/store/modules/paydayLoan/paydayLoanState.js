import { PAYDAY_LOAN_STEP, PAYDAY_LOAN_UI_STATUS } from "@/helpers/constants";
import i18n from "../../../lang/i18n";
import {OTP_TYPE} from "../../../helpers/constants";

export default {
  currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
  prevPage: "PaydayLoanIndex",
  currentPage: "PaydayLoanIndex",
  displayStepProgressBar: false,
  displayTopNavigation: false,
  userInfo: null,
  signingOtpMobile: null,
  sentOtpOnsign: false,
  signedContractTerm: false,
  signedContract: false,
  verifiedOtp: false,
  authPage: "PlSignIn",
  customerStatus: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET,
  hasActiveLoan: false,
  paymentStatus: null,
  closeWebsiteStatus: false,
  countdownTimerStatus: false,
  loanCode: null,
  chooseAmountSuccess: false,
  confirmInformationSuccess: false,
  unlockedTimer: {
    contract: {},
    contractTerms: {}
  },
  countWrongOTP: {
    contract: {},
    contractTerms: {}
  },
  topNavigationTitle: i18n.t("payday_loan.salary_24h_title"),
  otpType: OTP_TYPE.VOICE
};
