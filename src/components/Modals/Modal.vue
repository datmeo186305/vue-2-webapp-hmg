<template>
  <transition name="fade">
    <div
      class="modal fade modal-container"
      :class="{ show: isShown && modalType !== null && type === modalType }"
      :id="id"
      v-show="isShown && modalType !== null && type === modalType"
      data-backdrop="keyboard"
      role="dialog"
      tabindex="-1"
      :aria-labelledby="ariaLabelledby"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <button
            type="button"
            class="top-modal-close-btn"
            @click="closeModal"
            v-if="showTopCloseBtn"
        >
          <img
              :src="'/img/pl/dismiss-white.svg'"
              alt=""
              class="dismiss-modal-btn"
          />
        </button>
        <div class="modal-content" v-click-outside="clickOutside">
          <button
            type="button"
            class="waves-effect ml-auto modal-close"
            @click="closeModal"
            v-if="showCloseBtn"
          >
            <img
                :src="'/img/pl/dismiss-white.svg'"
                alt=""
                class="dismiss-modal-btn"
            />
          </button>

          <slot name="body"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    id: {
      type: String,
      default: ""
    },
    ariaLabelledby: {
      type: String,
      default: ""
    },
    clickOutsideToClose: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      required: true
    },
    showCloseBtn: {
      type: Boolean,
      default: true
    },
    showTopCloseBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShown: false,
      canClose: false,
      modalType: null
    };
  },
  watch: {
    "$store.state.modal.show": {
      handler: function(newVal) {
        this.isShown = newVal;
        if (newVal) this.canClose = false;
      },
      immediate: true
    },
    "$store.state.modal.type": {
      handler: function(newVal) {
        if (!newVal) {
          return;
        }
        this.modalType = newVal;
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
      this.$emit("closeModal");
    },
    clickOutside() {
      if (
        this.clickOutsideToClose &&
        this.modalType === this.type &&
        this.isShown &&
        this.canClose
      ) {
        this.closeModal();
      } else this.canClose = this.modalType === this.type;
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-modal";
</style>
