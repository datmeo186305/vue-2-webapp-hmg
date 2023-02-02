<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <!-- salary info -->
      <div class="additional-document-category">
        <h2 class="pl-headline">
          {{ $t("payday_loan.additional_document.salary_info") }}
        </h2>
        <p
          class="salary-info-desc"
          v-html="$t('payday_loan.additional_document.salary_info_desc')"
        />

        <button
          id="salary-info-example-btn"
          @click="showSalaryExample"
          type="button"
        >
          {{ $t("payday_loan.additional_document.salary_info_example") }}
        </button>

        <!--  most recent salary document -->
        <div class="pl-salary-upload-img">
          <image-upload-area
            id="salaryDocument1"
            name="salaryDocument1"
            :image-src="salaryDocument1"
            :init-value="initDocument.salaryDocument1"
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
            :init-value="initDocument.salaryDocument2"
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
            :init-value="initDocument.salaryDocument3"
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

      <!-- guaranteed assets -->
      <div class="pl-space-between-box">
        <h2 class="pl-headline">
          {{ $t("payday_loan.additional_document.guaranteed_assets") }}
        </h2>

        <!--        <p class="pl-type-assets">-->
        <!--          {{ $t("payday_loan.additional_document.type_assets") }}-->
        <!--        </p>-->
        <!--  guaranteed assets upload area -->
        <div class="pl-image-upload">
          <image-upload-area
            id="collateralDocument"
            name="collateralDocument"
            v-model="collateralDocument"
            :image-src="collateralDocument"
            :init-value="initDocument.collateralDocument"
            :placeholder-image-src="'/img/pl/uploadimage.svg'"
            :filled-title="
              $t('payday_loan.choose_amount.filled_collateral_document')
            "
            :upload-title="$t('payday_loan.choose_amount.collateral_document')"
            :upload-hint="
              $t('payday_loan.choose_amount.hint_collateral_document')
            "
            :required="true"
            :isManualUploadFile="true"
            rules="required|size:20000|mimes:application/pdf,image/png,image/jpeg,image/jpg,application/acrobat,application/x-pdf,applications/vnd.pdf,text/pdf,text/x-pdf,application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed,application/octet-stream"
            @receiveResult="receiveResultCollateralDocument"
          />
        </div>

        <pl-inline-message
          :message-type="'INFORMATION'"
          class="pl-additional-document-info"
        >
          <p class="have-not-collateral-document-text">
            <span
              v-html="
                $t('payday_loan.choose_amount.have_not_collateral_document')
              "
            />
            <a href="javascript:void(0)" @click="showExample">{{
              $t("payday_loan.choose_amount.see_illustrations")
            }}</a>
          </p>
        </pl-inline-message>
      </div>

      <div
        class="text-center pl-space-between-box"
        id="additional-document-btn-submit"
      >
        <pl-button
          id="pl-additional-document-btn-submit"
          class="btn-primary"
          :type="disabledBtn ? 'button' : 'submit'"
          :disabled="disabledBtn"
        >
          {{ $t("common.continue") }}
        </pl-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlButton from "../Buttons/PlButton";
import ImageUploadArea from "../../pages/PaydayLoan/components/ImageUploadArea";
import { mapActions } from "vuex";
import PlInlineMessage from "../../pages/PaydayLoan/components/InlineMessage";
import moment from "moment";

export default {
  name: "PlAdditionalDocumentForm",
  components: { PlInlineMessage, ImageUploadArea, PlButton },
  props: {
    customerInfo: {
      type: [Object, null]
    }
  },
  data() {
    return {
      disabledBtn: false,
      timeout: null,
      params: {
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null,
        collateralDocument: null
      },
      collateralDocument: null,
      salaryDocument1: null,
      salaryDocument2: null,
      salaryDocument3: null,
      initDocument: {
        salaryDocument1: null,
        salaryDocument2: null,
        salaryDocument3: null,
        collateralDocument: null
      },
      requiredMonth: {
        salaryDocument1: 1,
        salaryDocument2: 1,
        salaryDocument3: 2021
      }
    };
  },
  watch: {
    customerInfo: {
      handler: function(newVal) {
        this.params.salaryDocument1 = this.salaryDocument1 = this.initDocument.salaryDocument1 =
          newVal.salaryDocument1 || null;

        this.params.salaryDocument2 = this.salaryDocument2 = this.initDocument.salaryDocument2 =
          newVal.salaryDocument2 || null;

        this.params.salaryDocument3 = this.salaryDocument3 = this.initDocument.salaryDocument3 =
          newVal.salaryDocument3 || null;

        this.params.collateralDocument = this.collateralDocument = this.initDocument.collateralDocument =
          newVal.collateralDocument || null;
      },
      deep: true
    }
  },
  created() {
    this.initGuideUploadDocument();
  },
  mounted() {
    this.initProfile();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    showExample() {
      this.$emit("showExample");
    },
    submit() {
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
        salaryDocument1: this.params.salaryDocument1,
        salaryDocument2: this.params.salaryDocument2,
        salaryDocument3: this.params.salaryDocument3,
        collateralDocument: this.params.collateralDocument
      };
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
    showSalaryExample() {
      this.$emit("showSalaryExample");
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
    async receiveResultCollateralDocument(image, file) {
      this.params.collateralDocument = file;
    },

    initProfile() {
      //Get info from customer info svc
      if (this.customerInfo) {
        this.params.salaryDocument1 = this.salaryDocument1 = this.initDocument.salaryDocument1 =
          this.customerInfo.salaryDocument1 || null;

        this.params.salaryDocument2 = this.salaryDocument2 = this.initDocument.salaryDocument2 =
          this.customerInfo.salaryDocument2 || null;

        this.params.salaryDocument3 = this.salaryDocument3 = this.initDocument.salaryDocument3 =
          this.customerInfo.salaryDocument3 || null;

        this.params.collateralDocument = this.collateralDocument = this.initDocument.collateralDocument =
          this.customerInfo.collateralDocument || null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/pl/pl-additional-document";
</style>
