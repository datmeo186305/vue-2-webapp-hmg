<template>
  <ValidationObserver v-slot="{ handleSubmit }" ref="observer">
    <form @submit.prevent="handleSubmit(submit)" class="pl-space-between-box">
      <div class="container-fluid">
        <div class="container ekyc-upload-container pl-padding-bottom-default">
          <div class="payday-loan-container">
            <div class="ekyc-upload-box">
              <!--   Front    -->
              <image-upload-area
                id="frontIDCardKalapa"
                name="frontIDCard"
                :image-src="frontID"
                :init-value="initValue.frontID"
                :placeholder-image-src="'/img/pl/placeholder-icon.svg'"
                :filled-title="$t('payday_loan.ekyc.front_identity_card_img')"
                :upload-title="
                  $t('payday_loan.ekyc.upload_front_identity_card_img')
                "
                :required="true"
                :isManualUploadFile="true"
                rules="required|size:20000|mimes:image/*"
                acceptFileType="image/*"
                @receiveResult="resultFrontIdCard"
              />

              <!--   Back    -->
              <image-upload-area
                id="backIDCardKalapa"
                name="backIDCard"
                :image-src="backID"
                :init-value="initValue.backID"
                :placeholder-image-src="'/img/pl/id-card-back.svg'"
                :filled-title="$t('payday_loan.ekyc.back_identity_card_img')"
                :upload-title="
                  $t('payday_loan.ekyc.upload_back_identity_card_img')
                "
                :required="true"
                :isManualUploadFile="true"
                rules="required|size:20000|mimes:image/*"
                acceptFileType="image/*"
                @receiveResult="resultBackIdCard"
              />

              <!--   Selfie    -->
              <image-upload-area
                id="selfieKalapa"
                name="selfie"
                :image-src="selfie"
                :init-value="initValue.selfie"
                :placeholder-image-src="'/img/pl/selfie.svg'"
                :filled-title="$t('payday_loan.ekyc.selfie_img')"
                :upload-title="$t('payday_loan.ekyc.upload_selfie_img')"
                :required="true"
                :isManualUploadFile="true"
                rules="required|size:20000|mimes:image/*"
                acceptFileType="image/*"
                @receiveResult="resultSelfie"
              />
            </div>
            <div class="text-center pl-space-between-box">
              <pl-button
                type="submit"
                id="ekyc-btn-submit"
                class="btn-primary ekyc-submit-btn"
              >
                {{ $t("common.continue") }}
              </pl-button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import ImageUploadArea from "./ImageUploadArea";
import { mapActions, mapMutations } from "vuex";
import { CustomerService } from "../../../services/paydayLoan/customer.service";

export default {
  name: "EkycUpload",
  components: { ImageUploadArea, PlButton },
  props: {
    customerInfo: {
      type: [Object, null]
    }
  },
  data() {
    return {
      params: {
        frontIdentityCardImg: null,
        backIdentityCardImg: null,
        selfieImg: null
      },
      initValue: {
        frontID: null,
        backID: null,
        selfie: null
      },
      frontID: null,
      backID: null,
      selfie: null
    };
  },
  computed: {},
  watch: {
    customerInfo: {
      handler: function(newVal) {
        this.initValue = {
          frontID: newVal.frontId,
          backID: newVal.backId,
          selfie: newVal.selfie
        };
        this.frontID = newVal.frontId;
        this.backID = newVal.backId;
        this.selfie = newVal.selfie;
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setCustomerStatus: "paydayLoan/SET_CUSTOMER_STATUS"
    }),
    ...mapActions({
      showError: "modal/openErrorModal"
    }),
    resultFrontIdCard(image, file) {
      this.params.frontIdentityCardImg = file;
      this.frontID = image;
    },
    resultBackIdCard(image, file) {
      this.params.backIdentityCardImg = file;
      this.backID = image;
    },
    resultSelfie(image, file) {
      this.params.selfieImg = file;
      this.selfie = image;
    },
    async submit() {
      if (
        this.initValue.frontID != null &&
        this.initValue.backID != null &&
        this.initValue.selfie != null &&
        this.initValue.frontID === this.frontID &&
        this.initValue.backID === this.backID &&
        this.initValue.selfie === this.selfie
      ) {
        this.$emit("redirectToConfirmInformationPage");
        return;
      }

      if (
        !this.params.frontIdentityCardImg ||
        !this.params.backIdentityCardImg ||
        !this.params.selfieImg
      )
        return;

      const ekycInfo = await CustomerService.completeEkyc(
        this.params.frontIdentityCardImg,
        this.params.backIdentityCardImg,
        this.params.selfieImg
      );
      if (ekycInfo.responseCode !== 200) {
        this.resetParams();
        this.showError({
          title: this.$t("payday_loan.ekyc.ekyc_failed_title"),
          content: this.$t("payday_loan.ekyc.ekyc_failed_content")
        });
        return;
      }
      if (!ekycInfo.result) {
        this.resetParams();
        this.showError({
          content: this.$t("common.unknown_error")
        });
        return;
      }
      this.$emit("completeEkyc", ekycInfo.result, this.params);
    },
    resetParams() {
      this.params = {
        frontIdentityCardImg: null,
        backIdentityCardImg: null,
        selfieImg: null
      };
      this.frontID = null;
      this.backID = null;
      this.selfie = null;
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-ekyc";
</style>
