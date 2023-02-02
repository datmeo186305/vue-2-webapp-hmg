<template>
  <div class="pl-status-label" :class="[statusClasses]">
    <slot />
  </div>
</template>

<script>
import { LABEL_STATUS } from "../../../helpers/constants";

export default {
  name: "PlStatusLabel",
  props: {
    statusType: {
      type: String,
      default: LABEL_STATUS.SUCCESS
    }
  },
  computed: {
    statusClasses() {
      return {
        "pl-status-label-pending": this.statusType === LABEL_STATUS.PENDING,
        "pl-status-label-success": this.statusType === LABEL_STATUS.SUCCESS,
        "pl-status-label-disbursement":
          this.statusType === LABEL_STATUS.DISBURSEMENT,
        "pl-status-label-rejected": this.statusType === LABEL_STATUS.REJECT,
        "pl-status-label-cancel": this.statusType === LABEL_STATUS.CANCEL
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";

.pl-status-label {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 55px;
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}

.pl-status-label-pending {
  background: rgba(255, 149, 0, 0.1);
  color: $system-color-orange;
}

.pl-status-label-success {
  background: rgba(52, 199, 89, 0.1);
  color: $system-color-green;
}

.pl-status-label-disbursement {
  background: rgba(88, 86, 214, 0.1);
  color: $system-color-indigo;
}

.pl-status-label-rejected {
  background: rgba(142, 142, 147, 0.1);
  color: $grey-06;
}

.pl-status-label-cancel {
  background: rgba(255, 59, 48, 0.1);
  color: $system-color-red;
}
</style>
