<template>
  <div class="container-fluid">
    <div class="container  pl-padding-bottom-default">
      <div class="payday-loan-container">
        <div class="pl-space-between-box" id="payment-result-content">
          <!--  Frame success -->
          <!--          <template v-if="isSuccess">-->
          <!--            <div id="success-frame">-->
          <!--              <svg-->
          <!--                width="80"-->
          <!--                height="80"-->
          <!--                viewBox="0 0 16 16"-->
          <!--                fill="#ffffff"-->
          <!--                xmlns="http://www.w3.org/2000/svg"-->
          <!--              >-->
          <!--                <path-->
          <!--                  d="M5.66667 11.0572L3.13807 8.5286C2.87772 8.26827 2.45561 8.26827 2.19526 8.5286C1.93491 8.78893 1.93491 9.21107 2.19526 9.4714L5.19526 12.4714C5.45561 12.7317 5.87772 12.7317 6.13807 12.4714L13.4714 5.13807C13.7317 4.87772 13.7317 4.45561 13.4714 4.19526C13.2111 3.93491 12.7889 3.93491 12.5286 4.19526L5.66667 11.0572Z"-->
          <!--                  fill="#ffffff"-->
          <!--                />-->
          <!--              </svg>-->
          <!--            </div>-->
          <!--            <p class="pl-space-between-content text-center text-payment-result">-->
          <!--              {{ $t("payday_loan.payment_result.payment_success") }}-->
          <!--            </p>-->
          <!--          </template>-->

          <!--  Frame failed -->
          <!--          <template v-else>-->
          <!--            <div id="fail-frame">-->
          <!--              <svg-->
          <!--                width="80"-->
          <!--                height="80"-->
          <!--                viewBox="0 0 80 80"-->
          <!--                fill="none"-->
          <!--                xmlns="http://www.w3.org/2000/svg"-->
          <!--              >-->
          <!--                <path-->
          <!--                  d="M36.864 9.27404C40.33 7.35434 44.6567 8.4698 46.7827 11.7415L47.0587 12.2009L72.922 58.8952C73.538 60.0072 73.8613 61.2578 73.8613 62.5292C73.8613 66.4985 70.7773 69.7478 66.8747 70.0118L66.3613 70.0292H14.642C13.371 70.0292 12.1208 69.7062 11.0088 69.0905C7.5427 67.1712 6.19256 62.9115 7.83776 59.3735L8.08073 58.8958L33.9367 12.2017C34.6183 10.9705 35.633 9.95597 36.864 9.27404ZM40.504 53.3395C38.6653 53.3395 37.175 54.8298 37.175 56.6682C37.175 58.5068 38.6653 59.9972 40.504 59.9972C42.3423 59.9972 43.8327 58.5068 43.8327 56.6682C43.8327 54.8298 42.3423 53.3395 40.504 53.3395ZM40.4967 26.6604C38.7873 26.661 37.3787 27.9483 37.187 29.6062L37.1647 29.9949L37.1707 46.6645L37.193 47.0532C37.3863 48.7108 38.7957 49.9972 40.505 49.9965C42.2147 49.9962 43.623 48.7088 43.815 47.0508L43.8373 46.6622L43.8313 29.9925L43.8087 29.6038C43.6157 27.946 42.206 26.6598 40.4967 26.6604Z"-->
          <!--                  fill="white"-->
          <!--                />-->
          <!--              </svg>-->
          <!--            </div>-->
          <!--            <p class="pl-space-between-content text-center text-payment-result">-->
          <!--              {{ $t("payday_loan.payment_result.payment_failed") }}-->
          <!--            </p>-->
          <!--            <p-->
          <!--              class="pl-payment-result-support-contact"-->
          <!--              v-html="$t('payday_loan.payment_result.support_contact')"-->
          <!--            />-->
          <!--          </template>-->
          <!--          <ul class="pl-payment-result-list pl-space-between-content">-->
          <!--            &lt;!&ndash;            <li class="pl-payment-result-list-item">&ndash;&gt;-->
          <!--            &lt;!&ndash;              <p class="pl-payment-result-list-item-label">&ndash;&gt;-->
          <!--            &lt;!&ndash;                {{ $t("payday_loan.payment_result.payment_period") }}&ndash;&gt;-->
          <!--            &lt;!&ndash;              </p>&ndash;&gt;-->
          <!--            &lt;!&ndash;              <p class="pl-payment-result-list-item-content">&ndash;&gt;-->
          <!--            &lt;!&ndash;                {{ currentLoan.paymentPeriod | formatDate }}&ndash;&gt;-->
          <!--            &lt;!&ndash;              </p>&ndash;&gt;-->
          <!--            &lt;!&ndash;            </li>&ndash;&gt;-->
          <!--            <li class="pl-payment-result-list-item">-->
          <!--              <p class="pl-payment-result-list-item-label">-->
          <!--                {{ $t("payday_loan.payment_result.payment_date") }}-->
          <!--              </p>-->
          <!--              <p class="pl-payment-result-list-item-content">-->
          <!--                {{ currentLoan.paymentDate | formatDate }}-->
          <!--              </p>-->
          <!--            </li>-->
          <!--            <li class="pl-payment-result-list-item">-->
          <!--              <p class="pl-payment-result-list-item-label">-->
          <!--                {{ $t("payday_loan.payment_result.amount") }}-->
          <!--              </p>-->
          <!--              <p class="pl-payment-result-list-item-content">-->
          <!--                {{ currentLoan.expectedAmount | formatPrice }}-->
          <!--              </p>-->
          <!--            </li>-->
          <!--            <li class="pl-payment-result-list-item">-->
          <!--              <p class="pl-payment-result-list-item-label">-->
          <!--                {{ $t("payday_loan.payment_result.loan_code") }}-->
          <!--              </p>-->
          <!--              <p class="pl-payment-result-list-item-content">-->
          <!--                {{ currentLoan.loanCode }}-->
          <!--              </p>-->
          <!--            </li>-->
          <!--          </ul>-->

          <!--          <div class="text-center" id="callback-payment-actions">-->
          <!--            <pl-button class="btn-primary" @click="redirectToCurrentLoanPage">{{-->
          <!--              $t("payday_loan.payment_result.back_to_home")-->
          <!--            }}</pl-button>-->
          <!--            <pl-button class="btn-secondary">{{-->
          <!--              $t("payday_loan.payment_result.view_loan_detail")-->
          <!--            }}</pl-button>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { LoanService } from "../../services/paydayLoan/loan.service";
import { PaymentService } from "../../services/paydayLoan/payment.service";
import base64 from "base-64";
import {
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS
} from "../../helpers/constants";
import formatSlug from "@/core/utils/format-slug";
import Configuration from "@/helpers/configuration";

export default {
  name: "PaymentResult",
  components: {},
  data() {
    return {
      currentLoan: {
        status: null,
        loanCode: null,
        expectedAmount: null
      },
      isSuccess: true
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      coreToken: "auth/getCoreToken"
    })
  },
  mounted() {
    this.setDisplayTopNavigation(false);
    this.setDisplayProgressBar(false);
    // this.getActiveLoan();
    this.showLoading({
      content: {
        title: this.$t("payday_loan.in_progress"),
        content: this.$t("payday_loan.wait_a_minute")
      }
    });
    setTimeout(() => {
      this.callWebHookRepayment();
      this.hideLoading();
      this.checkResultData();
    }, 5000);
  },
  methods: {
    ...mapActions({
      showError: "modal/openErrorModal",
      createNewPaydayLoan: "paydayLoan/createNewPaydayLoan"
    }),
    ...mapMutations({
      setDisplayTopNavigation: "paydayLoan/SET_DISPLAY_TOP_NAVIGATION",
      setDisplayProgressBar: "paydayLoan/SET_DISPLAY_STEP_PROGRESS_BAR",
      setCurrentPage: "paydayLoan/SET_CURRENT_PAGE",
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING",
      setPaymentStatus: "paydayLoan/SET_PAYMENT_STATUS"
    }),
    redirectToCurrentLoanPage() {
      this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status: formatSlug(PAYDAY_LOAN_STATUS.CALLBACK_PAYMENT_RESULT)
        }
      });
    },
    checkResultData() {
      if (!this.$route.query.data || !this.$route.query.hmac) {
        this.$router.push({ name: "PaydayLoanIndex" });
        return;
      }
      let dataDecodedBase64 = base64.decode(this.$route.query.data);
      if (!dataDecodedBase64 || !dataDecodedBase64.status) {
        this.$router.push({
          name: "PlCurrentLoan",
          params: {
            status: formatSlug(PAYDAY_LOAN_STATUS.CALLBACK_PAYMENT_RESULT)
          }
        });
        return;
      }
      this.setPaymentStatus(dataDecodedBase64.status);
      if (dataDecodedBase64.status === GPAY_RESULT_STATUS.ORDER_SUCCESS) {
        this.$router.push({ name: "PaydayLoanIndex" });
        return;
      }
      this.$router.push({
        name: "PlCurrentLoan",
        params: {
          status: formatSlug(
            dataDecodedBase64.status ||
              PAYDAY_LOAN_STATUS.CALLBACK_PAYMENT_RESULT
          )
        }
      });
    },
    /**
     * Make sure the payment service gets the payment result if gpay doesn't call the webhook
     * @returns {Promise<void>}
     */
    async callWebHookRepayment() {
      if (!this.$route.query.data || !this.$route.query.hmac) {
        return;
      }
      await PaymentService.webhookRepaymentGpay(
        "PAYMENT_RESULT",
        this.$route.query.data,
        this.$route.query.hmac,
        {
          showLoader: false,
          showModalResponseCodeError: false,
          showModalResponseError: false
        }
      );
    },
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
        this.currentLoan.status = loanInfo.status;
        this.currentLoan.loanCode = loanInfo.loanCode;
        this.currentLoan.expectedAmount = loanInfo.expectedAmount || 0;
      }
    },
    handleGetActiveLoanError(response) {
      if (response.errorCode === "DO_NOT_ACTIVE_LOAN_ERROR") {
        this.createNewPaydayLoan();
        return;
      }

      this.showError({
        title:
          Configuration.value('VUE_APP_PRODUCTION') === "true"
            ? this.$t("common.error")
            : response.errorCode,
        content:
          response.message === "Network Error"
            ? this.$t("common.network_error")
            : Configuration.value('VUE_APP_PRODUCTION') === "true"
            ? this.$t("common.something_went_wrong")
            : response.message
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-layout";
#payment-result-content {
  max-width: 294px;
  margin: 0 auto;
  padding-top: 76px;
}
#success-frame {
  max-width: 120px;
  margin: 0 auto;
  max-height: 120px;
  padding: 20px;
  border-radius: 50%;
  background: linear-gradient(180deg, #00e4e4 0%, #00b373 100%);

  svg {
    max-width: 80px;
    max-height: 80px;
    width: 100%;
  }
}

#fail-frame {
  max-width: 120px;
  margin: 0 auto;
  max-height: 120px;
  padding: 20px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffcc00 0%, #fff5cc 100%);

  svg {
    max-width: 80px;
    max-height: 80px;
    width: 100%;
  }
}

#callback-payment-actions {
  margin-top: 64px;

  .pl-btn {
    max-width: 271px;
    &:last-child {
      margin-top: 8px;
    }
  }
}

.pl-payment-result-list {
  padding: 16px 0;
  border-top: 1px solid $grey-01;
  border-bottom: 1px solid $grey-01;
  max-width: 271px;
  margin: 24px auto 0;

  .pl-payment-result-list-item {
    display: flex;
    align-content: space-between;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .pl-payment-result-list-item-label {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: $grey-06;
    flex: none;
  }

  .pl-payment-result-list-item-content {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    text-align: right;
    color: $grey-08;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 8px;
    margin: 0;
    width: 100%;
  }
}

.pl-payment-result-support-contact {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  color: $system-color-orange;
  text-align: center;
}

.text-payment-result {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: $grey-08;
}
</style>
