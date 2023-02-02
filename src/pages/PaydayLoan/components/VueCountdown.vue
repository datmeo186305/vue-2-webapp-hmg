<template>
  <div class="countdown">
    <div class="text-countdown">{{ text }}</div>
    <div class="timer-countdown-container">
      <p>{{ days | two_digits }}</p>
      <p class="timer-separate">:</p>
      <p>{{ hours | two_digits }}</p>
      <p class="timer-separate">:</p>
      <p>{{ minutes | two_digits }}</p>
      <p class="timer-separate">:</p>
      <p>{{ seconds | two_digits }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueCountdown",
  props: {
    date: {
      type: String
    },
    text: {
      type: String
    }
  },
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000)
    };
  },
  computed: {
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.date) / 1000);
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    }
  },
  mounted() {
    let timerCountdown = window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
      if (this.now >= Math.trunc(Date.parse(this.date) / 1000)) {
        this.$emit("countdownSuccess");
        window.clearInterval(timerCountdown);
      }
    }, 1000);
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/pl/pl-layout";
@import "src/assets/scss/variables";
.text-countdown {
  font-family: $sfUiDisplay;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: $monex-color-01;
  margin-bottom: 4px;
}

.timer-countdown-container {
  display: flex;
  place-content: center;
  p {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 38px;
    text-align: center;
    color: $monex-color-00;
  }
  .timer-separate {
    margin-top: -3px;
  }
}
</style>
