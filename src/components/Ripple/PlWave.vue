<template>
  <transition name="pl-ripple" @after-enter="end" appear>
    <span v-if="animating" />
  </transition>
</template>

<script>
export default {
  name: "PlWave",
  props: {
    waveClasses: null,
    waveStyles: null
  },
  data() {
    return {
      animating: false
    };
  },
  mounted: function() {
    this.animating = true;
  },
  methods: {
    end() {
      this.animating = false;
      this.$emit("pl-end");
    }
  }
};
</script>

<style lang="scss" scoped>
$pl-transition-stand-timing: 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
.pl-ripple-enter-active {
  transition: 0.8s $pl-transition-stand-timing;
  transition-property: opacity, transform;
  will-change: opacity, transform;
  &.pl-centered {
    transition-duration: 1.2s;
  }
}

.pl-ripple-enter {
  opacity: 0.26;
  transform: scale(0.26) translateZ(0);
}
</style>
