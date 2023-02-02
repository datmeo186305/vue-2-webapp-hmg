import i18n from "../../lang/i18n";
//Payday Loan layout
const PaydayLoanLayout = () => import("@/layouts/PaydayLoanLayout.vue");

//Payday Loan Pages
const PaydayLoanIndex = () => import("@/pages/PaydayLoan/Index.vue");
const PlSignIn = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/SignIn.vue");
const PlSignUp = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/SignUp.vue");
const PlSignUpSuccess = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/PlSignUpSuccess.vue");
const PlForgotPassword = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/ForgotPassword.vue");
const PlForgotPassSuccess = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/PlForgotPassSuccess.vue");
const PlEKYC = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/EKYC.vue");
const PlConfirmInformation = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/ConfirmInformation.vue");
const PlSignContractTermsOfService = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/SignContractTermsOfService.vue");
const PlSignContractTermsSuccess = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/PlSignContractTermsSuccess.vue");
const PlSignContractSuccess = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/PlSignContractSuccess.vue");
const PlAdditionalInformation = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/AdditionalInformation.vue");
const PlChooseAmountToBorrow = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/ChooseAmountToBorrow.vue");
const PlCurrentLoan = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/CurrentLoan.vue");
const PlAdditionalDocument = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/AdditionalDocument.vue");
const PlLoanPayment = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/LoanPayment.vue");
const PlChoosePaymentMethod = () =>
  import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/ChoosePaymentMethod.vue");
const PlSignContract = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/SignContract.vue");
const PlPaymentResult = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/PaymentResult.vue");
// const PlContractTermsOfService = () => import(/* webpackPrefetch: true */ "@/pages/PaydayLoan/ContractTermsOfService.vue)";
import { PAYDAY_LOAN_UI_STATUS } from "../../helpers/constants";
import Configuration from "@/helpers/configuration";

const paydayLoanPages = {
  path: "/" + Configuration.value('VUE_APP_PARTNER'),
  component: PaydayLoanLayout,
  children: [
    {
      path: "",
      name: "PaydayLoanIndex",
      components: { default: PaydayLoanIndex },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan")
      }
    },
    {
      path: "sign-in",
      name: "PlSignIn",
      components: { default: PlSignIn },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan_sign_in")
      }
    },
    {
      path: "sign-up",
      name: "PlSignUp",
      components: { default: PlSignUp },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan_sign_up")
      }
    },
    {
      path: "sign-up-success",
      name: "PlSignUpSuccess",
      components: { default: PlSignUpSuccess },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan_sign_up_success")
      }
    },
    {
      path: "forgot-password",
      name: "PlForgotPassword",
      components: { default: PlForgotPassword },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan_forgot_password")
      }
    },
    {
      path: "forgot-pass-success",
      name: "PlForgotPassSuccess",
      components: { default: PlForgotPassSuccess },
      meta: {
        requireAuth: false,
        title: i18n.t("page_title.payday_loan_forgot_pass_success")
      }
    },
    {
      path: "eKYC",
      name: "PlEKYC",
      components: { default: PlEKYC },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET,
        title: i18n.t("page_title.eKYC")
      }
    },
    {
      path: "confirm-information",
      name: "PlConfirmInformation",
      components: { default: PlConfirmInformation },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET,
        title: i18n.t("page_title.confirm_information")
      }
    },
    {
      path: "contract-terms-of-service",
      name: "PlContractTermsOfService",
      components: { default: PlSignContractTermsOfService },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET,
        title: i18n.t("page_title.contract_term_of_service")
      }
    },
    {
      path: "sign-contract-terms-success",
      name: "PlSignContractTermsSuccess",
      components: { default: PlSignContractTermsSuccess },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET,
        title: i18n.t("page_title.pl_sign_contract_terms_success")
      }
    },
    {
      path: "additional-information",
      name: "PlAdditionalInformation",
      components: { default: PlAdditionalInformation },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET,
        title: i18n.t("page_title.additional_information")
      }
    },
    {
      path: "choose-amount-to-borrow",
      name: "PlChooseAmountToBorrow",
      components: { default: PlChooseAmountToBorrow },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.choose_amount_to_borrow")
      }
    },
    {
      path: "current-loan/:status",
      name: "PlCurrentLoan",
      components: { default: PlCurrentLoan },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.current_loan")
      }
    },
    {
      path: "additional-document",
      name: "PlAdditionalDocument",
      components: { default: PlAdditionalDocument },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.additional_document")
      }
    },
    {
      path: "loan-payment",
      name: "PlLoanPayment",
      components: { default: PlLoanPayment },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.loan_payment")
      }
    },
    {
      path: "choose-payment-method",
      name: "PlChoosePaymentMethod",
      components: { default: PlChoosePaymentMethod },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.choose_payment_method")
      }
    },
    {
      path: "sign-contract",
      name: "PlSignContract",
      components: { default: PlSignContract },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.sign_contract")
      }
    },
    {
      path: "sign-contract-success",
      name: "PlSignContractSuccess",
      components: { default: PlSignContractSuccess },
      meta: {
        requireAuth: true,
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.pl_sign_contract_success")
      }
    },
    {
      path: "callback",
      name: "PlPaymentResult",
      components: { default: PlPaymentResult },
      meta: {
        requireStatus: PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE,
        title: i18n.t("page_title.payment_result")
      }
    }
  ]
};

export default paydayLoanPages;
