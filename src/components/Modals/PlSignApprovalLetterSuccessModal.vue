<template>
  <modal
    :type="modalType"
    :id="'payday-loan-sign-approval-letter-success'"
    :ariaLabelledby="'myModalLabel-3'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-sign-approval-letter-success-content">
        <img
          :src="'/icon/group-women-day/img/women_day_title.png'"
          alt="women-day-title"
          id="women-day-title-popup-img"
        />

        <div id="group-mail-tick-women-day">
          <img
            :src="'/icon/group-women-day/img/women_day_mail.png'"
            alt="mail"
            id="women-day-mail-img"
          />
          <img
            :src="'/icon/group-women-day/img/women_day_tick.png'"
            alt="tick"
            id="women-day-tick-img"
          />
        </div>

        <div id="sign-approval-letter-content">
          <p id="sign-ap-success-title">
            {{ $t("payday_loan.ads.20_10_sign_approval_letter_success_title") }}
          </p>
          <p
              id="sign-ap-success-content"
              v-html="
            $t('payday_loan.ads.20_10_sign_approval_letter_success_content')
          "
          />
        </div>

        <div id="pl-ads-actions">
          <a
            href="javascript:void(0)"
            @click="redirectToNextStep"
            id="pl-next-btn"
          >
            {{ $t("payday_loan.ads.20_10_btn_next") }}
          </a>
          <a
            href="javascript:void(0)"
            @click="redirectToIndex"
            id="pl-home-btn"
            >{{ $t("payday_loan.ads.20_10_btn_home") }}</a
          >
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";

export default {
  name: "PlSignApprovalLetterSuccessModal",
  components: { Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_SIGN_APPROVAL_LETTER_SUCCESS
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    },
    redirectToNextStep() {
      this.$router.push({
        name: "PlSignContractTermsSuccess",
        query: {
          utm_source: "sign_letter_success_next_20_10_2021",
          utm_medium: "popup",
          utm_campaign: "event_popup"
        }
      });
    },
    redirectToIndex() {
      this.$router.push({
        name: "PaydayLoanIndex",
        query: {
          utm_source: "sign_letter_success_home_20_10_2021",
          utm_medium: "popup",
          utm_campaign: "event_popup"
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

#group-mail-tick-women-day {
  text-align: center;
  position: relative;
  width: 64px;
  margin: 0 auto;
  height: 64px;
  display: flex;

  #women-day-mail-img {
    width: 58px;
    height: 58px;
  }
  #women-day-tick-img {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
  }
}

.pl-modal-sign-approval-letter-success-content {
  background: #ef4964;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.05),
    0px 16px 32px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

#sign-approval-letter-content {
  margin: 12px 0 36px;
  padding: 0 40px;

  #sign-ap-success-title {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: $white;
  }

  #sign-ap-success-content {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.1px;
    color: $white;
    margin-top: 12px;
  }
}
</style>
