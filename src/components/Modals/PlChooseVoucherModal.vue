<template>
  <modal
    :type="modalType"
    :id="'payday-loan-choose-voucher'"
    :ariaLabelledby="'myModalLabel-12'"
    :clickOutsideToClose="true"
    :showCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-choose-voucher-content">
        <img
          :src="'/img/pl/dismiss.svg'"
          alt=""
          class="dismiss-modal-btn"
          @click="closeModal"
        />
        <p
          class="pl-modal-choose-voucher-title"
          v-if="vouchers && vouchers.length > 0"
        >
          {{ $t("payday_loan.choose_amount.choose_voucher") }}
        </p>
        <p class="pl-modal-choose-voucher-title" v-else>
          {{ $t("payday_loan.choose_amount.empty_vouchers") }}
        </p>

        <section
          class="pl-modal-choose-voucher-section"
          v-for="(voucher, index) in vouchers"
          :key="'voucher' + index"
        >
          <div class="name-voucher-container">
            <p class="voucher-name">{{ voucher.code }}</p>
            <button type="button" @click="apply(voucher)">
              {{ $t("payday_loan.choose_amount.apply") }}
            </button>
          </div>

          <div class="desc-voucher-container">
            <p>{{ voucher.content }}</p>
          </div>

          <div class="condition-voucher-container">
            <button type="button" @click="expand(voucher)">
              <span>{{ $t("payday_loan.choose_amount.apply_condition") }}</span>
              <img
                :src="'/img/pl/icon-right.svg'"
                alt="right"
                :class="{ 'voucher-expanded': voucher.expanded }"
              />
            </button>
            <div
              v-html="voucher.description"
              class="voucher-condition-content"
              v-show="voucher.expanded"
            />
          </div>
        </section>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import { mapGetters } from "vuex";
import { LoanService } from "../../services/paydayLoan/loan.service";
import i18n from "../../lang/i18n";

export default {
  name: "PlChooseVoucherModal",
  components: { Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_CHOOSE_VOUCHER,
      vouchers: []
    };
  },
  computed: {
    ...mapGetters({
      customerId: "customer/currentCustomerId",
      modalContent: "modal/currentModalContent"
    })
  },
  mounted() {
    this.getListPromotion();
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    },
    apply(voucher) {
      this.$emit("applyVoucher", voucher);
      this.closeModal();
    },
    expand(voucher) {
      voucher.expanded = !voucher.expanded;
    },
    async getListPromotion() {
      const response = await LoanService.getListPromotion(this.customerId);
      if (!response || !response.result || response.responseCode !== 200) {
        return;
      }
      response.result.forEach(voucher => {
        voucher.expanded = false;
        voucher.content = this.$t("payday_loan.choose_amount.voucher_content", {
          percentage: this.formatPercent(voucher.percentage),
          max_value: this.formatPrice(voucher.maxValue)
        });
        voucher.code = voucher.code || "";
      });
      this.vouchers = response.result;
    },
    formatPercent(value) {
      return (value ? (value * 100).toFixed(0) : 0) + "%";
    },
    formatPrice(value) {
      if (!value) return "";
      let val = (value / 1).toFixed(0).replace(".", ",");
      return (
        val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        " " +
        i18n.t("common.vnd")
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

.name-voucher-container {
  display: flex;
  align-content: space-between;
  padding: 12px 12px 0;

  button {
    width: auto;
    padding: 0;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: right;
    color: $system-color-blue;
    border: none;
    background: transparent;
    flex: none;

    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }

  .voucher-name {
    width: 100%;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: $grey-10;
  }
}

.desc-voucher-container {
  margin-top: 8px;
  padding: 0 12px 12px;

  p {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 13px;
    color: $grey-06;
  }
}

.condition-voucher-container {
  border-top: 1px dashed $grey-01;
  padding: 12px;

  .voucher-expanded {
    transition: transform 0.3s;
    transform: rotate(180deg);
  }

  button {
    border: none;
    background: transparent;
    width: 100%;
    display: flex;
    align-content: space-between;
    padding: 0;
    gap: 8px;
    align-items: center;

    span {
      width: 100%;
      font-family: $sfUiDisplay;
      font-style: normal;
      font-weight: 600;
      font-size: 11px;
      line-height: 13px;
      color: $grey-08;
      text-align: left;
    }

    img {
      flex: none;
      width: 16px;
      height: 16px;
      transition: transform 0.3s;
    }

    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }

  .voucher-condition-content {
    margin-top: 8px;
    width: 100%;
    overflow: hidden;
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: $grey-08;

    ul {
      list-style: unset;
      padding-left: 30px;
      margin: 0;
    }
  }
}

.pl-modal-choose-voucher-section {
  background: $white;
  border: 1px solid $grey-02;
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 16px;
}
</style>
