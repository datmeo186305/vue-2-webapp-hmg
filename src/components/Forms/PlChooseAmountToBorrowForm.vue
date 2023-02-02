<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <div id="choose-amount-container">
        <!--        <div class="expected-amount-container">-->
        <!--          <div class="expected-amount-content">-->
        <!--            <h3>{{ $t("payday_loan.choose_amount.expected_amount") }}</h3>-->
        <!--            <p class="expected-price-text">-->
        <!--              {{ params.amount | formatPrice }}-->
        <!--            </p>-->
        <!--            <p class="service-price-box">-->
        <!--              {{ $t("payday_loan.choose_amount.service_fee") }}-->
        <!--              <span :class="{ 'applied-voucher': appliedVoucher }">{{-->
        <!--                serviceFee | formatPrice-->
        <!--              }}</span>-->
        <!--            </p>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="choose-amount-box">
          <!--  Amount  -->
          <ValidationProvider
            :name="$t('payday_loan.choose_amount.amount')"
            rules="required"
            v-slot="{ passed, errors }"
          >
            <div class="pl-label-container">
              <label class="pl-label require-field"
                >{{ $t("payday_loan.choose_amount.amount") }}
              </label>
              <p class="pl-label-suggest">
                {{ $t("payday_loan.choose_amount.amount_suggest") }}
              </p>
            </div>
            <pl-field>
              <div class="pl-amount-range-process-bar">
                <p class="pl-range-value">
                  {{ minValue | formatMillionPrice }}
                </p>
                <vue-slider
                  class="pl-vue-slider"
                  ref="slider"
                  v-model="params.amount"
                  :min="minValue"
                  :max="maxValue"
                  :dot-size="40"
                  :width="'100%'"
                  :tooltip="'false'"
                  :tooltip-class="'pl-tooltip-class'"
                  :process-class="'pl-process-class'"
                  :interval="stepValue"
                >
                  <template slot="dot">
                    <div class="vue-slider-dot-handle">
                      <p class="vue-slider-dot-value">
                        {{ expectedAmount }}
                      </p>
                    </div>
                  </template>
                </vue-slider>
                <p class="pl-range-value">
                  {{ maxValue | formatMillionPrice }}
                </p>
              </div>
              <div class="pl-invalid-feedback" v-if="errors[0]">
                {{ errors[0] }}
              </div>
            </pl-field>
          </ValidationProvider>
        </div>

        <div class="pl-space-between-content">
          <ValidationProvider
            :name="$t('payday_loan.choose_amount.loan_purpose')"
            rules=""
            v-slot="{ passed, errors }"
          >
            <!--          <label class="pl-label require-field pl-space-between-content"-->
            <!--            >{{ $t("payday_loan.choose_amount.loan_purpose") }}-->
            <!--          </label>-->
            <pl-field>
              <pl-select
                :options="loanPurposeOptions"
                label="name"
                v-model="params.purpose"
                :initValue="initValueSelect.loanPurpose"
                :placeholder="$t('payday_loan.choose_amount.loan_purpose')"
              />
            </pl-field>
            <div class="pl-invalid-feedback" v-if="errors[0]">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>

        <!-- Fee detail -->
        <div class="col-md-12 pl-space-between-content ">
          <div class="loan-detail-container">
            <div class="loan-detail-item loan-row">
              <p class="amount-detail-label">
                {{ $t("payday_loan.choose_amount.expected_amount") }}
              </p>
              <p id="choose-amount-number">
                {{ params.amount | formatPrice }}
              </p>
            </div>
            <div class="pl-divider" />
            <div class="loan-detail-item loan-row">
              <div>
                <p class="amount-detail-label d-inline-flex">
                  {{ $t("payday_loan.choose_amount.service_fee") }}
                </p>
                <p class="desc-fee">
                  {{ $t("payday_loan.choose_amount.desc_service_fee") }}
                </p>
              </div>
              <p class="amount-detail-value">
                {{ serviceFee | formatPrice }}
              </p>
            </div>
            <div class="pl-divider" />
            <div class="loan-detail-item loan-row">
              <p class="amount-detail-label">
                {{ $t("payday_loan.choose_amount.process_fee") }}
              </p>
              <p class="amount-detail-value">
                {{ processFee | formatPrice }}
              </p>
            </div>
            <div class="pl-divider" />
            <div class="loan-detail-item loan-row">
              <p class="amount-detail-label">
                {{ $t("payday_loan.choose_amount.discount_number") }}
              </p>
              <p class="amount-detail-value" id="discount-fee">
                - {{ discount | formatPrice }}
              </p>
            </div>
            <div class="pl-divider" />
            <div class="loan-detail-item loan-row">
              <div>
                <p class="amount-detail-label d-inline-flex">
                  {{ $t("payday_loan.choose_amount.vat_fee") }}
                </p>
                <p class="desc-fee">
                  {{ $t("payday_loan.choose_amount.desc_vat_fee") }}
                </p>
              </div>
              <p class="amount-detail-value">
                {{ vatFee | formatPrice }}
              </p>
            </div>
            <div class="pl-divider" />
            <div class="loan-detail-item loan-row">
              <p class="amount-detail-label">
                {{ $t("payday_loan.choose_amount.total_price") }}
              </p>
              <p class="amount-detail-value" id="total-fee">
                {{ loanFeeTotal | formatPrice }}
              </p>
            </div>

            <pl-inline-message :message-type="'INFORMATION'">
              {{ $t("payday_loan.choose_amount.info") }}
            </pl-inline-message>
          </div>
        </div>

        <div class="pl-space-between-content">
          <pl-field>
            <pl-apply-discount
              v-model="voucherCode"
              :apply-status="applyVoucherStatus"
              type="text"
              name="discount"
              :placeholder="$t('payday_loan.choose_amount.enter_discount_code')"
              @applyVoucher="applyVoucher"
            />
          </pl-field>
          <div class="pl-invalid-feedback" v-if="applyVoucherError">
            {{ applyVoucherError }}
          </div>
        </div>

        <div class="choose-voucher-container">
          <button type="button" @click="chooseVoucher">
            {{ $t("payday_loan.choose_amount.choose_voucher") }}
          </button>
        </div>
      </div>

      <!-- guaranteed assets -->
      <div class="pl-space-between-box">
        <h2 class="pl-headline">
          {{ $t("payday_loan.choose_amount.guaranteed_assets") }}
        </h2>

        <!--        <p class="pl-type-assets">-->
        <!--          {{ $t("payday_loan.choose_amount.type_assets") }}-->
        <!--        </p>-->
        <!--  guaranteed assets upload area -->
        <div class="pl-image-upload">
          <image-upload-area
            v-model="collateralDocumentImg"
            :image-src="collateralDocumentImg"
            :init-value="initCollateralDocumentImg"
            :placeholder-image-src="'/img/pl/uploadimage.svg'"
            :filled-title="
              $t('payday_loan.choose_amount.filled_collateral_document')
            "
            :upload-title="$t('payday_loan.choose_amount.collateral_document')"
            :upload-hint="
              $t('payday_loan.choose_amount.hint_collateral_document')
            "
            :required="true"
            :isManualUploadFile="true"
            rules="required|size:20000|mimes:application/pdf,image/png,image/jpeg,image/jpg,application/acrobat,application/x-pdf,applications/vnd.pdf,text/pdf,text/x-pdf,application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed,application/octet-stream"
            @receiveResult="receiveResult"
          />
        </div>

        <pl-inline-message
          :message-type="'INFORMATION'"
          class="pl-choose-amount-info"
        >
          <p class="have-not-collateral-document-text">
            <span
              v-html="
                $t('payday_loan.choose_amount.have_not_collateral_document')
              "
            />
            <a href="javascript:void(0)" @click="showExample">{{
              $t("payday_loan.choose_amount.see_illustrations")
            }}</a>
          </p>
        </pl-inline-message>
      </div>

      <div class="text-center pl-space-between-box choose-amount-submit-btn">
        <pl-button
          :type="disabledBtn ? 'button' : 'submit'"
          id="pl-choose-amount-btn-submit"
          class="btn-primary"
          :disabled="disabledBtn"
        >
          {{ $t("common.confirm") }}
        </pl-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlField from "../Field/PlField";
import PlButton from "../Buttons/PlButton";
import ImageUploadArea from "../../pages/PaydayLoan/components/ImageUploadArea";
import vueSlider from "vue-slider-component";
import PlInlineMessage from "../../pages/PaydayLoan/components/InlineMessage";

import { MODAL_TYPE, PL_VALUE_DEFAULT } from "../../helpers/constants";
import { mapGetters, mapMutations } from "vuex";

import moment from "moment";
import PlApplyDiscount from "../Inputs/PlApplyDiscount";
import { LoanService } from "../../services/paydayLoan/loan.service";
import PlSelect from "../Inputs/PlSelect";

export default {
  name: "PlChooseAmountToBorrowForm",
  components: {
    PlSelect,
    PlApplyDiscount,
    PlInlineMessage,
    ImageUploadArea,
    PlButton,
    PlField,
    vueSlider
  },
  props: {
    customerInfo: {
      type: [Object, null]
    },
    chosenVoucher: {
      type: [Object, null]
    }
  },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      minValue: PL_VALUE_DEFAULT.MIN_VALUE,
      maxValue: PL_VALUE_DEFAULT.MAX_VALUE,
      stepValue: PL_VALUE_DEFAULT.STEP_VALUE,
      repaymentVaFee: PL_VALUE_DEFAULT.FIXED_REPAYMENT_VA_FEE,
      disbursementFee: PL_VALUE_DEFAULT.FIXED_DISBURSEMENT_FEE,
      params: {
        amount: PL_VALUE_DEFAULT.MIN_VALUE,
        collateralDocument: null,
        purpose: null
      },
      loanPurposeOptions: [
        {
          value: "Chi phí sinh hoạt thiết yếu",
          name: "Chi phí sinh hoạt thiết yếu"
        },
        {
          value: "Chi phí y tế",
          name: "Chi phí y tế"
        },
        {
          value: "Chi phí bảo hiểm",
          name: "Chi phí bảo hiểm"
        },
        {
          value: "Chi phí giáo dục",
          name: "Chi phí giáo dục"
        },
        {
          value: "Chi phí phát sinh đột xuất",
          name: "Chi phí phát sinh đột xuất"
        },
        {
          value: "Đầu tư",
          name: "Đầu tư"
        },
        {
          value: "Khác",
          name: "Khác"
        }
      ],
      initValueSelect: {
        loanPurpose: null
      },
      voucherTransactionId: null,
      voucherCode: null,
      applyVoucherError: null,
      applyVoucherStatus: false,
      collateralDocumentImg: null,
      initCollateralDocumentImg: null,
      appliedVoucher: null
    };
  },
  computed: {
    ...mapGetters({
      customerMobile: "customer/currentCustomerMobile",
      customerId: "customer/currentCustomerId"
    }),
    expectedAmount() {
      let fractionDigits = (this.params.amount / 1000000) % 1 !== 0 ? 1 : 0;
      return (this.params.amount / 1000000).toFixed(fractionDigits);
    },
    processFee() {
      return this.disbursementFee + this.repaymentVaFee;
    },
    discount() {
      if (!this.appliedVoucher) {
        return 0;
      }
      return this.serviceFee * this.appliedVoucher.percentage >=
        this.appliedVoucher.maxValue
        ? this.appliedVoucher.maxValue
        : (1 - this.appliedVoucher.percentage) * this.serviceFee;
    },
    serviceFee() {
      let feeAmount = PL_VALUE_DEFAULT.SERVICE_FEE_RATIO * this.params.amount;
      if (feeAmount < PL_VALUE_DEFAULT.MIN_SERVICE_FEE) {
        feeAmount = PL_VALUE_DEFAULT.MIN_SERVICE_FEE;
      }
      return feeAmount;
    },
    vatFee() {
      return (
        (this.serviceFee - this.discount) * PL_VALUE_DEFAULT.VAT_FEE_PERCENT
      );
    },
    loanFeeTotal() {
      return this.serviceFee + this.processFee + this.vatFee - this.discount;
    }
  },
  watch: {
    chosenVoucher: {
      handler: function(newVal) {
        if (!newVal) {
          return;
        }
        this.voucherCode = newVal.code;
        this.applyVoucher(newVal.code);
      },
      deep: true,
      immediate: true
    },
    voucherCode(newVal) {
      if (newVal !== this.voucherTransaction) {
        this.applyVoucherStatus = false;
        this.appliedVoucher = null;
        this.voucherTransaction = null;
      }
    },
    voucherTransaction: {
      handler: function() {
        this.$emit("resetChosenVoucher");
      },
      deep: true,
      immediate: true
    },
    customerInfo: {
      handler: function(newVal) {
        this.initProfile(newVal);
      },
      deep: true
    }
  },
  mounted() {
    this.initProfile(this.customerInfo);
    this.getListPromotion();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    chooseVoucher() {
      this.showModal({ type: MODAL_TYPE.PL_CHOOSE_VOUCHER, content: "" });
    },
    showExample() {
      this.$emit("showExample");
    },
    submit() {
      if (this.disabledBtn) return;
      this.disabledBtn = true;

      // Re-enable after 1 seconds
      this.timeout = setTimeout(() => {
        this.disabledBtn = false;
      }, 1000);

      this.$emit("submit", {
        ...this.params,
        purpose: this.params.purpose ? this.params.purpose.value : null,
        serviceFee: this.serviceFee,
        voucherTransactionId: this.voucherTransactionId
      });
    },
    async receiveResult(image, file) {
      this.params.collateralDocument = file;
    },

    initProfile(customerInfo) {
      //Get info from customer info svc
      if (customerInfo.annualIncome) {
        this.maxValue = this.getMaxValue(parseFloat(customerInfo.annualIncome));
        if ((this.maxValue / 500000) % 2 === 0) {
          this.params.amount = Math.round(this.maxValue / 2);
        } else {
          this.params.amount = Math.round((this.maxValue + 500000) / 2);
        }
      }
      this.params.collateralDocument = this.collateralDocumentImg = this.initCollateralDocumentImg =
        customerInfo.collateralDocument;
    },

    async applyVoucher(voucher) {
      if (!voucher) return;
      const validVoucher = this.validatePromotion(voucher);

      if (!validVoucher) {
        this.handleValidatePromotionError();
        return;
      }

      this.appliedVoucher = await this.getDetailVoucher(voucher);

      if (
        !this.appliedVoucher ||
        !this.appliedVoucher.voucherTransactionList ||
        this.appliedVoucher.voucherTransactionList.length === 0
      ) {
        let voucherTransactionResponse = await this.createVoucherTransaction(
          voucher
        );
        if (
          voucherTransactionResponse.responseCode !== 200 ||
          !voucherTransactionResponse.result
        ) {
          return;
        }
        this.voucherTransactionId = voucherTransactionResponse.result.id;
      } else {
        this.voucherTransactionId = this.appliedVoucher.voucherTransactionList[0].id;
      }

      this.applyVoucherStatus = true;
      this.applyVoucherError = null;
    },

    async getListPromotion() {
      const response = await LoanService.getListPromotion(this.customerId);
      if (
        !response ||
        !response.result ||
        !response.result ||
        response.responseCode !== 200
      ) {
        return;
      }
      this.vouchers = response.result;
    },

    handleValidatePromotionError() {
      this.applyVoucherError = this.$t(
        "payday_loan.choose_amount.voucher_error_default"
      );
      this.applyVoucherStatus = false;
      this.voucherTransactionId = null;
      this.appliedVoucher = null;
    },

    // async validatePromotion(voucher) {
    //   return await LoanService.validatePromotion(this.customerId, voucher, {
    //     showModalResponseCodeError: false,
    //     showModalResponseError: false
    //   });
    // },

    validatePromotion(appliedVoucher) {
      let isValidVoucher = false;
      if (!this.vouchers) return isValidVoucher;
      this.vouchers.forEach(voucher => {
        if (voucher.code === appliedVoucher) {
          isValidVoucher = true;
        }
      });
      return isValidVoucher;
    },

    async createVoucherTransaction(voucher) {
      return await LoanService.createVoucherTransaction({
        customerId: this.customerId,
        voucherCode: voucher,
        isEvent: false
      });
    },

    async getDetailVoucher(voucherCode) {
      const response = await LoanService.getDetailPromotion({
        voucherCode: voucherCode,
        customerId: this.customerId
      });
      if (!response) return null;
      return response.result;
    },

    getMaxValue(annualIncome) {
      let millionAnnualIncome =
        (this.getPercentOfSalaryByDay() * annualIncome) / 1000000;
      if (millionAnnualIncome % 1 >= 0.5) {
        return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
      }
      return Math.floor(millionAnnualIncome) * 1000000;
    },

    getPercentOfSalaryByDay() {
      let today = moment(new Date(), "DD/MM/YYYY").format("DD");
      switch (today) {
        case "10":
        case "11":
        case "12":
        case "13":
        case "14":
        case "15":
        case "16":
          return 50.0 / 100;
        case "17":
        case "18":
          return 57.5 / 100;
        case "19":
        case "20":
          return 65.0 / 100;
        case "21":
        case "22":
          return 72.5 / 100;
        default:
          return 80 / 100;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-choose-amount";
</style>
