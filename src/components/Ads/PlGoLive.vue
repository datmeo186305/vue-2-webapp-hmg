<template>
  <div class="pl-modal-ads-content">
    <img
        :src="'/img/pl/dismiss-white.svg'"
        alt=""
        class="dismiss-modal-btn"
        @click="closeModal"
    />
    <img
        :src="'/img/pl/voucher-img.png'"
        alt="voucher"
        id="voucher-popup-img"
        @click="redirectToSignIn"
    />
  </div>
</template>

<script>
export default {
  name: "PlGoLive",
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
    },
    redirectToSignIn() {
      this.$router.push({
        name: "PlSignIn",
        query: {
          utm_source: "voucher_monex",
          utm_medium: "popup",
          utm_campaign: "voucher_popup"
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.pl-modal-ads-content {
  .dismiss-modal-btn {
    position: absolute;
    top: 30px;
    right: 40px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  #voucher-popup-img {
    cursor: pointer;
  }
}
</style>
