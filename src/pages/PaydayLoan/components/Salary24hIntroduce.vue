<template>
  <div id="salary-24h-introduce" class="container-fluid">
    <div class="container" id="salary-24h-introduce-container">
      <div class="payday-loan-container">
        <div class="salary-24h-introduce-content">
          <div class="payday-loan-24h-img-box">
            <img id="salary-24h-img" :src="'/img/pl/salary-24h.png'" alt="salary-0%-lai" />
          </div>
          <div>
            <p class="salary-24h-utilities">
              {{ $t("payday_loan.salary_24h_utilities") }}
            </p>
            <h2 class="salary-24h-title">
              {{ $t("payday_loan.salary_24h_title") }}
            </h2>
<!--            <p class="salary-24h-provider">-->
<!--              {{ $t("payday_loan.salary_24h_provider") }}-->
<!--            </p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Salary24hIntroduce"
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-layout";
#salary-24h-introduce {
  background: linear-gradient(180deg, #f0f7ff 0%, rgba(240, 247, 255, 0) 100%);
  height: 200px;
}
#salary-24h-introduce-container {
  height: 100%;
  .payday-loan-container {
    height: 100%;
    border-bottom: 1px solid $grey-13;
  }
}
.salary-24h-introduce-content {
  text-align: center;
  height: 100%;
}
.payday-loan-24h-img-box img {
  display: initial;
  padding: 24px 0 8px 0;
}
.salary-24h-utilities {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 8px;
  margin-bottom: 8px;
  text-align: center;
  text-transform: uppercase;

  /* Monex Color / 00 */

  color: $monex-color-00;
}

.salary-24h-title {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 33px;
  text-align: center;
  margin-bottom: 8px;

  /* Monex Color / 01 */

  color: $monex-color-01;
}

.salary-24h-provider {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  margin-bottom: 0;

  /* Monex Color / 01 */

  color: $monex-color-01;
}

#salary-24h-img {
  width: 80px;
  height: 112px;
}
</style>
