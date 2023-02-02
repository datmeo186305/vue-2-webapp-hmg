<template>
  <div class="pl-modal-ads-content">
    <img
      :src="'/img/pl/dismiss-white.svg'"
      alt=""
      class="dismiss-modal-btn"
      @click="closeModal"
    />

    <img
      :src="'/img/pl/women-day-2021.png'"
      alt="voucher"
      id="voucher-popup-img"
      @click="redirectToSignIn"
    />

    <!--    <div id="pl-ads-actions">-->
    <!--      <a :href="linkIOS" target="_blank" rel="noopener" class="pl-ads-btn">-->
    <!--        {{ $t("payday_loan.ads.download_ios") }}-->
    <!--      </a>-->
    <!--      <a-->
    <!--        :href="linkAndroid"-->
    <!--        target="_blank"-->
    <!--        rel="noopener"-->
    <!--        class="pl-ads-btn"-->
    <!--        >{{ $t("payday_loan.ads.download_android") }}</a-->
    <!--      >-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "PlWomensDay",
  data() {
    return {
      linkAndroid:
        "https://play.google.com/store/apps/details?id=com.epayvn.monex",
      linkIOS:
        "itms-services://?action=download-manifest&url=https://monexprodstorage.blob.core.windows.net/ios-apps/MTrading.plist"
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    },
    redirectToSignIn() {
      this.$router.push({
        name: "PlSignIn",
        query: {
          utm_source: "international_women_day_2021",
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
.pl-modal-ads-content {
  //background: url(/img/pl/women-day-2021.png) no-repeat;
  position: relative;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;

  .dismiss-modal-btn {
    padding: 4px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    width: 24px;
    height: 24px;
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    z-index: 2;
  }

  #voucher-popup-img {
    width: 100%;
    max-width: 300px;
    min-height: 400px;
    min-width: 240px;
    cursor: pointer;
  }

  #pl-ads-actions {
    position: absolute;
    bottom: 18px;
    width: 100%;
    display: flex;
    align-content: space-between;
    gap: 8px;
    padding: 0 12px;

    .pl-ads-btn {
      width: 100%;
      display: inline-flex;
      place-content: center;
      background: #fdc939;
      border: 2px solid rgba(255, 255, 255, 0.5);
      box-sizing: border-box;
      border-radius: 40px;
      padding: 10px 0;
      font-family: $sfUiDisplay;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.1px;
      color: #503f16;

      &:hover {
        background: #ffdd80;
      }
    }
  }
}
</style>
