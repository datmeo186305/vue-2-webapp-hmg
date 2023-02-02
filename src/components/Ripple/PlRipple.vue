<template>
  <div
    :class="['pl-ripple', rippleClasses]"
    @touchstart.passive="event => plEventTrigger && touchStartCheck(event)"
    @touchmove.passive="event => plEventTrigger && touchMoveCheck(event)"
    @mousedown.passive="event => plEventTrigger && startRipple(event)"
  >
    <slot />
    <!--    v-if="!isDisabled"-->
    <pl-wave
      v-for="ripple in ripples"
      :key="ripple.uuid"
      :class="['pl-ripple-wave', waveClasses]"
      :style="ripple.waveStyles"
      @pl-end="clearWave(ripple.uuid)"
    />
  </div>
</template>

<script>
import raf from "raf";
import uuid from "@/core/utils/PlUuid";
import PlWave from "./PlWave";

export default {
  name: "PlRipple",
  components: {
    PlWave
  },
  props: {
    plActive: null,
    plDisabled: Boolean,
    plCentered: Boolean,
    plEventTrigger: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    ripples: [],
    touchTimeout: null,
    eventType: null
  }),
  computed: {
    isDisabled() {
      return this.plDisabled;
    },
    rippleClasses() {
      return {
        "pl-disabled": this.isDisabled
      };
    },
    waveClasses() {
      return {
        "pl-centered": this.plCentered
      };
    }
  },
  watch: {
    plActive(active) {
      const isBoolean = typeof active === "boolean";
      const isEvent = active instanceof MouseEvent;

      if (isBoolean && this.plCentered && active) {
        this.startRipple({
          type: "mousedown"
        });
      } else if (isEvent) {
        this.startRipple(active);
      }

      this.$emit("update:plActive", false);
    }
  },
  methods: {
    touchMoveCheck() {
      window.clearTimeout(this.touchTimeout);
    },
    touchStartCheck($event) {
      this.touchTimeout = window.setTimeout(() => {
        this.startRipple($event);
      }, 100);
    },
    startRipple($event) {
      raf(() => {
        const { eventType, isDisabled, plCentered } = this;

        if (!isDisabled && (!eventType || eventType === $event.type)) {
          let size = this.getSize();
          let position = null;

          if (plCentered) {
            position = this.getCenteredPosition(size);
          } else {
            position = this.getHitPosition($event, size);
          }

          this.eventType = $event.type;
          this.ripples.push({
            waveStyles: this.applyStyles(position, size),
            uuid: uuid()
          });
        }
      });
    },
    applyStyles(position, size) {
      size += "px";

      return {
        ...position,
        width: size,
        height: size
      };
    },
    clearWave(uuid) {
      uuid
        ? (this.ripples = this.ripples.filter(ripple => ripple.uuid !== uuid))
        : (this.ripples = []);
    },
    getSize() {
      const { offsetWidth, offsetHeight } = this.$el;

      return Math.round(Math.max(offsetWidth, offsetHeight));
    },
    getCenteredPosition(size) {
      const halfSize = -size / 2 + "px";

      return {
        "margin-top": halfSize,
        "margin-left": halfSize
      };
    },
    getHitPosition($event, elementSize) {
      const rect = this.$el.getBoundingClientRect();
      let top = $event.pageY;
      let left = $event.pageX;

      if ($event.type === "touchstart") {
        top = $event.changedTouches[0].pageY;
        left = $event.changedTouches[0].pageX;
      }

      return {
        top:
          top -
          rect.top -
          elementSize / 2 -
          document.documentElement.scrollTop +
          "px",
        left:
          left -
          rect.left -
          elementSize / 2 -
          document.documentElement.scrollLeft +
          "px"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.pl-ripple {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  overflow: hidden;
  -webkit-mask-image: radial-gradient(circle, #fff 100%, #000 100%);
}

.pl-ripple-wave {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background: currentColor;
  border-radius: 50%;
  opacity: 0;
  transform: scale(2) translateZ(0);

  &.pl-centered {
    animation-duration: 1.2s;
    top: 50%;
    left: 50%;
  }
  ~ *:not(.pl-ripple-wave) {
    position: relative;
    z-index: 2;
  }
}

.pl-ripple > span {
  overflow: hidden;
  position: absolute;
}

.pl-ripple span.pl-ripple-wave {
  border-radius: 50% !important;
}

.pl-ripple-enter-active.pl-centered {
  transition-duration: 1.2s;
}

</style>
