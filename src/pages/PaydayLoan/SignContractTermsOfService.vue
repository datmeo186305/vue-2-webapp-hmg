<template>
  <div id="pl-sign-contract-terms-terms-container" class="container-fluid">
    <template v-if="errorGetTngInfo">
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <div class="pl-space-between-box">
            <get-tng-information-failed />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="!isSentOtpOnsign">
      <div
        class="container-fluid pl-sign-contract-terms-top-navbar"
        v-if="!responsive"
      >
        <div class="container pl-sign-contract-terms-top-navbar-container">
          <h2 class="sign-contract-terms-title">
            {{ $t("payday_loan.contract_terms_of_service.title") }}
          </h2>
          <pl-button
            type="button"
            id="pl-sign-contract-terms-btn"
            class="btn-primary pl-btn-sign-contract-terms"
            @click="signContract"
            v-if="showSignContractTermsBtn"
          >
            <img
              :src="'/img/pl/sign-contract-icon.svg'"
              alt="sign"
              class="sign-contract-terms-icon"
            />
            {{ $t("payday_loan.contract_terms_of_service.button_text") }}
          </pl-button>
        </div>
      </div>
      <div class="container-fluid pl-pdf-document-container">
        <div class="container sign-contract-terms-pdf-document">
          <pdf
            v-for="i in numPages"
            :key="i"
            :src="linkPdf"
            :page="i"
            style="padding-bottom: 8px"
          />
        </div>
      </div>
      <div
        class="container-fluid pl-btn-sign-contract-terms-mobile-box"
        v-if="responsive"
      >
        <pl-button
          type="button"
          id="pl-sign-contract-terms-btn"
          class="btn-primary pl-btn-sign-contract-terms-mobile"
          @click="signContract"
          v-if="showSignContractTermsBtn"
        >
          <img
            :src="'/img/pl/sign-contract-icon.svg'"
            alt="sign"
            class="sign-contract-terms-icon"
          />
          {{ $t("payday_loan.contract_terms_of_service.button_text") }}
        </pl-button>
      </div>
    </template>

    <div class="container-fluid pl-space-between-content" v-else>
      <div class="container pl-padding-bottom-default">
        <div class="payday-loan-container">
          <pl-signing-o-t-p-form
            @verifyOtp="verifyOtp"
            @resendOtp="resendOtp"
            @openChooseOtpMethodModal="openChooseOtpMethodModal"
            :mobile="mobile"
            :otp-value="otp"
            :show-submit-button="false"
            :errorText="errorText"
            :errorSendOTPText="errorSendOTPText"
            :disabled="disabledOTP"
            :show-other-otp-method="true"
          >
            <template slot="guide">
              <p
                class="pl-space-between-content sent-otp-text"
                v-if="currentOtpType === otpTypes.EMAIL"
                v-html="
                  $t('payday_loan.contract_terms_of_service.sent_otp_success', {
                    key: 'email',
                    value: userInfo.emailAddress
                  })
                "
              />
              <p
                class="pl-space-between-content sent-otp-text"
                v-else
                v-html="
                  $t('payday_loan.contract_terms_of_service.sent_otp_success', {
                    key: 'số điện thoại',
                    value: userInfo.mobileNumber
                  })
                "
              />
            </template>
          </pl-signing-o-t-p-form>
        </div>
      </div>
    </div>

    <pl-prompt
      id="sign-contract-terms"
      @clickSecondaryBtn="closePrompt"
      @clickPrimaryBtn="confirmSign"
    >
      <template slot="image">
        <div class="pl-prompt-image">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#2AAC7E"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7508 16.5003C16.0594 16.5003 16.569 17.0828 16.9561 18.3746L17.024 18.6118C17.2065 19.2691 17.3156 19.466 17.5366 19.5571C17.7957 19.6639 17.9685 19.6487 18.24 19.5091L18.387 19.4268C18.4398 19.395 18.4974 19.3584 18.5626 19.3154L19.2258 18.864C19.8417 18.4589 20.3951 18.1911 21.0689 18.0227C21.4708 17.9222 21.878 18.1666 21.9784 18.5684C22.0789 18.9702 21.8346 19.3774 21.4327 19.4779C21.0257 19.5797 20.6745 19.7337 20.2874 19.9673L19.9888 20.1581L19.5098 20.4861C19.28 20.6424 19.1066 20.7502 18.9259 20.8431C18.283 21.1736 17.656 21.2287 16.965 20.9439C16.2202 20.637 15.9199 20.164 15.6387 19.2223L15.4829 18.6805C15.3016 18.0911 15.178 18.0003 14.7508 18.0003C14.4415 18.0003 14.1212 18.1551 13.6825 18.5233L13.4977 18.6842L12.5768 19.5595C11.1687 20.8831 9.96823 21.5258 8.24947 21.5258C6.56318 21.5258 5.10478 21.2718 3.88052 20.757L6.82811 19.9527C7.27538 20.0014 7.74909 20.0258 8.24947 20.0258C9.43222 20.0258 10.2812 19.6109 11.3357 18.6632L11.5939 18.4245L12.1257 17.9134C12.3624 17.6866 12.5397 17.5241 12.7182 17.3742C13.4018 16.8006 14.0232 16.5003 14.7508 16.5003ZM19.0312 2.96997C20.4286 4.36743 20.4286 6.63317 19.0312 8.03063L18.743 8.31934C19.8944 9.72069 19.8528 11.2058 18.7819 12.2799L16.7807 14.2811C16.4875 14.5737 16.0127 14.5733 15.72 14.2802C15.4274 13.987 15.4278 13.5121 15.721 13.2195L17.7197 11.2207C18.2047 10.7343 18.2608 10.1304 17.6799 9.38238L9.06283 17.999C8.78596 18.2758 8.44162 18.4757 8.06386 18.5787L2.94817 19.9739C2.38829 20.1266 1.87456 19.6128 2.02726 19.053L3.42244 13.9373C3.52547 13.5595 3.7253 13.2152 4.00217 12.9383L13.9705 2.96997C15.368 1.57251 17.6337 1.57251 19.0312 2.96997Z"
              fill="#2AAC7E"
            />
          </svg>
        </div>
      </template>
    </pl-prompt>

    <pl-choose-otp-method-modal @chooseOtpMethod="chooseOtpMethod($event)" />

<!--    <pl-sign-approval-letter-success-modal />-->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import pdf from "vue-pdf";
import PlButton from "../../components/Buttons/PlButton";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { ComService } from "../../services/paydayLoan/com.service";
import {
  ERROR_CODE,
  ERROR_CODE_TEXT,
  MODAL_TYPE,
  OTP_TYPE,
  PAYDAY_LOAN_STEP,
  PL_VALUE_DEFAULT
} from "../../helpers/constants";
import PlPrompt from "../../components/Prompts/PlPrompt";
import PlSigningOTPForm from "../../components/Forms/PlSigningOTPForm";
import moment from "moment";
import GetTngInformationFailed from "./components/GetTngInformationFailed";
import PlChooseOtpMethodModal from "../../components/Modals/PlChooseOtpMethodModal";
import {ContractService} from "../../services/paydayLoan/contract.service";

export default {
  name: "SignContractTermsOfService",
  components: {
    PlChooseOtpMethodModal,
    GetTngInformationFailed,
    PlSigningOTPForm,
    PlPrompt,
    PlButton,
    pdf
  },
  data() {
    return {
      currentPage: 0,
      pageCount: 0,
      numPages: 0,
      page: 1,
      linkPdf: null,
      responsive: false,
      userInfo: {},
      contractInfo: {},
      isSentOtpOnsign: false,
      otp: [],
      mobile: "",
      errorText: "",
      errorSendOTPText: "",
      errorGetTngInfo: false,
      disabledOTP: false,
      idDocument: null,
      approvalLetterId: null,
      idRequest: null,
      otpType: OTP_TYPE.VOICE,
      otpTypes: OTP_TYPE
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      customerMobile: "customer/currentCustomerMobile",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      isSignedContractTerms: "paydayLoan/isSignedContractTerms",
      isConfirmInformationSuccess: "paydayLoan/isConfirmInformationSuccess",
      currentOtpType: "paydayLoan/currentOtpType"
    }),
    showSignContractTermsBtn() {
      return this.contractInfo && this.contractInfo.path;
    }
  },
  watch: {
    linkPdf(newVal) {
      pdf.createLoadingTask(newVal).promise.then(pdf => {
        this.numPages = pdf.numPages;
      });
    },
    "$store.state.paydayLoan.sentOtpOnsign": {
      handler: function(newVal) {
        this.isSentOtpOnsign = newVal;
        if (newVal) {
          this.setDisplayTopNavigation(true);
          this.setTopNavigationTitle(this.$route.meta.title);
        } else {
          this.setDisplayTopNavigation(false);
          this.errorText = null;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.destroyPrompt();
    this.resetOtpType();
    this.mobile = this.customerMobile;
    if (this.isSignedContractTerms) {
      this.$router.push({ name: "PlSignContractTermsSuccess" });
    }
  },
  mounted() {
    if (this.isSentOtpOnsign) {
      this.setDisplayTopNavigation(true);
      this.setTopNavigationTitle(this.$route.meta.title);
    } else {
      this.setDisplayTopNavigation(false);
    }
    this.setDisplayProgressBar(false);
    this.setCurrentStep(PAYDAY_LOAN_STEP.CONFIRM_INFORMATION);
    this.setCurrentPage("PlContractTermsOfService");
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
    if (this.currentCloseWebsiteStatus) {
      return;
    }
    this.initInfo();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
    this.resetSentOtpOnsignStatus();
    this.destroyPrompt();
  },
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      showPrompt: "prompt/SHOW_PROMPT",
      destroyPrompt: "prompt/DESTROY_PROMPT",
      setVerifiedOtp: "paydayLoan/SET_VERIFIED_OTP",
      setCustomerName: "customer/SET_CUSTOMER_NAME",
      setSentOtpOnsignStatus: "paydayLoan/SET_SENT_OTP_ONSIGN_STATUS",
      resetSentOtpOnsignStatus: "paydayLoan/RESET_SENT_OTP_ONSIGN_STATUS",
      setSignedContractTermsStatus:
        "paydayLoan/SET_SIGNED_CONTRACT_TERMS_STATUS",
      resetConfirmInformationSuccessStatus:
        "paydayLoan/RESET_CONFIRM_INFORMATION_SUCCESS",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      setTopNavigationTitle: "paydayLoan/SET_TOP_NAV_TITLE",
      resetOtpType: "paydayLoan/RESET_OTP_TYPE"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan"
    }),
    async initInfo() {
      await this.getContract();
    },
    confirmSign() {
      this.destroyPrompt();
      this.sendLetterOtp();
    },
    closePrompt() {
      this.destroyPrompt();
    },
    signContract() {
      this.showPrompt({
        content: {
          title: this.$i18n.t(
            "payday_loan.contract_terms_of_service.prompt_title"
          ),
          content: this.$i18n.t(
            "payday_loan.contract_terms_of_service.prompt_body"
          ),
          secondaryBtnText: this.$i18n.t(
            "payday_loan.contract_terms_of_service.disagree"
          ),
          primaryBtnText: this.$i18n.t(
            "payday_loan.contract_terms_of_service.agree"
          )
        }
      });
    },
    onResponsiveInverted() {
      this.responsive = window.innerWidth < 768;
    },
    /**
     * get Contract
     */
    async getContract(showLoading = true, otherLoader = false) {
      const userInfo = await this.getUserInfo(showLoading, otherLoader);
      if (!userInfo || userInfo.errorGetTngInfo || this.errorGetTngInfo) return;

      this.contractInfo = await this.getLatestApprovalLetter(
        showLoading,
        otherLoader
      );
      if (
        this.contractInfo &&
        this.contractInfo.path &&
        !this.isSentOtpOnsign
      ) {
        this.linkPdf = await ComService.downloadSingleFile(
          this.customerId,
          this.contractInfo.path
        );
      }

      if (!this.contractInfo) {
        const approvalLetterResponse = await this.createApprovalLetter();

        if (
          approvalLetterResponse &&
          approvalLetterResponse.documentPath &&
          !this.isSentOtpOnsign
        ) {
          this.contractInfo = {
            path: approvalLetterResponse.documentPath
          };

          this.linkPdf = await ComService.downloadSingleFile(
            this.customerId,
            this.contractInfo.path
          );
        }
      }
    },
    /**
     * Get user info
     * @returns {Promise<{}|null>}
     */
    async getUserInfo(showLoading = true, otherLoader = false) {
      const response = await CustomerService.getById(this.customerId, {
        showLoader: showLoading,
        otherLoader: otherLoader
      });

      if (response.responseCode == 200) {
        this.userInfo = response.result.personalData;
        this.errorGetTngInfo = response.result.personalData.errorGetTngInfo;
        this.setCustomerName(this.userInfo.firstName);
        return this.userInfo;
      }

      return null;
    },
    async createApprovalLetter() {
      const response = await ComService.createApprovalLetter({
        name: this.userInfo.firstName,
        dateOfBirth: this.userInfo.dateOfBirth,
        nationalId: this.userInfo.identityNumberOne,
        customerId: this.customerId,
        employeeCode: this.userInfo.organizationName,
        idIssuePlace: this.userInfo.idIssuePlace
      });

      if (response.responseCode == 200) {
        return response.result;
      }

      return null;
    },
    async getLatestApprovalLetter(showLoading = true, otherLoader = false) {
      const response = await CustomerService.getLatestApprovalLetter(
        {
          customerId: this.customerId
        },
        {
          showLoader: showLoading,
          otherLoader: otherLoader,
          showModalResponseError: false,
          showModalResponseCodeError: false
        }
      );

      if (response.responseCode == 200) {
        this.idRequest = response.result.idRequest;
        this.idDocument = response.result.idDocument;
        this.approvalLetterId = response.result.id;
        return response.result;
      }

      return null;
    },
    async sendLetterOtp() {
      let params = this.buildParamsSendLetterOtp();
      const response = await ComService.sentLetterOTP(params, {
        showModalResponseError: false,
        showModalResponseCodeError: false
      });
      if (response.responseCode === 200) {
        this.disabledOTP = false;
        this.idRequest = response.result.idRequest;
        this.idDocument = response.result.idDocument;
        this.setSentOtpOnsignStatus(true);
        return;
      }
      if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
        const currentOtpRequest = await this.getLatestApprovalLetter();
        if (
          currentOtpRequest &&
          currentOtpRequest.idRequest &&
          currentOtpRequest.idDocument
        ) {
          this.disabledOTP = false;
          this.setSentOtpOnsignStatus(true);
          return;
        }
      }

      if (response.errorCode === ERROR_CODE.LOCK_CREATE_NEW_SESSION) {
        this.disabledOTP = true;
        return this.showLockedSendOTPMessage(response.result.unLockTime);
      }

      this.disabledOTP = false;
      this.errorSendOTPText = this.$t("payday_loan.error_code.send_otp_error");

      this.showError({
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : this.errorSendOTPText
      });
    },

    buildParamsSendLetterOtp() {
      return {
        email: this.userInfo.identityNumberSix,
        dateOfBirth: this.userInfo.dateOfBirth,
        name: this.userInfo.firstName,
        address: this.userInfo.addressOneLine1,
        mobile: this.userInfo.mobileNumber,
        nationalId: this.userInfo.identityNumberOne,
        customerId: this.customerId,
        employeeCode: this.userInfo.organizationName,
        idIssuePlace: this.userInfo.idIssuePlace,
        documentPath: this.contractInfo.path,
        otpType: this.otpType,
        gender: this.userInfo.gender
      };
    },
    async resendOtp() {
      this.errorText = null;
      this.errorSendOTPText = null;
      await this.sendLetterOtp();
    },
    async verifyOtp(otp) {
      this.errorText = null;
      this.errorSendOTPText = null;
      this.otp = otp.split("");

      const confirmOtpResponse = await this.confirmOtpOnsign(otp);

      if (confirmOtpResponse.responseCode !== 200) {
        return this.handleErrorVerifyOtp(confirmOtpResponse);
      }

      await this.updateCustomerSignDoneStatus(confirmOtpResponse.result);

      const tngDataResponse = await this.requestGetTngData(
        confirmOtpResponse.result.documentPath
      );

      if (!tngDataResponse || tngDataResponse.responseCode !== 200) {
        this.showError({ content: this.$t("common.something_went_wrong") });
        await this.getUserInfo();
        return;
      }

      this.setSignedContractTermsStatus(true);

      //Event international women day
      // if (this.userInfo.gender === "Nữ") {
      //   this.showModal({ type: MODAL_TYPE.PL_SIGN_APPROVAL_LETTER_SUCCESS });
      //   return;
      // }

      await this.$router.push({ name: "PlSignContractTermsSuccess" });
    },

    async confirmOtpOnsign(otp) {
      return await ComService.confirmOtpSign(
        {
          customerId: this.customerId,
          otp: otp,
          idRequest: this.idRequest,
          idDocument: this.idDocument
        },
        {
          showModalResponseCodeError: false
        }
      );
    },

    async updateCustomerSignDoneStatus(confirmOtpResponse) {
      if (!this.idRequest || !this.idDocument) return;
      return await CustomerService.updateCustomerSignApprovalLetterDoneStatus(
        {
          customerId: this.customerId,
          idRequest: this.idRequest,
          idDocument: this.idDocument,
          documentPath: confirmOtpResponse.documentPath
        },
        {
          showModalResponseError: false,
          showModalResponseCodeError: false
        }
      );
    },

    async requestGetTngData(documentPath) {
      return await CustomerService.requestGetTngData(
        {
          customerId: this.customerId,
          documentPath: documentPath
        },
        {
          showModalResponseError: false,
          showModalResponseCodeError: false
        }
      );
    },

    handleErrorVerifyOtp(response) {
      switch (response.errorCode) {
        case ERROR_CODE.OTP_INVALID:
          this.errorText = ERROR_CODE_TEXT[response.errorCode];
          if (response.result && response.result.remainingRequests == 0) {
            this.showError({
              content: this.$t("payday_loan.error_code.otp_confirm_maximum")
            });
            this.disabledOTP = true;
          } else {
            this.showError({
              content:
                !response.result || !response.result.remainingRequests
                  ? this.$t("common.something_went_wrong")
                  : this.$t("payday_loan.n_type_wrong_otp", {
                      remaining: response.result.remainingRequests
                    })
            });
          }
          break;
        case ERROR_CODE.OTP_EXPIRE_TIME:
        case ERROR_CODE.OTP_CONFIRM_MAXIMUM:
          this.disabledOTP = true;
          this.errorText = ERROR_CODE_TEXT[response.errorCode];
          this.showError({
            content: ERROR_CODE_TEXT[response.errorCode]
          });
          break;
        default:
          this.showError({
            content: this.$t("common.something_went_wrong")
          });
          break;
      }

      this.otp = [];
    },
    showLockedSendOTPMessage(unlockTime) {
      this.showError({
        content: this.$t(
          "payday_loan.contract_terms_of_service.locked_sent_otp",
          {
            minute:
              PL_VALUE_DEFAULT.LOCKED_SEND_OTP_SIGN_CONTRACT_TERMS_MINUTES,
            unlock_timer: unlockTime
          }
        )
      });
    },
    formatUnlockTimer(timer) {
      return moment(timer)
        .local()
        .format("DD-MM-yyyy HH:mm:ss");
    },
    chooseOtpMethod(otpMethod) {
      this.otpType = otpMethod;
      this.resendOtp();
    },
    openChooseOtpMethodModal() {
      this.showModal({ type: MODAL_TYPE.PL_CHOOSE_OTP_METHOD, content: "" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-sign-contract-terms";
</style>
