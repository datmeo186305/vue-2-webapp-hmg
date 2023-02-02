<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <!-- profile info -->
      <div class="additional-information-category">
        <h2 class="pl-headline">
          {{ $t("payday_loan.additional_information.profile_info") }}
        </h2>
        <div class="pl-divider" />
        <!--  Marital Status  -->
        <ValidationProvider
          :name="$t('payday_loan.additional_information.marital_status')"
          rules="required"
          v-slot="{ passed, errors }"
        >
          <label class="pl-label require-field"
            >{{ $t("payday_loan.additional_information.marital_status") }}
          </label>
          <pl-field>
            <pl-select
              :options="maritalStatusOptions"
              label="name"
              v-model="params.maritalStatus"
              :initValue="initValueSelect.maritalStatus"
              :placeholder="
                $t('payday_loan.additional_information.type_marital_status')
              "
            />
          </pl-field>
          <div class="pl-invalid-feedback" v-if="errors[0]">
            {{ errors[0] }}
          </div>
        </ValidationProvider>

        <!--  Educational status  -->
        <ValidationProvider
          :name="$t('payday_loan.additional_information.educational_status')"
          rules="required"
          v-slot="{ passed, errors }"
        >
          <label class="pl-label require-field pl-space-between-content"
            >{{ $t("payday_loan.additional_information.educational_status") }}
          </label>
          <pl-field>
            <pl-select
              :options="educationTypeOptions"
              label="name"
              v-model="params.educationType"
              :initValue="initValueSelect.educationType"
              :placeholder="
                $t('payday_loan.additional_information.type_educational_status')
              "
            />
          </pl-field>
          <div class="pl-invalid-feedback" v-if="errors[0]">
            {{ errors[0] }}
          </div>
        </ValidationProvider>

        <!--  Number financial dependents  -->
        <ValidationProvider
          :name="$t('payday_loan.additional_information.number_of_dependents')"
          rules="required"
          v-slot="{ passed, errors }"
        >
          <label class="pl-label require-field pl-space-between-content"
            >{{ $t("payday_loan.additional_information.number_of_dependents") }}
          </label>
          <pl-field>
            <pl-select
              :options="numberOfDependentsOptions"
              label="name"
              v-model="params.numberOfDependents"
              :initValue="initValueSelect.numberOfDependents"
              :placeholder="
                $t(
                  'payday_loan.additional_information.choose_number_of_dependents'
                )
              "
            />
          </pl-field>
          <div class="pl-invalid-feedback" v-if="errors[0]">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
      </div>

      <!-- economic info -->
      <div class="additional-information-category pl-space-between-box">
        <h2 class="pl-headline">
          {{ $t("payday_loan.additional_information.economic_info") }}
        </h2>
        <div class="pl-divider" />
        <!--  working time -->
        <ValidationProvider
          :name="$t('payday_loan.additional_information.working_time')"
          rules="required"
          v-slot="{ passed, errors }"
        >
          <label class="pl-label require-field"
            >{{ $t("payday_loan.additional_information.working_time") }}
          </label>
          <pl-field>
            <pl-select
              :options="yearsCompletedOptions"
              label="name"
              v-model="params.yearsCompleted"
              :initValue="initValueSelect.yearsCompleted"
              :placeholder="
                $t('payday_loan.additional_information.choose_working_time')
              "
            />
          </pl-field>
          <div class="pl-invalid-feedback" v-if="errors[0]">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
      </div>

      <!-- salary info -->
      <div class="additional-information-category pl-space-between-box">
        <h2 class="pl-headline">
          {{ $t("payday_loan.additional_information.salary_info") }}
        </h2>

        <p
          class="salary-info-desc"
          v-html="$t('payday_loan.additional_information.salary_info_desc')"
        />

        <button
          id="salary-info-example-btn"
          @click="showSalaryExample"
          type="button"
        >
          {{ $t("payday_loan.additional_information.salary_info_example") }}
        </button>
        <!--  most recent salary document -->
        <div class="pl-salary-upload-img">
          <image-upload-area
            id="salaryDocument1"
            name="salaryDocument1"
            :image-src="salaryDocument1"
            :init-value="initSalaryDocument.salaryDocument1"
            :placeholder-image-src="'/img/pl/uploadimage.svg'"
            :filled-title="
              $t(
                'payday_loan.additional_information.filled_statement_photo_by_month',
                { month: requiredMonth.salaryDocument1 }
              )
            "
            :upload-title="
              $t(
                'payday_loan.additional_information.statement_photo_by_month',
                { month: requiredMonth.salaryDocument1 }
              )
            "
            :upload-hint="
              $t('payday_loan.additional_information.hint_statement_photo_1')
            "
            :required="true"
            :isManualUploadFile="true"
            rules="required|size:20000|mimes:application/pdf,image/png,image/jpeg,image/jpg,application/acrobat,application/x-pdf,applications/vnd.pdf,text/pdf,text/x-pdf,application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed,application/octet-stream"
            @receiveResult="receiveResultSalaryDocument1"
          />
        </div>

        <!--  latest second salary document -->
        <div class="pl-salary-upload-img pl-salary-upload-img-space">
          <image-upload-area
            id="salaryDocument2"
            name="salaryDocument2"
            :image-src="salaryDocument2"
            :init-value="initSalaryDocument.salaryDocument2"
            :placeholder-image-src="'/img/pl/uploadimage.svg'"
            :filled-title="
              $t(
                'payday_loan.additional_information.filled_statement_photo_by_month',
                { month: requiredMonth.salaryDocument2 }
              )
            "
            :upload-title="
              $t(
                'payday_loan.additional_information.statement_photo_by_month',
                { month: requiredMonth.salaryDocument2 }
              )
            "
            :upload-hint="
              $t('payday_loan.additional_information.hint_statement_photo_2')
            "
            :required="true"
            :isManualUploadFile="true"
            rules="required|size:20000|mimes:application/pdf,image/png,image/jpeg,image/jpg,application/acrobat,application/x-pdf,applications/vnd.pdf,text/pdf,text/x-pdf,application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed,application/octet-stream"
            @receiveResult="receiveResultSalaryDocument2"
          />
        </div>

        <!--  first month salary document  -->
        <div class="pl-salary-upload-img pl-salary-upload-img-space">
          <image-upload-area
            id="salaryDocument3"
            name="salaryDocument3"
            :image-src="salaryDocument3"
            :init-value="initSalaryDocument.salaryDocument3"
            :placeholder-image-src="'/img/pl/uploadimage.svg'"
            :filled-title="
              $t('payday_loan.additional_information.filled_statement_photo_3')
            "
            :upload-title="
              $t('payday_loan.additional_information.statement_photo_3')
            "
            :upload-hint="
              $t('payday_loan.additional_information.hint_statement_photo_3')
            "
            :required="true"
            :isManualUploadFile="true"
            rules="required|size:20000|mimes:application/pdf,image/png,image/jpeg,image/jpg,application/acrobat,application/x-pdf,applications/vnd.pdf,text/pdf,text/x-pdf,application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed,application/octet-stream"
            @receiveResult="receiveResultSalaryDocument3"
          />
        </div>
      </div>

      <div
        class="text-center pl-space-between-box"
        id="additional-information-btn-submit"
      >
        <pl-button
          :type="disabledBtn || !showBtnSubmit ? 'button' : 'submit'"
          id="pl-additional-information-btn-submit"
          class="btn-primary"
          :disabled="disabledBtn || !showBtnSubmit"
        >
          {{ $t("common.continue") }}
        </pl-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlField from "../Field/PlField";
import PlButton from "../Buttons/PlButton";
import ImageUploadArea from "../../pages/PaydayLoan/components/ImageUploadArea";
import PlSelect from "../Inputs/PlSelect";
import { RestConfigService } from "../../services/paydayLoan/restConfig.service";
import { COMMON_PROPERTIES } from "../../helpers/constants";
import { mapActions, mapMutations } from "vuex";
import moment from "moment";
import Configuration from "@/helpers/configuration";

export default {
  name: "PlAdditionalInformationForm",
  components: { PlSelect, ImageUploadArea, PlButton, PlField },
  props: {
    customerInfo: {
      type: [Object, null]
    }
  },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      maritalStatusOptions: [
        {
          value: "Độc thân",
          name: "Độc thân"
        },
        {
          value: "Đã kết hôn",
          name: "Đã kết hôn"
        },
        {
          value: "Ly hôn",
          name: "Ly hôn"
        },
        {
          value: "Góa vợ/ chồng",
          name: "Góa vợ/ chồng"
        }
      ],
      educationTypeOptions: [
        {
          value: "THPT",
          name: "THPT"
        },
        {
          value: "Trung cấp - Dạy nghề",
          name: "Trung cấp - Dạy nghề"
        },
        {
          value: "Cao đẳng - Đại học",
          name: "Cao đẳng - Đại học"
        },
        {
          value: "Sau đại học",
          name: "Sau đại học"
        }
      ],
      numberOfDependentsOptions: [
        {
          value: "0",
          name: "0"
        },
        {
          value: "1",
          name: "1"
        },
        {
          value: "2",
          name: "2"
        },
        {
          value: "3",
          name: "3"
        },
        {
          value: "Nhiều hơn 3",
          name: "Nhiều hơn 3"
        }
      ],
      yearsCompletedOptions: [
        {
          value: "Dưới 6 tháng",
          name: "Dưới 6 tháng"
        },
        {
          value: "6 tháng đến dưới 1 năm",
          name: "6 tháng đến dưới 1 năm"
        },
        {
          value: "1 năm đến dưới 2 năm",
          name: "1 năm đến dưới 2 năm"
        },
        {
          value: "2 năm đến 3 năm",
          name: "2 năm đến 3 năm"
        },
        {
          value: "Trên 3 năm",
          name: "Trên 3 năm"
        }
      ],
      image: null,
      params: {
        maritalStatus: null,
        educationType: null,
        numberOfDependents: null,
        yearsCompleted: null,
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null
      },
      initValueSelect: {
        maritalStatus: null,
        educationType: null,
        numberOfDependents: null,
        yearsCompleted: null
      },
      salaryDocument1: null,
      salaryDocument2: null,
      salaryDocument3: null,
      initSalaryDocument: {
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null
      },
      requiredMonth: {
        salaryDocument1: 1,
        salaryDocument2: 1,
        salaryDocument3: 2021
      }
    };
  },
  computed: {
    showBtnSubmit() {
      return (
        this.params.educationType &&
        this.params.maritalStatus &&
        this.params.numberOfDependents &&
        this.params.salaryDocument1 &&
        this.params.salaryDocument2 &&
        this.params.salaryDocument3 &&
        this.params.yearsCompleted
      );
    }
  },
  watch: {
    customerInfo: {
      handler: function(newVal) {
        this.params.maritalStatus = this.initValueSelect.maritalStatus = newVal.maritalStatus
          ? {
              value: newVal.maritalStatus,
              name: newVal.maritalStatus
            }
          : null;
        this.params.educationType = this.initValueSelect.educationType = newVal.educationType
          ? {
              value: newVal.educationType,
              name: newVal.educationType
            }
          : null;

        this.params.numberOfDependents = this.initValueSelect.numberOfDependents = newVal.borrowerDetailTextVariable1
          ? {
              value: newVal.borrowerDetailTextVariable1,
              name: newVal.borrowerDetailTextVariable1
            }
          : null;
        this.params.yearsCompleted = this.initValueSelect.yearsCompleted = newVal.borrowerEmploymentHistoryTextVariable1
          ? {
              value: newVal.borrowerEmploymentHistoryTextVariable1,
              name: newVal.borrowerEmploymentHistoryTextVariable1
            }
          : null;

        this.params.salaryDocument1 = this.salaryDocument1 = this.initSalaryDocument.salaryDocument1 =
          newVal.salaryDocument1 || null;

        this.params.salaryDocument2 = this.salaryDocument2 = this.initSalaryDocument.salaryDocument2 =
          newVal.salaryDocument2 || null;

        this.params.salaryDocument3 = this.salaryDocument3 = this.initSalaryDocument.salaryDocument3 =
          newVal.salaryDocument3 || null;
      },
      deep: true
    }
  },
  created() {
    this.initGuideUploadDocument();
  },
  mounted() {
    // this.getMaritalStatusOptions();
    // this.getEducationTypeOptions();
    // this.getBorrowerEmploymentHistoryOptions();
    // this.getNumberOfDependentsOptions();
    this.initProfile();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations({
      destroyModal: "modal/DESTROY_MODAL",
      showModal: "modal/SHOW_MODAL"
    }),
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    submit() {
      if (this.disabledBtn) return;
      this.disabledBtn = true;

      // Re-enable after 1 seconds
      this.timeout = setTimeout(() => {
        this.disabledBtn = false;
      }, 1000);

      let params = this.buildParams();
      this.$emit("submit", params);
    },
    buildParams() {
      return {
        maritalStatus: this.params.maritalStatus.value
          ? this.params.maritalStatus.value.trim()
          : null,
        educationType: this.params.educationType.value
          ? this.params.educationType.value.trim()
          : null,
        borrowerDetailTextVariable1: this.params.numberOfDependents.value
          ? this.params.numberOfDependents.value.trim()
          : null,
        borrowerEmploymentHistoryTextVariable1: this.params.yearsCompleted.value
          ? this.params.yearsCompleted.value.trim()
          : null,
        salaryDocument1: this.params.salaryDocument1,
        salaryDocument2: this.params.salaryDocument2,
        salaryDocument3: this.params.salaryDocument3
      };
    },
    async receiveResultSalaryDocument1(image, file) {
      this.params.salaryDocument1 = file;
    },
    async receiveResultSalaryDocument2(image, file) {
      this.params.salaryDocument2 = file;
    },
    async receiveResultSalaryDocument3(image, file) {
      this.params.salaryDocument3 = file;
    },
    showSalaryExample() {
      this.$emit("showSalaryExample");
    },
    async getMaritalStatusOptions() {
      const response = await RestConfigService.getCommonPropertySuggest(
        COMMON_PROPERTIES.MARITAL_STATUS
      );
      if (!response || response.code == 400) {
        this.showError({
          content:
            Configuration.value('VUE_APP_PRODUCTION') === "true"
              ? this.$t("common.something_went_wrong")
              : response.message
        });
        return;
      }
      this.maritalStatusOptions = response;
    },

    async getEducationTypeOptions() {
      const response = await RestConfigService.getCommonPropertySuggest(
        COMMON_PROPERTIES.EDUCATION_TYPE
      );
      if (!response || response.code == 400) {
        this.showError({
          content:
            Configuration.value('VUE_APP_PRODUCTION') === "true"
              ? this.$t("common.something_went_wrong")
              : response.message
        });
        return;
      }
      this.educationTypeOptions = response;
    },

    async getBorrowerEmploymentHistoryOptions() {
      const response = await RestConfigService.getCommonPropertySuggest(
        COMMON_PROPERTIES.BORROWER_EMPLOYMENT_HISTORY
      );
      if (!response || response.code == 400) {
        this.showError({
          content:
            Configuration.value('VUE_APP_PRODUCTION') === "true"
              ? this.$t("common.something_went_wrong")
              : response.message
        });
        return;
      }
      this.yearsCompletedOptions = response;
    },

    async getNumberOfDependentsOptions() {
      const response = await RestConfigService.getCommonPropertySuggest(
        COMMON_PROPERTIES.NUMBER_OF_DEPENDENTS
      );
      if (!response || response.code == 400) {
        this.showError({
          content:
            Configuration.value('VUE_APP_PRODUCTION') === "true"
              ? this.$t("common.something_went_wrong")
              : response.message
        });
        return;
      }
      this.numberOfDependentsOptions = response;
    },
    initGuideUploadDocument() {
      if (moment(new Date()).get("date") >= 10) {
        this.requiredMonth = {
          salaryDocument1: moment(new Date())
            .subtract(1, "month")
            .format("M"),
          salaryDocument2: moment(new Date())
            .subtract(2, "month")
            .format("M"),
          salaryDocument3: "1/" + moment(new Date()).format("YYYY")
        };
        return;
      }
      this.requiredMonth = {
        salaryDocument1: moment(new Date())
          .subtract(2, "month")
          .format("M"),
        salaryDocument2: moment(new Date())
          .subtract(3, "month")
          .format("M"),
        salaryDocument3: "1/" + moment(new Date()).format("YYYY")
      };
    },
    initProfile() {
      //Get info from customer info svc
      if (this.customerInfo) {
        this.params.maritalStatus = this.initValueSelect.maritalStatus = this
          .customerInfo.maritalStatus
          ? {
              value: this.customerInfo.maritalStatus,
              name: this.customerInfo.maritalStatus
            }
          : null;
        this.params.educationType = this.initValueSelect.educationType = this
          .customerInfo.educationType
          ? {
              value: this.customerInfo.educationType,
              name: this.customerInfo.educationType
            }
          : null;

        this.params.numberOfDependents = this.initValueSelect.numberOfDependents = this
          .customerInfo.borrowerDetailTextVariable1
          ? {
              value: this.customerInfo.borrowerDetailTextVariable1,
              name: this.customerInfo.borrowerDetailTextVariable1
            }
          : null;
        this.params.yearsCompleted = this.initValueSelect.yearsCompleted = this
          .customerInfo.borrowerEmploymentHistoryTextVariable1
          ? {
              value: this.customerInfo.borrowerEmploymentHistoryTextVariable1,
              name: this.customerInfo.borrowerEmploymentHistoryTextVariable1
            }
          : null;

        this.params.salaryDocument1 = this.salaryDocument1 = this.initSalaryDocument.salaryDocument1 =
          this.customerInfo.salaryDocument1 || null;

        this.params.salaryDocument2 = this.salaryDocument2 = this.initSalaryDocument.salaryDocument2 =
          this.customerInfo.salaryDocument2 || null;

        this.params.salaryDocument3 = this.salaryDocument3 = this.initSalaryDocument.salaryDocument3 =
          this.customerInfo.salaryDocument3 || null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-additional-information";
</style>
