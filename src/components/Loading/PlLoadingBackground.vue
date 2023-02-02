<template>
  <transition name="fade">
    <div
      class="modal fade modal-container"
      :class="{ show: showLoading }"
      :id="id"
      v-show="showLoading"
      data-backdrop="keyboard"
      role="dialog"
      tabindex="-1"
      :aria-labelledby="ariaLabelledby"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <slot name="body"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PlLoadingBackground",
  props: {
    id: {
      type: String,
      default: ""
    },
    ariaLabelledby: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters({ showLoading: "loading/isShowLoading" })
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-modal";
</style>
