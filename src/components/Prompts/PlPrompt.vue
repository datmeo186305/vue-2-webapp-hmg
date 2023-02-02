<template>
  <transition name="fade">
    <div
      class="modal fade modal-container prompt-container"
      :class="{ show: isShown }"
      :id="id"
      v-show="isShown"
      data-backdrop="keyboard"
      role="dialog"
      tabindex="-1"
      :aria-labelledby="ariaLabelledby"
      aria-hidden="true"
    >
      <div
        class="modal-dialog prompt-dialog modal-dialog-centered"
        role="document"
      >
        <div
          class="modal-content prompt-content"
          v-click-outside="clickOutside"
        >
          <slot name="image">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="img"
              class="pl-prompt-image"
            />
          </slot>
          <slot name="title">
            <h2 class="pl-prompt-title" v-if="promptContent">
              {{ promptContent.title }}
            </h2>
          </slot>
          <slot name="body">
            <div v-if="promptContent" class="pl-prompt-body">
              <p v-html="promptContent.content" />
            </div>
          </slot>
          <slot name="actions">
            <div
              class="text-center d-flex pl-prompt-actions"
              v-if="promptContent"
            >
              <pl-prompt-button
                type="button"
                class="btn-secondary"
                v-if="promptContent.secondaryBtnText"
                :disabled="promptContent.disabledBtn"
                @click="clickSecondaryBtn"
              >
                {{ promptContent.secondaryBtnText }}
              </pl-prompt-button>
              <pl-prompt-button
                type="button"
                class="btn-primary"
                v-if="promptContent.primaryBtnText"
                :disabled="promptContent.disabledBtn"
                @click="clickPrimaryBtn"
              >
                {{ promptContent.primaryBtnText }}
              </pl-prompt-button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import PlPromptButton from "../Buttons/PlPromptButton";

export default {
  name: "PlPrompt",
  components: { PlPromptButton },
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
      default: false
    },
    imageUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isShown: false,
      canClose: false
    };
  },
  computed: {
    ...mapGetters({
      promptContent: "prompt/currentPromptContent"
    })
  },
  watch: {
    "$store.state.prompt.show": {
      handler: function(newVal) {
        this.isShown = newVal;
        if (newVal) this.canClose = false;
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$store.commit("modal/DESTROY_MODAL");
      this.$emit("closeModal");
    },
    clickSecondaryBtn() {
      this.$emit("clickSecondaryBtn");
    },
    clickPrimaryBtn() {
      this.$emit("clickPrimaryBtn");
    },
    clickOutside() {
      if (this.clickOutsideToClose && this.isShown && this.canClose) {
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/variables";
@import "src/assets/scss/pl/pl-prompt";
</style>
