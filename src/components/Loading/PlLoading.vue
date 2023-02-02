<template>
  <pl-loading-background
    :id="'payday-loan-loading'"
    :ariaLabelledby="'LoadingAria'"
    :class="{
      'modal-content-transparent': !loadingContent
    }"
  >
    <template slot="body">
      <div class="pl-modal-loading-content-container">
        <div class="text-center">
          <img src="/img/pl/gif/monex_loading.gif" alt="" class="gif-resource"/>

          <p class="pl-modal-loading-title" v-if="loadingContent">
            {{ loadingContent.title }}
          </p>
          <p class="pl-modal-loading-content" v-if="loadingContent">
            {{ loadingContent.content }}
          </p>
        </div>
      </div>
    </template>
  </pl-loading-background>
</template>

<script>
import PlLoadingBackground from "./PlLoadingBackground";
import { mapGetters } from "vuex";
export default {
  name: "PlLoading",
  components: { PlLoadingBackground },
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters({
      loadingContent: "loading/loadingContent"
    })
  }
};
</script>

<style scoped lang="scss"></style>
