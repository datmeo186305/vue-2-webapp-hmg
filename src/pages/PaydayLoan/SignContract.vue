<template>
  <div id="pl-sign-contract-container" class="container-fluid">
    <template v-if="!isSentOtpOnsign">
      <div
        class="container-fluid pl-sign-contract-top-navbar"
        v-if="!responsive"
      >
        <div class="container pl-sign-contract-top-navbar-container">
          <h2 class="sign-contract-title">
            {{ $t("payday_loan.sign_contract.title") }}
          </h2>
          <pl-button
            type="button"
            id="pl-sign-contract-btn"
            class="btn-primary pl-btn-sign-contract"
            v-if="showSignContractBtn"
            @click="signContract"
          >
            <img
              :src="'/img/pl/sign-contract-icon.svg'"
              alt="sign"
              class="sign-contract-icon"
            />
            {{ $t("payday_loan.current_loan.sign_contract") }}
          </pl-button>
          <!--          <div v-else class="sent-contract-box-actions">-->
          <!--            <pl-button-->
          <!--              class="btn-secondary"-->
          <!--              id="pl-see-instruction-sign-contract-btn"-->
          <!--              @click="seeTheInstructions"-->
          <!--              >{{ $t("payday_loan.sign_contract.see_the_intro") }}-->
          <!--            </pl-button>-->
          <!--            <pl-button-->
          <!--              class="btn-primary"-->
          <!--              id="pl-close-instruction-sign-contract-btn"-->
          <!--              @click="closeSuccessModal"-->
          <!--              >{{ $t("common.ok") }}-->
          <!--            </pl-button>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="container-fluid pl-pdf-document-container">
        <div class="container sign-contract-pdf-document">
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
        class="container-fluid pl-btn-sign-contract-mobile-box"
        v-if="responsive && showSignContractBtn"
      >
        <pl-button
          type="button"
          id="pl-sign-contract-btn"
          class="btn-primary pl-btn-sign-contract-mobile"
          @click="signContract"
        >
          <img
            :src="'/img/pl/sign-contract-icon.svg'"
            alt="sign"
            class="sign-contract-icon"
          />
          {{ $t("payday_loan.current_loan.sign_contract") }}
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
            :disabled="disabledOTP"
            :show-submit-button="false"
            :errorText="errorText"
            :errorSendOTPText="errorSendOTPText"
            :show-other-otp-method="true"
          >
            <template slot="guide">
              <p
                class="pl-space-between-content sent-otp-text"
                v-if="currentOtpType === otpTypes.EMAIL"
                v-html="
                  $t('payday_loan.sign_contract.sent_otp_success', {
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
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import pdf from "vue-pdf";
import PlButton from "../../components/Buttons/PlButton";
import { CoreService } from "../../services/paydayLoan/core.service";
import { LoanService } from "../../services/paydayLoan/loan.service";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { ComService } from "../../services/paydayLoan/com.service";
import {
  DOCUMENT_TYPE,
  ERROR_CODE,
  ERROR_CODE_TEXT,
  MODAL_TYPE,
  OTP_TYPE,
  PAYDAY_LOAN_STATUS,
  PL_VALUE_DEFAULT,
  SIGN_STATUS
} from "../../helpers/constants";
import formatSlug from "@/core/utils/format-slug";
import _ from "lodash";
import * as Sentry from "@sentry/browser";
import PlPrompt from "../../components/Prompts/PlPrompt";
import PlSigningOTPForm from "../../components/Forms/PlSigningOTPForm";
import moment from "moment";
import Configuration from "@/helpers/configuration";
import PlChooseOtpMethodModal from "../../components/Modals/PlChooseOtpMethodModal";
import {ContractService} from "../../services/paydayLoan/contract.service";

export default {
  name: "PlSignContract",
  components: {
    PlChooseOtpMethodModal,
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
      currentLoan: {
        id: null,
        loanUuid: null,
        loanCode: null,
        loanStatus: null
      },
      contractInfo: {
        status: null,
        path: null
      },
      userInfo: {},
      contractDocumentPath: null,
      displaySignContract: false,
      mobile: "",
      otp: [],
      errorText: "",
      idDocument: null,
      idRequest: null,
      isSentOtpOnsign: false,
      disabledOTP: false,
      otpType: OTP_TYPE.VOICE,
      otpTypes: OTP_TYPE
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      coreToken: "auth/getCoreToken",
      currentCloseWebsiteStatus: "paydayLoan/currentCloseWebsiteStatus",
      isSignedContract: "paydayLoan/isSignedContract",
      currentOtpType: "paydayLoan/currentOtpType"
    }),
    showSignContractBtn() {
      return (
        (this.contractInfo &&
          this.contractInfo.path &&
          this.contractInfo.status ===
            SIGN_STATUS.AWAITING_BORROWER_SIGNATURE) ||
        this.displaySignContract
      );
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
    if (this.isSignedContract) {
      this.$router.push({ name: "PlSignContractSuccess" });
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
    this.setCurrentPage("PlSignContract");
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
    if (this.currentCloseWebsiteStatus) {
      return;
    }
    this.getContract();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
    this.resetSentOtpOnsignStatus();
    this.destroyPrompt();
  },
  methods: {
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      setSentOtpOnsignStatus: "paydayLoan/SET_SENT_OTP_ONSIGN_STATUS",
      resetSentOtpOnsignStatus: "paydayLoan/RESET_SENT_OTP_ONSIGN_STATUS",
      showPrompt: "prompt/SHOW_PROMPT",
      destroyPrompt: "prompt/DESTROY_PROMPT",
      setVerifiedOtp: "paydayLoan/SET_VERIFIED_OTP",
      setCustomerName: "customer/SET_CUSTOMER_NAME",
      setSignedContractStatus: "paydayLoan/SET_SIGNED_CONTRACT_STATUS",
      setLoanCode: "paydayLoan/SET_LOAN_CODE",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setTopNavigationTitle: "paydayLoan/SET_TOP_NAV_TITLE",
      resetOtpType: "paydayLoan/RESET_OTP_TYPE"
    }),
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan"
    }),
    signContract() {
      this.showPrompt({
        content: {
          title: this.$i18n.t("payday_loan.sign_contract.prompt_title"),
          content: this.$i18n.t("payday_loan.sign_contract.prompt_body"),
          secondaryBtnText: this.$i18n.t("payday_loan.sign_contract.disagree"),
          primaryBtnText: this.$i18n.t("payday_loan.sign_contract.agree")
        }
      });
    },
    onResponsiveInverted() {
      this.responsive = window.innerWidth < 768;
    },
    /**
     * get Contract
     */
    async getContract() {
      await this.getActiveLoan();
      await this.getUserInfo();
      let contractInfoCurrentLoan = await this.getContractCurrentLoan();
      if (contractInfoCurrentLoan) this.contractInfo = contractInfoCurrentLoan;

      if (
        this.contractInfo &&
        this.contractInfo.path &&
        !this.isSentOtpOnsign
      ) {
        this.linkPdf = await ComService.downloadSingleFile(
          this.customerId,
          this.contractInfo.path
        );
        return;
      }
      await this.acceptAndDownloadContract();
    },
    async getContractCurrentLoan() {
      const response = await LoanService.getContract(
        { loanId: this.currentLoan.id, customerId: this.customerId },
        { showModalResponseCodeError: false }
      );
      if (response.responseCode == 200) {
        let contractInfo = response.result;
        this.idRequest = contractInfo.idRequest;
        this.idDocument = contractInfo.idDocument;
        return response.result;
      }
      return null;
    },
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    },
    /**
     * acceptAndDownloadContract
     * @returns {Promise<void>}
     */
    async acceptAndDownloadContract() {
      if (_.isEmpty(this.contractInfo.status)) {
        const acceptContractResult = await this.acceptContract();

        if (
          !acceptContractResult ||
          acceptContractResult.responseCode !== 200 ||
          _.isEmpty(acceptContractResult.result) ||
          acceptContractResult.result.code != "200" ||
          acceptContractResult.result.contractAccepted !== "true"
        ) {
          return;
        }
      }

      const contractData = await this.downloadContract();

      if (contractData.responseCode !== 200 || _.isEmpty(contractData.result)) {
        return;
      }

      const blob = this.b64toBlob(contractData.result, "application/pdf");
      const blobUrl = URL.createObjectURL(blob);

      this.linkPdf = blobUrl;

      this.urlToFile(
        JSON.parse(JSON.stringify(blobUrl)),
        "contract.pdf",
        "pdf"
      ).then(async file => {
        let documentInfo = await ComService.uploadSingleFile({
          document_type: DOCUMENT_TYPE.CONTRACT,
          file: file,
          customerId: this.customerId
        });

        if (!documentInfo || !documentInfo.result) return;

        this.contractDocumentPath = documentInfo.result.documentPath;
      });
      this.displaySignContract = true;
    },
    urlToFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType });
        })
        .catch(e => {
          Sentry.captureException(e);
        });
    },
    async sendContractPaydayOtp() {
      let params = this.bindingDataSignContract();
      const response = await ComService.sentContractOTP(params, {
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
        const currentOtpRequest = await this.getContractCurrentLoan();
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
    confirmSign() {
      this.destroyPrompt();

      this.sendContractPaydayOtp();
    },
    closePrompt() {
      this.destroyPrompt();
    },
    bindingDataSignContract() {
      return {
        email: this.userInfo.identityNumberSix,
        name: this.userInfo.firstName,
        address: this.userInfo.addressTwoLine1,
        mobile: this.userInfo.mobileNumber,
        nationalId: this.userInfo.identityNumberOne,
        customerId: this.customerId,
        documentPath: this.contractInfo.path || this.contractDocumentPath,
        loanCode: this.currentLoan.loanCode,
        loanId: this.currentLoan.id,
        otpType: this.otpType
      };
    },
    /**
     * Borrower accept contract
     * @returns {Promise<*>}
     */
    acceptContract() {
      return CoreService.borrowerAcceptContract(
        this.coreToken,
        this.currentLoan.loanUuid,
        Configuration.value("VUE_APP_CONTRACT_UUID"),
        Configuration.value("VUE_APP_ACTIVITY_STATUS"),
        this.customerId
      );
    },
    /**
     * Borrower loan contract download
     * @returns {Promise<*>}
     */
    async downloadContract() {
      return CoreService.borrowerLoanContractDownload(
        this.coreToken,
        this.currentLoan.loanUuid,
        Configuration.value("VUE_APP_CONTRACT_UUID"),
        this.customerId
      );
    },

    /**
     * Borrower get active loan
     * @returns {Promise<void>}
     */
    async getActiveLoan() {
      const response = await LoanService.getActiveLoan(
        this.customerId,
        this.coreToken,
        { showModalResponseCodeError: false }
      );
      if (response.errorCode) {
        return this.handleGetActiveLoanError(response);
      }
      if (response.responseCode == 200) {
        let loanInfo = response.result;
        this.currentLoan.id = loanInfo.id;
        this.currentLoan.loanUuid = loanInfo.coreLoanUuid;
        this.currentLoan.loanCode = loanInfo.loanCode;
        this.currentLoan.loanStatus = loanInfo.status;
        this.setLoanCode(loanInfo.loanCode);
        if (this.currentLoan.loanStatus !== PAYDAY_LOAN_STATUS.FUNDED) {
          await this.$router.push({
            name: "PlCurrentLoan",
            params: {
              status: formatSlug(
                this.currentLoan.loanStatus || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              )
            }
          });
        }
      }
    },
    /**
     * Get user info
     * @returns {Promise<{}|null>}
     */
    async getUserInfo() {
      const response = await CustomerService.getById(this.customerId);

      if (response.responseCode == 200) {
        this.userInfo = response.result.personalData;
        return this.userInfo;
      }

      return null;
    },
    handleGetActiveLoanError(response) {
      if (response.errorCode === "DO_NOT_ACTIVE_LOAN_ERROR") {
        this.createNewPaydayLoan();
        return;
      }

      this.showError({
        title:
          Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.error")
            : response.errorCode,
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : Configuration.value("VUE_APP_PRODUCTION") === "true"
            ? this.$t("common.something_went_wrong")
            : response.message
      });
    },
    closeSuccessModal() {
      this.destroyModal();
      this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status: formatSlug(
            this.currentLoan.loanStatus || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
          )
        }
      });
    },
    seeTheInstructions() {
      this.showModal({ type: MODAL_TYPE.PL_GUIDE_SIGN_CONTRACT });
    },
    async verifyOtp(otp) {
      this.errorText = null;
      this.errorSendOTPText = null;
      this.otp = otp.split("");

      const response = await ComService.confirmOtpSign({
        customerId: this.customerId,
        otp: otp,
        idRequest: this.idRequest,
        idDocument: this.idDocument
      });
      if (response.responseCode == 200) {
        this.setSignedContractStatus(true);
        await this.$router.push({ name: "PlSignContractSuccess" });
        return;
      }

      this.handleErrorVerifyOtp(response);
    },
    async resendOtp() {
      this.errorText = null;
      this.errorSendOTPText = null;
      await this.sendContractPaydayOtp();
    },
    handleErrorVerifyOtp(response) {
      switch (response.errorCode) {
        case ERROR_CODE.OTP_INVALID:
          this.errorText = ERROR_CODE_TEXT[response.errorCode];
          if (response.result.remainingRequests == 0) {
            this.showError({
              content: this.$t("payday_loan.error_code.otp_confirm_maximum")
            });
            this.disabledOTP = true;
          } else {
            this.showError({
              content: this.$t("payday_loan.n_type_wrong_otp", {
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
@import "src/assets/scss/pl/pl-sign-contract";
</style>
