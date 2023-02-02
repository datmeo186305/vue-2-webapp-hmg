<template>
  <div id="get-tng-info-failed">
    <div class="text-center">
      <div id="fail-frame">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.864 9.27404C40.33 7.35434 44.6567 8.4698 46.7827 11.7415L47.0587 12.2009L72.922 58.8952C73.538 60.0072 73.8613 61.2578 73.8613 62.5292C73.8613 66.4985 70.7773 69.7478 66.8747 70.0118L66.3613 70.0292H14.642C13.371 70.0292 12.1208 69.7062 11.0088 69.0905C7.5427 67.1712 6.19256 62.9115 7.83776 59.3735L8.08073 58.8958L33.9367 12.2017C34.6183 10.9705 35.633 9.95597 36.864 9.27404ZM40.504 53.3395C38.6653 53.3395 37.175 54.8298 37.175 56.6682C37.175 58.5068 38.6653 59.9972 40.504 59.9972C42.3423 59.9972 43.8327 58.5068 43.8327 56.6682C43.8327 54.8298 42.3423 53.3395 40.504 53.3395ZM40.4967 26.6604C38.7873 26.661 37.3787 27.9483 37.187 29.6062L37.1647 29.9949L37.1707 46.6645L37.193 47.0532C37.3863 48.7108 38.7957 49.9972 40.505 49.9965C42.2147 49.9962 43.623 48.7088 43.815 47.0508L43.8373 46.6622L43.8313 29.9925L43.8087 29.6038C43.6157 27.946 42.206 26.6598 40.4967 26.6604Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
    <p
      class="pl-space-between-content return-confirm-info-text"
      v-html="
        $t('payday_loan.confirm_information.return_confirm_information_desc')
      "
    />
    <div class="pl-space-between-content">
      <pl-button
        class="btn-primary"
        id="get-tng-info-failed-btn"
        type="button"
      >
        <a :href="zaloURL" target="_blank" rel="noopener">{{ $t("payday_loan.more_info")}}</a>
      </pl-button>
      <!--      <pl-button-->
      <!--        id="get-tng-info-failed-btn"-->
      <!--        type="button"-->
      <!--        class="btn-secondary"-->
      <!--        @click="clickReturnBtn"-->
      <!--      >-->
      <!--        {{ $t("payday_loan.confirm_information.return_confirm_information") }}-->
      <!--      </pl-button>-->
    </div>
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import { mapMutations } from "vuex";
import Configuration from "@/helpers/configuration";

export default {
  name: "GetTngInformationFailed",
  components: { PlButton },
  data() {
    return {
      zaloURL: Configuration.value('VUE_APP_ZALO_URL')
    }
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    clickReturnBtn() {
      this.$emit("clickReturnBtn");
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

#get-tng-info-failed {
  text-align: center;
  max-width: 343px;
  margin: 0 auto;

  img.sent-email-img {
    width: 80px;
    height: 80px;
  }

  .return-confirm-info-text {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding: 0 32px;

    /* Monex Color / 01 */

    color: $monex-color-01;
  }

  .get-tng-info-failed {
    background-color: $grey-00;
    border-radius: 4px;
    min-height: 329px;

    .get-tng-info-failed-title {
      font-family: $sfUiDisplay;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      margin: 0;
      padding-top: 16px;
      /* identical to box height */

      text-align: center;

      /* Grey / 08 */

      color: $grey-08;
    }
  }
}

#get-tng-info-failed-btn {
  max-width: 200px;

  a {
    color: $white;

    &:focus, &:hover, &:active {
      text-decoration: none;
    }
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
</style>
