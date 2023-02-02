<template>
  <div id="payday-loan-header" class="container-fluid">
    <header>
      <div
        class="pl-header-container container d-flex justify-content-between align-items-center"
        :class="{ 'pl-mobile-header': responsive }"
      >
        <a class="monex-logo-link" href="javascript:void(0)">
          <img
            id="monex-menu-logo"
            :src="'/img/pl/monex-logo.svg'"
            alt="logo-menu"
          />
        </a>

        <div class="d-inline-flex">
          <div class="dropdown" v-if="showProfileBtn">
            <button
              class="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              @click="showProfileMenu = !showProfileMenu"
            >
              <span
                class="
                      d-flex
                      flex-row
                      text-center
                      justify-content-between
                      align-items-center
                    "
              >
                <span
                  class="text-center
                      justify-content-between
                      align-items-center avatar"
                  ><span> {{ shortName }}</span></span
                >
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="#000"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.86176 5.52851C3.12212 5.26817 3.54422 5.26817 3.80458 5.52851L7.99984 9.72379L12.1951 5.52851C12.4554 5.26817 12.8776 5.26817 13.1379 5.52851C13.3982 5.78887 13.3982 6.21097 13.1379 6.47133L8.47124 11.138C8.2109 11.3983 7.78877 11.3983 7.52844 11.138L2.86176 6.47133C2.60142 6.21097 2.60142 5.78887 2.86176 5.52851Z"
                      fill="#000"
                    />
                  </svg>
                </span>
              </span>
            </button>
            <div
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
              v-show="showProfileMenu"
            >
              <button @click="logout()" class="dropdown-item">
                {{ $t("auth.logout") }}
              </button>
            </div>
          </div>
        </div>

        <!--        <router-link :to="{ name: 'Home' }" class="monex-logo-link">-->
        <!--          <img :src="'/img/pl/monex-logo.svg'" alt="logo-menu" />-->
        <!--          <div class="web-app-text">-->
        <!--            <p>{{ $t("common.web_app") }}</p>-->
        <!--          </div>-->
        <!--        </router-link>-->

        <!-- Navigation -->
        <!--        <nav role="navigation" class="payday-loan-container" v-if="!responsive">-->
        <!--          <div class="container-fluid">-->
        <!--            <ul class="navbar-nav">-->
        <!--              <li class="nav-item">-->
        <!--                <a class="nav-link" href="javascript:void(0)">{{ $t("payday_loan.hotline") }}</a>-->
        <!--              </li>-->
        <!--              <li class="nav-item">-->
        <!--                <a class="nav-link" href="javascript:void(0)">{{ $t("payday_loan.qa") }}</a>-->
        <!--              </li>-->
        <!--              <li class="nav-item">-->
        <!--                <a class="nav-link" href="javascript:void(0)">{{ $t("payday_loan.policy") }}</a>-->
        <!--              </li>-->
        <!--            </ul>-->
        <!--          </div>-->
        <!--        </nav>-->
      </div>
      <pl-top-navigation
        v-if="displayTopNavigation"
        :responsive="responsive"
        :display-left-btn="true"
        @clickPrevBtn="clickPrevBtn"
        :title="title"
        :display-step-progress-bar="displayStepProgressBar"
      />
    </header>
  </div>
</template>

<script>
import PlTopNavigation from "@/components/Navigations/PlTopNavigation";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PaydayLoanHeader",
  components: { PlTopNavigation },
  data() {
    return {
      showProfileBtn: false,
      responsive: false,
      showProfileMenu: false,
      shortName: "0",
      title: this.$t("payday_loan.salary_24h_title")
    };
  },
  computed: {
    ...mapGetters({
      displayStepProgressBar: "paydayLoan/displayStepProgressBar",
      displayTopNavigation: "paydayLoan/displayTopNavigation",
      currentTopNavigation: "paydayLoan/currentTopNavigationTitle"
    })
  },
  watch: {
    "$store.state.paydayLoan.topNavigationTitle": {
      handler: function(newVal) {
        this.title = newVal;
      },
      deep: true,
      immediate: true
    },
    "$store.state.auth.access_token": {
      handler: function(newVal) {
        this.showProfileMenu = false;
        this.showProfileBtn = !!newVal;
      },
      deep: true,
      immediate: true
    },
    "$store.state.customer.customerName": {
      handler: function(newVal) {
        if (newVal) {
          const names = newVal.split(" ");
          this.shortName = names[names.length - 1].charAt(0);
        } else {
          this.shortName = "0";
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.title = this.currentTopNavigation;
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    ...mapActions({
      signOut: "auth/signOut"
    }),
    onResponsiveInverted() {
      this.responsive = window.innerWidth < 768;
    },
    clickPrevBtn() {
      this.$store.dispatch("paydayLoan/clickPrevPageBtn");
    },
    logout() {
      this.signOut();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-header";
</style>
