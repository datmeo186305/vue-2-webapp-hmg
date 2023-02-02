<template>
  <div id="payday-loan-index" class="container-fluid">
    <salary24h-introduce />
    <div id="payday-loan-steps" class="container-fluid">
      <div
        class="container pl-padding-bottom-with-provider"
        id="payday-loan-steps-container"
      >
        <div class="payday-loan-container">
          <div class="payday-loan-steps-content">
            <p class="pl-five-step-text">
              {{ $t("payday_loan.five_steps") }}
            </p>
            <div class="pl-five-steps-content">
              <ul class="portrait-progress-bar">
                <li
                  class="portrait-progress-bar-item"
                  :key="'step-' + index"
                  v-for="(step, index) in fiveSteps"
                >
                  <p class="roadmap-checkpoint">
                    {{ index + 1 }}
                  </p>
                  <p class="roadmap-checkpoint-content">{{ step }}</p>
                </li>
              </ul>
            </div>

            <a
              :href="guideVideoUrl"
              target="_blank"
              rel="noopener"
              id="user-guide-video"
              class="pl-space-between-content"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 22 15"
                fill="#007aff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 4.68379C22 2.0751 19.8061 0 17.1856 0H4.8144C2.13296 0 0 2.13438 0 4.68379V10.3162C0 12.9249 2.19391 15 4.8144 15H17.1856C19.867 15 22 12.8656 22 10.3162V4.68379ZM14.7479 7.88537L9.20222 10.5534C8.95845 10.6719 8.22715 10.4941 8.22715 10.2569V4.74309C8.22715 4.50593 8.95845 4.32807 9.20222 4.44664L14.5042 7.23319C14.7479 7.47035 14.9917 7.7668 14.7479 7.88537Z"
                  fill="#007aff"
                />
              </svg>
              <p id="user-guide-video-title">
                {{ $t("payday_loan.user_guide_video") }}
              </p>
            </a>

            <div class="btn-next-pl-intro-box pl-space-between-content">
              <!--  Countdown     -->
              <!--              <vue-countdown-->
              <!--                v-if="displayCountdown"-->
              <!--                :date="date"-->
              <!--                :text="$t('payday_loan.waiting_feature')"-->
              <!--                @countdownSuccess="countdownSuccess"-->
              <!--              />-->

              <pl-button
                id="btn-next-pl-intro"
                class="btn-primary"
                :to="{ name: 'PlSignIn' }"
                >{{ $t("payday_loan.payday_loan_text") }}
              </pl-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="pl-provider-info-container" class="container-fluid">
      <div class="container">
        <div class="payday-loan-container">
          <p
            class="pl-provider-info"
            v-html="$t('payday_loan.provider_info')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlButton from "../../components/Buttons/PlButton";
import Salary24hIntroduce from "./components/Salary24hIntroduce";
import { mapMutations } from "vuex";
import { MODAL_TYPE } from "../../helpers/constants";
import Configuration from "@/helpers/configuration";
export default {
  name: "Index",
  components: { Salary24hIntroduce, PlButton },
  data() {
    return {
      guideVideoUrl:
        Configuration.value("VUE_APP_GUIDE_VIDEO_URL") ||
        "https://youtu.be/sGM98Ot89TE",
      displayCountdown: true,
      fiveSteps: [
        this.$t("payday_loan.step_1"),
        this.$t("payday_loan.step_2"),
        this.$t("payday_loan.step_3"),
        this.$t("payday_loan.step_4"),
        this.$t("payday_loan.step_5")
      ]
    };
  },
  computed: {},
  created() {
    this.setDisplayTopNavigation(false);
    this.setDisplayProgressBar(false);
    this.setCurrentPage("PaydayLoanIndex");
    this.resetSession();
  },
  mounted() {
    // this.initAdsModal();
  },
  methods: {
    ...mapMutations({
      setCurrentStep: "paydayLoan/SET_CURRENT_STEP",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      resetEkycInfo: "ekyc/RESET_CARD_INFO",
      resetCustomerStatus: "paydayLoan/RESET_CUSTOMER_STATUS",
      resetPaymentStatus: "paydayLoan/RESET_PAYMENT_STATUS",
      resetCustomerInfo: "customer/RESET_CUSTOMER_INFO",
      resetRateInfo: "customer/RESET_RATE_INFO",
      destroyAuth: "auth/DESTROY_AUTH",
      showModal: "modal/SHOW_MODAL"
    }),
    resetSession() {
      this.resetEkycInfo();
      this.resetCustomerStatus();
      this.resetPaymentStatus();
      this.destroyAuth();
      this.resetCustomerInfo();
      this.resetRateInfo();
    },

    initAdsModal() {
      // if (Configuration.value("VUE_APP_MAINTAIN") === "true") {
      //   return;
      // }
      // const endTime = new Date(PL_VALUE_DEFAULT.CLOSE_ADS_POPUP_TIME).getTime();
      //
      // const startTime = new Date(
      //   PL_VALUE_DEFAULT.OPEN_ADS_POPUP_TIME
      // ).getTime();
      //
      // const nowTime = new Date().getTime();
      // if (startTime < nowTime && nowTime < endTime) {
      // setTimeout(() => {
      //   this.showModal({ type: MODAL_TYPE.PL_ADS });
      // }, 500);
      // }
    }

    // countdownSuccess() {
    //   this.displayCountdown = false;
    // }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-index";
</style>
