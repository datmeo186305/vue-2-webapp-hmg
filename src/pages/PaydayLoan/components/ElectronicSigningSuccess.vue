<template>
  <div class="pl-electronic-signing-success-container">
    <slot name="image">
      <img v-if="imageUrl" :src="imageUrl" alt="" class="img" />
      <div class="electronic-sign-success-img-container" v-else>
        <div class="electronic-sign-success-img-content">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="#34C759"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7508 16.5003C16.0594 16.5003 16.569 17.0828 16.9561 18.3746L17.024 18.6118C17.2065 19.2691 17.3156 19.466 17.5366 19.5571C17.7957 19.6639 17.9685 19.6487 18.24 19.5091L18.387 19.4268C18.4398 19.395 18.4974 19.3584 18.5626 19.3154L19.2258 18.864C19.8417 18.4589 20.3951 18.1911 21.0689 18.0227C21.4708 17.9222 21.878 18.1666 21.9784 18.5684C22.0789 18.9702 21.8346 19.3774 21.4327 19.4779C21.0257 19.5797 20.6745 19.7337 20.2874 19.9673L19.9888 20.1581L19.5098 20.4861C19.28 20.6424 19.1066 20.7502 18.9259 20.8431C18.283 21.1736 17.656 21.2287 16.965 20.9439C16.2202 20.637 15.9199 20.164 15.6387 19.2223L15.4829 18.6805C15.3016 18.0911 15.178 18.0003 14.7508 18.0003C14.4415 18.0003 14.1212 18.1551 13.6825 18.5233L13.4977 18.6842L12.5768 19.5595C11.1687 20.8831 9.96823 21.5258 8.24947 21.5258C6.56318 21.5258 5.10478 21.2718 3.88052 20.757L6.82811 19.9527C7.27538 20.0014 7.74909 20.0258 8.24947 20.0258C9.43222 20.0258 10.2812 19.6109 11.3357 18.6632L11.5939 18.4245L12.1257 17.9134C12.3624 17.6866 12.5397 17.5241 12.7182 17.3742C13.4018 16.8006 14.0232 16.5003 14.7508 16.5003ZM19.0312 2.96997C20.4286 4.36743 20.4286 6.63317 19.0312 8.03063L18.743 8.31934C19.8944 9.72069 19.8528 11.2058 18.7819 12.2799L16.7807 14.2811C16.4875 14.5737 16.0127 14.5733 15.72 14.2802C15.4274 13.987 15.4278 13.5121 15.721 13.2195L17.7197 11.2207C18.2047 10.7343 18.2608 10.1304 17.6799 9.38238L9.06283 17.999C8.78596 18.2758 8.44162 18.4757 8.06386 18.5787L2.94817 19.9739C2.38829 20.1266 1.87456 19.6128 2.02726 19.053L3.42244 13.9373C3.52547 13.5595 3.7253 13.2152 4.00217 12.9383L13.9705 2.96997C15.368 1.57251 17.6337 1.57251 19.0312 2.96997Z"
              fill="#34C759"
            />
          </svg>
        </div>
        <img
          :src="'/img/pl/checkmark-circle.svg'"
          alt=""
          class="checkmark-circle-img"
        />
      </div>
    </slot>
    <slot name="title">
      <h2 class="pl-electronic-signing-success-title">
        {{ title }}
      </h2>
    </slot>

    <div class="pl-electronic-signing-success-body">
      <img
        :src="'/img/pl/monex-logo.svg'"
        alt="logo-menu"
        class="electronic-siging-logo"
      />
      <slot name="body">
        <p class="pl-electronic-signing-success-body-text" v-html="bodyText" />
      </slot>
    </div>

    <slot name="footer">
      <div class="text-center electronic-signing-actions">
        <pl-button
          id="electronic-signing-success-btn"
          type="submit"
          class="btn-primary"
          :disabled="disabledBtn"
          @click="btnClick"
        >
          {{ btnText }}
        </pl-button>
      </div>
    </slot>
  </div>
</template>

<script>
import PlButton from "../../../components/Buttons/PlButton";
import i18n from "../../../lang/i18n";

export default {
  name: "ElectronicSigningSuccess",
  components: { PlButton },
  props: {
    imageUrl: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    bodyText: {
      type: String,
      default: ""
    },
    disabledBtn: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: i18n.t("common.continue")
    }
  },
  methods: {
    btnClick() {
      this.$emit("btnClick");
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

.pl-electronic-signing-success-title {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: $grey-10;
  margin-top: 16px;
}

.pl-electronic-signing-success-body {
  margin-top: 32px;
  min-width: 300px;
  background: $white;
  border: 2px solid $grey-01;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 24px;
}

.electronic-signing-actions {
  margin-top: 32px;

  .pl-btn {
    max-width: 330px;
  }
}

.electronic-siging-logo {
  width: 100px;
  margin: 0 auto;
}

.electronic-sign-success-img-container {
  background: #f9fdfa;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  place-content: center;
  margin: 0 auto;
  position: relative;
}

.electronic-sign-success-img-content {
  background: #f3fbf5;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  place-content: center;
}

.checkmark-circle-img {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
}

@media (max-width: 768px) {
  .electronic-signing-actions {
    .pl-btn {
      max-width: 240px;
    }
  }
}
</style>
