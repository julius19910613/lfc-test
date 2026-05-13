<template>
  <div class="bf-loading" :class="{'light': theme === 'light',
  'dark': theme === 'dark', 'light-transparent': theme === 'transparent'}">
    <div class="loader">
      <div class="loader-inner ball-beat">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    theme: {
      type: String,
      default: 'light',
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

@-webkit-keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75); }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1); } }

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75); }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1); } }

.bf-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
  left: 0;
  &.light {
    background: $color-bg-light;
    .loader {
      .ball-beat  > div {
        background: $color-bg-blue;
      }
    }
  }
  &.light-transparent{
    background: rgba(255, 255, 255, .5);
    .loader {
      .ball-beat  > div {
        background: $color-bg-blue;
      }
    }
  }
  &.dark {
    background: $color-bg-dark-transparent;
    .loader {
      .ball-beat  > div {
        background: $color-bg-light;
      }
    }
  }
  .loader {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .ball-beat  > div {
      width: 15px;
      height: 15px;
      border-radius: 100%;
      margin: 2px;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      display: inline-block;
      -webkit-animation: ball-beat 0.7s 0s infinite linear;
      animation: ball-beat 0.7s 0s infinite linear;
    }
    .ball-beat > div:nth-child(2n-1) {
      -webkit-animation-delay: -0.35s !important;
      animation-delay: -0.35s !important;
    }
  }
}
</style>
