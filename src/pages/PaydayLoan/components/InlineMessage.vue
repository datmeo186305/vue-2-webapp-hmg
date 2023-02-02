<template>
  <div class="pl-inline-message" :class="[statusClasses]">
    <img :src="statusIconSrc" alt="" class="pl-inline-message-icon" />
    <slot />
  </div>
</template>

<script>
import { PL_MESSAGE_TYPE } from "../../../helpers/constants";

export default {
  name: "PlInlineMessage",
  props: {
    messageType: {
      type: String,
      default: PL_MESSAGE_TYPE.INFORMATION
    }
  },
  computed: {
    statusClasses() {
      return {
        "pl-inline-message-warning":
          this.messageType === PL_MESSAGE_TYPE.WARNING,
        "pl-inline-message-success":
          this.messageType === PL_MESSAGE_TYPE.SUCCESS,
        "pl-inline-message-info":
          this.messageType === PL_MESSAGE_TYPE.INFORMATION
      };
    },
    statusIconSrc() {
      switch (this.messageType) {
        case PL_MESSAGE_TYPE.WARNING:
          return "/img/pl/warning-message-icon.svg";
        case PL_MESSAGE_TYPE.SUCCESS:
          return "/img/pl/success-message-icon.svg";
        case PL_MESSAGE_TYPE.INFORMATION:
        default:
          return "/img/pl/info-message-icon.svg";
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
.pl-inline-message {
  padding: 12px;
  border-radius: 4px;
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  color: $monex-color-01;
  display: flex;
  align-items: center;

  .pl-inline-message-icon {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
}
.pl-inline-message-warning {
  background: $dim-color-orange;
}
.pl-inline-message-info {
  background: $dim-color-blue;
}
.pl-inline-message-success {
  background: $dim-color-green;
}
</style>
