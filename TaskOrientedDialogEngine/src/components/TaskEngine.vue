<template>
  <div class="task-engine-wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  path: 'task-engine',
  name: 'task-engine',
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.task-engine-wrapper{
  overflow: hidden;
  @extend .white-panel;
  height: calc(100% - 40px) !important;
  font-family:PingFangHK-Regular;
  font-weight:400;
}
</style>
