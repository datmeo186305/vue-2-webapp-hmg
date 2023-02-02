<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <!--  Full name  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.full_name')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <div class="pl-label-container">
          <label class="pl-label require-field"
            >{{ $t("payday_loan.confirm_information.full_name") }}
          </label>
          <p class="pl-label-suggest">
            {{ $t("payday_loan.confirm_information.full_name_suggest") }}
          </p>
        </div>
        <pl-field>
          <pl-input
            :disabled="disabledInReturnFlow"
            v-model="params.fullName"
            type="text"
            name="fullname"
            :placeholder="$t('payday_loan.confirm_information.type_full_name')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Date of birth  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.date_of_birth')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.date_of_birth") }}
        </label>
        <pl-field>
          <div class="pl-datetime">
            <vue-datetime
              type="date"
              :disabled="disabledInReturnFlow"
              v-model="params.dateOfBirth"
              :max-datetime="maxDateTime"
              zone="Asia/Ho_Chi_Minh"
              input-class="vue-datetime-input"
              :placeholder="
                $t('payday_loan.confirm_information.choose_date_of_birth')
              "
              :phrases="{
                ok: $t('common.continue'),
                cancel: $t('common.exit')
              }"
              class="theme-monex"
              :format="'dd/MM/yyyy'"
              auto
            />
            <img
              :src="'/img/pl/icon-right.svg'"
              alt="icon-right"
              class="pl-datetime-icon"
            />
          </div>
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Gender -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.employee_code')"
        rules="required"
        v-slot="{ errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.sex") }}
        </label>
        <pl-field>
          <pl-radio
            name="gender"
            v-model="params.gender"
            :value="item.value"
            v-for="(item, index) in genderOptions"
            :key="'gender-' + index"
            >{{ item.name }}
          </pl-radio>
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Identity number  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.identity_number')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.identity_number") }}
        </label>
        <pl-field>
          <pl-input
            :disabled="disabledInReturnFlow"
            v-model="params.identityNumber"
            type="text"
            name="identity_number"
            :placeholder="
              $t('payday_loan.confirm_information.type_identity_number')
            "
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Identity given place  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.identity_given_place')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.identity_given_place") }}
        </label>
        <pl-field>
          <pl-input
            :disabled="disabledInReturnFlow"
            v-model="params.idIssuePlace"
            type="text"
            name="identity_given_place"
            :placeholder="
              $t('payday_loan.confirm_information.type_identity_given_place')
            "
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Permanent address  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.permanent_address')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.permanent_address") }}
        </label>
        <pl-field>
          <pl-input
            v-model="params.addressTwoLine1"
            type="text"
            name="permanent_address"
            :placeholder="
              $t('payday_loan.confirm_information.type_permanent_address')
            "
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--   City   -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.city')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.city") }}
        </label>
        <pl-field>
          <v-select
            @input="changeCity"
            :options="cityData"
            :reduce="city => city.id"
            label="name"
            :clearable="false"
            :searchable="true"
            v-model="params.cityId"
            :initValue="params.cityId"
            :placeholder="$t('payday_loan.confirm_information.type_city')"
            class="pl-select"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                {{ $t("common.no_search_result") }} <em>{{ search }}</em
                >.
              </template>
              <em style="opacity: 0.5;" v-else>
                {{ $t("common.no_options") }}
              </em>
            </template>
            <template v-slot:open-indicator="">
              <img
                :src="'/img/pl/icon-right.svg'"
                alt="right"
                class="pl-icon-indicator vs__open-indicator"
              />
            </template>
          </v-select>
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--   District   -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.district')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.district") }}
        </label>
        <pl-field>
          <v-select
            @input="changeDistrict"
            :disabled="!params.cityId"
            :reduce="district => district.id"
            :options="districtData"
            label="name"
            :clearable="false"
            :searchable="true"
            v-model="params.districtId"
            :initValue="params.districtId"
            :placeholder="$t('payday_loan.confirm_information.type_district')"
            class="pl-select"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                {{ $t("common.no_search_result") }} <em>{{ search }}</em
                >.
              </template>
              <em style="opacity: 0.5;" v-else>
                {{ $t("common.no_options") }}
              </em>
            </template>
            <template v-slot:open-indicator="">
              <img
                :src="'/img/pl/icon-right.svg'"
                alt="right"
                class="pl-icon-indicator vs__open-indicator"
              />
            </template>
          </v-select>
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--   Commune   -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.commune')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.commune") }}
        </label>
        <pl-field>
          <v-select
            :options="communeData"
            :disabled="!params.districtId"
            :reduce="commune => commune.id"
            label="name"
            :searchable="true"
            :clearable="false"
            v-model="params.communeId"
            :initValue="params.communeId"
            :placeholder="$t('payday_loan.confirm_information.type_commune')"
            class="pl-select"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                {{ $t("common.no_search_result") }} <em>{{ search }}</em
                >.
              </template>
              <em style="opacity: 0.5;" v-else>
                {{ $t("common.no_options") }}
              </em>
            </template>
            <template v-slot:open-indicator="">
              <img
                :src="'/img/pl/icon-right.svg'"
                alt="right"
                class="pl-icon-indicator vs__open-indicator"
              />
            </template>
          </v-select>
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Current residence  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.current_residence')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.current_residence") }}
        </label>
        <pl-field>
          <pl-input
            v-model="params.apartmentNumber"
            type="text"
            name="current_residence"
            :placeholder="
              $t('payday_loan.confirm_information.type_current_residence')
            "
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Email  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.email')"
        rules="required|validEmail"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.email") }}
        </label>
        <pl-field
          v-tooltip.top="
            $t('payday_loan.confirm_information.type_email_description')
          "
        >
          <pl-input
            v-model="params.emailAddress"
            type="text"
            name="emailAddress"
            :placeholder="$t('payday_loan.confirm_information.type_email')"
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <!--  Employment code  -->
      <ValidationProvider
        :name="$t('payday_loan.confirm_information.employee_code')"
        rules="required"
        v-slot="{ passed, errors }"
      >
        <label class="pl-label require-field pl-space-between-content"
          >{{ $t("payday_loan.confirm_information.employee_code") }}
        </label>
        <pl-field>
          <pl-input
            :disabled="disabledInReturnFlow"
            v-model="params.employeeId"
            type="text"
            name="employee_code"
            :placeholder="
              $t('payday_loan.confirm_information.type_employee_code')
            "
          />
        </pl-field>
        <div class="pl-invalid-feedback" v-if="errors[0]">
          {{ errors[0] }}
        </div>
      </ValidationProvider>

      <div class="text-center pl-space-between-box">
        <pl-button
          id="pl-confirm-information-btn-submit"
          type="submit"
          class="btn-primary"
          :disabled="disabledBtn"
        >
          {{ $t("common.continue") }}
        </pl-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlInput from "../Inputs/PlInput";
import PlField from "../Field/PlField";
import PlButton from "../Buttons/PlButton";
import PlRadio from "../Inputs/PlRadio";
import moment from "moment";
import { RestConfigService } from "../../services/paydayLoan/restConfig.service";
import { COMMON_PROPERTIES } from "../../helpers/constants";
import { mapActions, mapGetters } from "vuex";
import Configuration from "@/helpers/configuration";
import { CustomerService } from "../../services/paydayLoan/customer.service";
import vSelect from "vue-select";

export default {
  name: "PlConfirmInformationForm",
  components: { PlRadio, PlButton, PlField, PlInput, vSelect },
  props: {
    customerInfo: {
      type: [Object, null]
    }
  },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      cityData: [],
      communeData: [],
      districtData: [],
      params: {
        fullName: null,
        dateOfBirth: null,
        gender: null,
        identityNumber: null,
        addressTwoLine1: null,
        apartmentNumber: null,
        emailAddress: null,
        employeeId: "TNG",
        idIssuePlace: null,
        cityId: null,
        districtId: null,
        communeId: null
      },
      initValueSelect: {
        cityId: null,
        districtId: null,
        communeId: null
      },
      genderOptions: [
        {
          value: "Nam",
          name: "Nam"
        },
        {
          value: "Nữ",
          name: "Nữ"
        },
        {
          value: "Khác",
          name: "Khác"
        }
      ],
      maxDateTime: moment(new Date(), "YYYY-MM-DD")
        .subtract(18, "years")
        .toISOString()
    };
  },
  computed: {
    ...mapGetters({
      currentEkycCardInfo: "ekyc/currentCardInfo"
    }),
    disabledInReturnFlow() {
      if (!this.customerInfo || !this.customerInfo.stepOne) {
        return false;
      }
      return this.customerInfo.stepOne.toUpperCase() === "DONE";
    }
  },
  watch: {
    customerInfo: {
      handler: function(newVal) {
        //Get info from ekyc
        if (
          (this.currentEkycCardInfo.name ||
            this.currentEkycCardInfo.id_number) &&
          newVal.stepOne !== "DONE"
        ) {
          return;
        }
        //Get info from customer info svc
        this.params = {
          dateOfBirth: this.validateDateOfBirth(newVal.dateOfBirth) || null,
          fullName: newVal.firstName || null,
          gender: newVal.gender || null,
          identityNumber: newVal.identityNumberOne || null,
          addressTwoLine1: newVal.addressTwoLine1 || null,
          apartmentNumber: newVal.apartmentNumber || null,
          emailAddress: newVal.identityNumberSix || null,
          employeeId: newVal.organizationName || "TNG",
          idIssuePlace: newVal.idIssuePlace || null,
          cityId: newVal.cityId || null,
          districtId: newVal.districtId || null,
          communeId: newVal.communeId || null
        };
        this.initValueSelect = {
          cityId: newVal.cityId,
          districtId: newVal.districtId,
          communeId: newVal.communeId
        };
        if (newVal.cityId !== null) {
          this.getDistrictsByCityId(this.params.cityId);
        }
        if (newVal.districtId !== null) {
          this.getCommunesByDistrictId(this.params.districtId);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.getGenderOptions();
    this.initProfile();
    this.getAllCities();
    this.initValueSelect = {
      cityId: this.params.cityId,
      districtId: this.params.districtId,
      communeId: this.params.communeId
    };
    if (this.params.cityId !== null) {
      this.getDistrictsByCityId(this.params.cityId);
    }
    if (this.params.districtId !== null) {
      this.getCommunesByDistrictId(this.params.districtId);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    submit() {
      this.disabledBtn = true;

      // Re-enable after 1 seconds
      this.timeout = setTimeout(() => {
        this.disabledBtn = false;
      }, 1000);

      let params = this.buildParams();
      this.$emit("submit", params);
    },

    async getAllCities() {
      const response = await CustomerService.getAllCity();
      if (!response || response.responseCode !== 200) {
        return;
      }
      this.cityData = response.result;
    },

    async getDistrictsByCityId(cityId) {
      if (!cityId) {
        return;
      }
      const response = await CustomerService.getDistrictsByCityId(cityId);
      if (!response || response.responseCode !== 200) {
        return;
      }
      this.districtData = response.result;
    },

    async getCommunesByDistrictId(districtId) {
      if (!districtId) {
        return;
      }
      const response = await CustomerService.getCommunesByDistrictId(
        districtId
      );
      if (!response || response.responseCode !== 200) {
        return;
      }
      this.communeData = response.result;
    },

    buildParams() {
      const city = this.cityData.filter(
        city => city.id === this.params.cityId
      )[0].name;
      const district = this.districtData.filter(
        district => district.id === this.params.districtId
      )[0].name;
      const commune = this.communeData.filter(
        commune => commune.id === this.params.communeId
      )[0].name;
      const currentAddress = this.params.apartmentNumber;
      const fullCurrentAddress = `${currentAddress}, ${commune}, ${district}, ${city}`;
      return {
        firstName: this.params.fullName ? this.params.fullName.trim() : null,
        dateOfBirth: this.params.dateOfBirth
          ? this.formatDate(this.params.dateOfBirth)
          : null,
        gender: this.params.gender ? this.params.gender.trim() : null,
        identityNumberOne: this.params.identityNumber
          ? this.params.identityNumber.trim()
          : null,
        addressTwoLine1: this.params.addressTwoLine1
          ? this.params.addressTwoLine1.trim()
          : null,
        apartmentNumber: this.params.apartmentNumber
          ? this.params.apartmentNumber.trim()
          : null,
        identityNumberSix: this.params.emailAddress
          ? this.params.emailAddress.trim()
          : null,
        organizationName: this.params.employeeId
          ? this.params.employeeId.trim()
          : null,
        emailAddress: this.params.emailAddress
          ? this.params.emailAddress.trim()
          : null,
        idIssuePlace: this.params.idIssuePlace
          ? this.params.idIssuePlace.trim()
          : null,
        cityId: this.params.cityId,
        districtId: this.params.districtId,
        communeId: this.params.communeId,
        addressOneLine1: fullCurrentAddress
      };
    },
    formatDate(value) {
      return value
        ? moment(new Date(value), "DD/MM/YYYY").format("DD/MM/YYYY")
        : null;
    },
    //TODO Have not settings for PDL
    async getGenderOptions() {
      const response = await RestConfigService.getCommonPropertySuggest(
        COMMON_PROPERTIES.GENDER
      );
      if (!response || response.code == 400) {
        this.showError({
          content:
            Configuration.value("VUE_APP_PRODUCTION") === "true"
              ? this.$t("common.something_went_wrong")
              : response.message
        });
        return;
      }
      this.genderOptions = response;
    },
    formatDateToDisplay(date) {
      let formatDate = moment(date, ["DD-MM-YYYY", "DD/MM/YYYY"]).format(
        "YYYY-DD-MM HH:mm:ss"
      );
      return moment(formatDate, "YYYY-DD-MM").toISOString();
    },
    initProfile() {
      //Get info from ekyc
      if (this.currentEkycCardInfo.name || this.currentEkycCardInfo.id_number) {
        this.params = {
          dateOfBirth: this.validateDateOfBirth(this.currentEkycCardInfo.dob),
          fullName: this.currentEkycCardInfo.name,
          addressTwoLine1: this.currentEkycCardInfo.id_address,
          gender: this.currentEkycCardInfo.gender,
          identityNumber: this.currentEkycCardInfo.id_number,
          idIssuePlace: this.currentEkycCardInfo.placeOfIssue,
          emailAddress: this.customerInfo.identityNumberSix,
          employeeId: this.customerInfo.organizationName || "TNG",
          apartmentNumber: this.customerInfo.apartmentNumber,
          cityId: this.customerInfo.cityId,
          districtId: this.customerInfo.districtId,
          communeId: this.customerInfo.communeId
        };
        return;
      }
      //Get info from customer info svc
      this.params = {
        dateOfBirth: this.validateDateOfBirth(this.customerInfo.dateOfBirth),
        fullName: this.customerInfo.firstName,
        gender: this.customerInfo.gender,
        identityNumber: this.customerInfo.identityNumberOne,
        addressTwoLine1: this.customerInfo.addressTwoLine1,
        idIssuePlace: this.customerInfo.idIssuePlace,
        emailAddress: this.customerInfo.identityNumberSix,
        employeeId: this.customerInfo.organizationName || "TNG",
        apartmentNumber: this.customerInfo.apartmentNumber,
        cityId: this.customerInfo.cityId || null,
        districtId: this.customerInfo.districtId || null,
        communeId: this.customerInfo.communeId || null
      };
    },
    //Only display date if > 18 ages
    validateDateOfBirth(dateOfBirth) {
      let unixTimestamp18Ages = new Date(
        moment(new Date(), "YYYY-MM-DD")
          .subtract(18, "years")
          .toISOString()
      ).getTime();

      let date = dateOfBirth ? this.formatDateToDisplay(dateOfBirth) : null;
      if (date) {
        if (new Date(date).getTime() < unixTimestamp18Ages) {
          return date;
        }
      }
      return null;
    },
    changeCity(newCityId) {
      this.communeData = [];
      this.districtData = [];
      this.params.districtId = null;
      this.params.communeId = null;
      if (!newCityId) return;
      this.getDistrictsByCityId(newCityId);
    },
    changeDistrict(newDistrictId) {
      this.communeData = [];
      this.params.communeId = null;
      if (!newDistrictId) return;
      this.getCommunesByDistrictId(newDistrictId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
</style>
