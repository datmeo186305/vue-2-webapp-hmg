<template>
  <div class="container-fluid pl-top-navigation">
    <div class="container" id="pl-top-nav-container">
      <div id="pl-top-nav-heading">
        <div class="pl-nav-left">
          <a
            href="javascript:void(0)"
            class="pl-prev-btn"
            v-if="displayLeftBtn && !disabledPrevBtn"
            @click="clickPrevBtn"
          >
            <img :src="'/img/pl/icon-left.svg'" alt="left" />
            <p v-if="leftTitle">{{ leftTitle }}</p>
          </a>
<!--          <a-->
<!--            href="javascript:void(0)"-->
<!--            class="pl-btn-logout"-->
<!--            v-else-->
<!--            @click="logout"-->
<!--          >-->
<!--            {{ $t("auth.logout") }}-->
<!--          </a>-->
        </div>
        <div class="payday-loan-container">
          <h3 class="pl-nav-title">{{ title }}</h3>
        </div>
        <div class="pl-nav-right" v-if="displayRightBtn">
          <a
            href="javascript:void(0)"
            class="pl-next-btn"
            @click="clickNextBtn"
          >
            <img :src="rightIcon" alt="right" />
            <p v-if="rightTitle">{{ rightTitle }}</p>
          </a>
        </div>
        <div class="pl-nav-right" v-else>
          <a href="tel:1900234583" class="pl-hotline-btn">
            <p v-if="!responsive">{{ $t("payday_loan.hotline") }}</p>
            <img :src="'/img/pl/hotline.svg'" alt="hotline" />
          </a>
        </div>
      </div>
      <div id="pl-top-nav-progress-step">
        <step-progress-bar
          ref="stepProgressBarCompRef"
          v-if="displayStepProgressBar"
          :initCurrentStep="currentStep"
          :stepTitles="stepProgressBarParams.stepTitles"
        />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from "../../lang/i18n";
import StepProgressBar from "../ProgressBars/StepProgressBar";
import { mapGetters } from "vuex";
export default {
  name: "PlTopNavigation",
  components: { StepProgressBar },
  props: {
    leftTitle: {
      type: String,
      default: null
    },
    rightTitle: {
      type: String,
      default: null
    },
    displayLeftBtn: {
      type: Boolean,
      default: false
    },
    displayRightBtn: {
      type: Boolean,
      default: false
    },
    rightIcon: {
      type: String,
      default: '/img/pl/icon-right.svg'
    },
    title: {
      type: String,
      default: i18n.t("payday_loan.salary_24h_title")
    },
    displayStepProgressBar: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stepProgressBarParams: {
        stepTitles: [
          this.$t("payday_loan.step_1"),
          this.$t("payday_loan.step_2"),
          this.$t("payday_loan.step_3"),
          this.$t("payday_loan.step_4"),
          this.$t("payday_loan.step_5")
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      currentStep: "paydayLoan/currentStep",
      currentCustomerStatus: "paydayLoan/currentCustomerStatus"
    }),
    disabledPrevBtn() {
      let pagesNotDisplayPrevBack = [
        "PlEKYC",
        "PlConfirmInformation",
        // "PlContractTermsOfService",
        "PlAdditionalInformation",
        "PlChooseAmountToBorrow",
        "PlAdditionalDocument"
      ];
      return pagesNotDisplayPrevBack.includes(this.$route.name);
    }
  },
  methods: {
    clickPrevBtn() {
      this.$emit("clickPrevBtn");
    },
    clickNextBtn() {
      this.$emit("clickNextBtn");
    },
    logout() {
      this.$router.push({ name: "PlSignIn" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-navigation";
</style>
