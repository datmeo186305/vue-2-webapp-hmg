<template>
  <div id="notfound-component" class="container-fluid">
    <div id="notfound-component-content">
      <div id="pl-bg-notfound" />
      <div
        id="pl-notfound-body"
        class="container-fluid pl-padding-bottom-with-provider"
      >
        <div class="container" id="pl-notfound-container">
          <div class="payday-loan-container">
            <div id="pl-notfound-content">
              <p class="not-found-title">{{ $t("not_found.have_error") }}</p>
              <img :src="'/img/pl/404.svg'" alt="404" class="pl-notfound-img" />
              <pl-button
                id="pl-not-found-back-to-home-btn"
                class="btn-primary pl-btn-notfound"
                @click="backToHome"
              >
                {{ $t("not_found.back_to_login") }}
              </pl-button>
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
  </div>
</template>

<script>
import PlButton from "../../components/Buttons/PlButton";
export default {
  name: "PlNotFound",
  components: { PlButton },
  methods: {
    backToHome() {
      this.$router.push({ name: "Home" });
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-layout";
#notfound-component-content {
  min-height: 100vh;
  position: relative;
}
#pl-bg-notfound {
  background: linear-gradient(180deg, #f0f7ff 0%, rgba(240, 247, 255, 0) 100%);
  height: 200px;
  width: 100%;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
}

#pl-notfound-body {
  padding-top: 80px;

  #pl-notfound-container {
    text-align: center;
  }

  .not-found-title {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: $grey-08;
    margin-bottom: 8px;
  }

  .pl-btn-notfound {
    margin-top: 8px;
    max-width: 200px;
  }

  .pl-notfound-content {
    text-align: center;
  }

  .pl-notfound-img {
    max-width: 400px;
    max-height: 400px;
    width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  #pl-notfound-body {
    .pl-notfound-img {
      max-width: 240px;
      max-height: 240px;
    }
  }
}
</style>
