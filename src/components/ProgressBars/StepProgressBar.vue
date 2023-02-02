<template>
  <div class="step-progress-bar-container">
    <div class="step-progress-number-container">
      <ul>
        <template v-for="(stepTitle, index) in stepTitles">
          <li
            :class="[
              {
                'roadmap-checkpoint-passed': initCurrentStep > index + 1
              },
              { 'roadmap-checkpoint-current': initCurrentStep === index + 1 }
            ]"
            :key="'step-number-' + index"
          >
            <div class="step-number">
              {{ index + 1 }}
            </div>
          </li>
          <li
            v-if="index !== stepTitles.length - 1"
            :class="{
              'roadmap-checkpoint-passed': initCurrentStep > index + 1
            }"
            :key="'progressbar-dash-' + index"
          >
            <div class="progressbar-dash"/>
          </li>
        </template>
      </ul>
    </div>
    <div class="step-progress-title-container">
      <ul>
        <li
          :class="{
            'roadmap-checkpoint-passed': initCurrentStep >= index + 1
          }"
          :key="'step-title-' + index"
          v-for="(stepTitle, index) in stepTitles"
        >
          <div class="step-title">
            {{ stepTitle }}
          </div>
        </li>
      </ul>
    </div>
    <ul/>
  </div>
</template>

<script>
export default {
  name: "StepProgressBar",
  props: {
    initCurrentStep: {
      type: Number,
      default: 1
    },
    stepTitles: {
      type: Array
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.step-progress-number-container {
  padding: 0 32px;
  ul {
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin-bottom: 0;
  }
  li:nth-child(even) {
    width: 100%;
    align-self: center;
    padding: 0 8px;
  }
  li:nth-child(odd) {
    place-items: center;
  }

  .step-number {
    border-radius: 50%;
    background: #f5f5ff;
    width: 24px;
    height: 24px;
    padding: 0;
    transition: background 0.5s ease;

    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 24px;
    /* identical to box height, or 133% */

    text-align: center;

    /* System / Indigo */

    color: $white;
    background: $minsk;
  }
  .progressbar-dash {
    background: $minsk;
    height: 1px;
    width: 100%;
    align-self: center;
    z-index: 1;
    transition: background-color 0.5s ease-in-out;
  }

  .roadmap-checkpoint-current {
    .step-number {
      background: $titan-white;
      color: $system-color-indigo;
      transition: color 0.5s ease-in-out, background-color 0.5s ease-in-out;
    }
  }
  .roadmap-checkpoint-passed {
    .step-number {
      background: $system-color-indigo;
      transition: color 0.5s ease-in-out, background-color 0.5s ease-in-out;
      color: $white;
    }

    .progressbar-dash {
      background: $system-color-indigo;
      transition: background-color 0.5s ease-in-out;
    }
  }
  .roadmap-checkpoint-inactive {
    .step-number {
      background: $minsk;
      color: $white;
      transition: color 0.5s ease-in-out, background-color 0.5s ease-in-out;
    }
  }
}
.step-progress-title-container {
  padding: 0 12px;

  ul {
    padding: 0;
    display: flex;
    margin: 0 !important;
    justify-content: space-between;
    height: auto;
    align-items: center;
    min-height: 32px;
  }

  li {
    width: 64px;
  }

  .step-title {
    font-family: $sfUiDisplay;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 10px;
    width: 64px;
    /* or 100% */

    align-items: center;
    text-align: center;

    color: $lavender-purple;
    transition: color 0.5s ease-in-out;
  }

  .roadmap-checkpoint-current {
    .step-title {
      color: $malibu-2;
      transition: color 0.5s ease-in-out;
    }
  }
  .roadmap-checkpoint-passed {
    .step-title {
      color: $malibu-2;
      transition: color 0.5s ease-in-out;
    }
  }
}
</style>
