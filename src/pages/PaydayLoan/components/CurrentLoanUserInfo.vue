<template>
  <div class="current-loan-user-info">
    <div class="current-loan-headline">
      <h2 class="pl-headline current-loan-info-title">
        {{ $t("payday_loan.current_loan.user_info") }}
      </h2>
    </div>
    <div id="current-loan-user-info-container">
      <ul class="pl-list">
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.full_name") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.fullName }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.date_of_birth") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.dateOfBirth }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.sex") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.gender }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.identifier") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.identityNumberOne }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.working_time") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.workingTime }}
          </p>
        </li>
<!--        <li class="pl-list-item">-->
<!--          <p class="pl-list-item-label">-->
<!--            {{ $t("payday_loan.current_loan.contract_term") }}-->
<!--          </p>-->
<!--          <p class="pl-list-item-content">-->
<!--            {{ userInfo.contractTerm }}-->
<!--          </p>-->
<!--        </li>-->
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.total_salary") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.totalSalary | formatPrice }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.email") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.email }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.account_receive_salary") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.accountReceiveSalary }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.bank") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.bank }}
          </p>
        </li>
        <li class="pl-list-item">
          <p class="pl-list-item-label">
            {{ $t("payday_loan.current_loan.phone_number") }}
          </p>
          <p class="pl-list-item-content">
            {{ userInfo.phoneNumber }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlCurrentLoanUserInfo",
  props: {
    userInfo: {
      type: [Object, null]
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
.current-loan-headline {
  display: flex;
  align-content: space-between;
  align-items: center;
  padding: 0 16px;
}
#current-loan-user-info-container {
  margin-top: 16px;
  border-top: 1px solid $grey-02;
}
</style>
