<template>
  <div class="container-fluid pl-field">
    <slot />
  </div>
</template>

<script>
export default {
  name: "PlField"
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.pl-field {
  display: flex;
  position: relative;
}
//.pl-field:before {
//  position: absolute;
//  bottom: 0;
//  right: 0;
//  left: 0;
//  transition: border 0.3s cubic-bezier(0.4, 0, 0.2, 1),
//    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
//    transform 0s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
//  will-change: border, opacity, transform;
//  content: " ";
//  height: 1px;
//  z-index: 2;
//  opacity: 0;
//  transform: scaleX(0.12);
//}
.pl-field.pl-error:before {
  background-color: $system-color-red !important;
}
.pl-field.pl-valid:before {
  background-color: $monex-color-00 !important;
}
.pl-field .pl-input:focus,
.pl-field .pl-input input:focus,
.pl-field .pl-textarea:focus {
  outline: none;
}
.pl-success-icon {
  right: -24px;
  position: absolute;
  width: 16px;
  height: 16px;
  align-self: center;
}

.pl-field.pl-valid:before,
.pl-field.pl-error:before {
  opacity: 1;
  transform: scaleX(1);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: border, opacity, transform;
}
</style>
