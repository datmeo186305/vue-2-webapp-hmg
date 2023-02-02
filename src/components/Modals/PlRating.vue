<template>
  <modal
    :type="modalType"
    :id="'payday-loan-rating'"
    :ariaLabelledby="'myModalLabel-29'"
    :clickOutsideToClose="false"
    :showCloseBtn="false"
    :showTopCloseBtn="false"
    @closeModal="closeModal"
  >
    <template slot="body">
      <div class="pl-modal-rating-body">
        <img
          :src="'/img/pl/dismiss.svg'"
          alt=""
          class="dismiss-modal-btn"
          @click="closeModal()"
        />
        <div class="rating-dialog">
          <div class="title">{{ $t("payday_loan.rating.modal_title") }}</div>
          <div class="description">
            {{ $t("payday_loan.rating.modal_desc") }}
          </div>
          <div class="d-flex flex-row justify-content-around emotion-row">
            <div
              class="emotion-box"
              v-for="(rateOption, index) in rateOptions"
              :class="{ 'chosen-rating': rate === rateOption.value }"
              @click="chooseRate(rateOption.value)"
              :key="'emotion-' + index"
            >
              <div class="emotion" :class="rateOption.imgClass" />
              <div class="emotion-description">{{ rateOption.desc }}</div>
            </div>
          </div>

          <!--  SATISFIED   -->
          <template v-if="rate === 'SATISFIED' || rate === 'VERY_SATISFIED'">
            <p class="rating-question">
              {{ $t("payday_loan.rating.like_monex") }}
            </p>
            <div class="d-flex flex-wrap rating-tag-box">
              <div
                class="rating-tag-item"
                v-for="(opinion, i) in fastOpinions"
                :key="'rating-tag-' + i"
                :class="{ highlight: opinion.selected }"
                @click="chooseFastOpinion(opinion)"
              >
                {{ opinion.value }}
              </div>
            </div>
          </template>

          <!--  NOT_SATISFIED   -->
          <template
            v-if="rate === 'NOT_SATISFIED' || rate === 'SEMI_SATISFIED'"
          >
            <p class="rating-question">
              {{ $t("payday_loan.rating.need_improve") }}
            </p>
            <div class="d-flex flex-wrap rating-tag-box">
              <div
                class="rating-tag-item"
                v-for="(opinion, i) in needImproveOpinions"
                :key="'rating-tag-' + i"
                :class="{ highlight: opinion.selected }"
                @click="chooseFastOpinion(opinion)"
              >
                {{ opinion.value }}
              </div>
            </div>
          </template>

          <textarea
            v-model="customerOpinion"
            class="text-area pl-space-between-content"
            id="review"
            name="review"
            :placeholder="$t('payday_loan.rating.more_rate')"
          />

          <div class="text-center pl-space-between-box">
            <pl-button
              type="submit"
              class="btn-primary"
              @click="clickBtn()"
              id="submit-rating-btn"
            >
              {{ $t("payday_loan.rating.submit_text") }}
            </pl-button>
          </div>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "./Modal";
import { MODAL_TYPE } from "@/helpers/constants";
import { mapGetters, mapMutations } from "vuex";
import PlButton from "../Buttons/PlButton";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import { RATE_VALUE } from "../../helpers/constants";

export default {
  name: "PlRating",
  components: { PlButton, Modal },
  props: {},
  data() {
    return {
      modalType: MODAL_TYPE.PL_RATING,
      rateOptions: [
        {
          desc: this.$t("payday_loan.rating.not_satisfied"),
          value: RATE_VALUE.NOT_SATISFIED,
          imgClass: "sprite-group-4-weary-face"
        },
        {
          desc: this.$t("payday_loan.rating.semi_satisfied"),
          value: RATE_VALUE.SEMI_SATISFIED,
          imgClass: "sprite-group-4-disappointed-face"
        },
        {
          desc: this.$t("payday_loan.rating.normal"),
          value: RATE_VALUE.NORMAL,
          imgClass: "sprite-group-4-neutral-face"
        },
        {
          desc: this.$t("payday_loan.rating.satisfied"),
          value: RATE_VALUE.SATISFIED,
          imgClass: "sprite-group-4-smiling-face-with-smiling-eyes"
        },
        {
          desc: this.$t("payday_loan.rating.very_satisfied"),
          value: RATE_VALUE.VERY_SATISFIED,
          imgClass: "sprite-group-4-smiling-face-with-heart-eyes"
        }
      ],
      customerOpinion: "",
      rate: null,
      fastOpinions: [
        {
          value: this.$t("payday_loan.rating.fast_opinion_1"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.fast_opinion_2"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.fast_opinion_3"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.fast_opinion_4"),
          selected: false
        }
      ],
      needImproveOpinions: [
        {
          value: this.$t("payday_loan.rating.need_improve_opinion_1"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.need_improve_opinion_2"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.need_improve_opinion_3"),
          selected: false
        },
        {
          value: this.$t("payday_loan.rating.need_improve_opinion_4"),
          selected: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      currentRatingInfo: "customer/currentRateInfo"
    })
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL",
      resetRateInfo: "customer/RESET_RATE_INFO"
    }),
    closeModal() {
      this.$emit("closeModal");
      this.destroyModal();
      this.customerUpdateRating();
    },
    clickBtn() {
      this.$emit("click");
      this.customerUpdateRating();
    },

    async customerUpdateRating() {
      let customerOpinion = this.getCustomerOpinion();

      await CustomerService.updateRating(
        {
          id: this.currentRatingInfo.id,
          rate: this.rate,
          customerOpinion: customerOpinion
        },
        {
          showModalResponseCodeError: false,
          showModalResponseError: false
        }
      );

      this.resetRateInfo();
    },

    getCustomerOpinion() {
      let customerOpinion = this.customerOpinion;

      if (
        this.rate === RATE_VALUE.SATISFIED ||
        this.rate === RATE_VALUE.VERY_SATISFIED
      ) {
        for (let i = 0; i < this.fastOpinions.length; i++) {
          customerOpinion += this.fastOpinions[i].selected
            ? ". " + this.fastOpinions[i].value
            : "";
        }
      } else if (
        this.rate === RATE_VALUE.NOT_SATISFIED ||
        this.rate === RATE_VALUE.SEMI_SATISFIED
      ) {
        for (let i = 0; i < this.needImproveOpinions.length; i++) {
          customerOpinion += this.needImproveOpinions[i].selected
            ? ". " + this.needImproveOpinions[i].value
            : "";
        }
      }

      return customerOpinion;
    },

    chooseRate(rate) {
      this.rate = rate;

      this.fastOpinions.forEach(opinion => {
        opinion.selected = false;
      });
      this.needImproveOpinions.forEach(opinion => {
        opinion.selected = false;
      });
    },

    chooseFastOpinion(opinion) {
      opinion.selected = !opinion.selected;
    }
  }
};
</script>

<style scoped lang="scss"></style>
