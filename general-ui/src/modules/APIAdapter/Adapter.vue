<template>
  <div class="adapter">
    <el-tabs v-model="activeTab" class="emotibot">
      <el-tab-pane name="public">
        <span style="padding: 0 20px;" slot="label">{{ $t('api_adapter.outer_api.title') }}</span>
        <api-adapter></api-adapter>
      </el-tab-pane>
      <el-tab-pane name="private">
        <span style="padding: 0 20px;" slot="label">{{ $t('api_adapter.api_private.title') }}</span>
        <api-private></api-private>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import APIAdapter from './APIAdapter';
import APIPrivate from './APIPrivate';

export default {
  privCode: 'api_adapter',
  components: {
    'api-adapter': APIAdapter,
    'api-private': APIPrivate,
  },
  data() {
    return {
      activeTab: 'public',
    };
  },
};
</script>

<style lang="scss" scoped>
  #app-page > .app-body.adapter {
    padding: 0;
    >div {
      margin: 0 20px;
    }
    .emotibot.el-tabs.el-tabs--top {
      margin: 0;
      display: flex;
      flex-direction: column;
      /deep/ {
        > .el-tabs__content {
          margin: 0 20px;
          flex: 1;
          >div {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
</style>