<template>
  <div>
    <el-dialog
      class="emotibot"
      width="935px"
      :title="type === 'edit' ? $t('api_adapter.outer_api.popup.edit_adapter') : $t('api_adapter.outer_api.popup.create_adapter')"
      :visible.sync="show"
      :close-on-click-modal = "false"
      :lock-scroll="false"
      @close="handleCancel">
      <el-tabs :tab-position="'left'" v-model="activeTab" class="emotibot" style="height: 100%;">
        <el-tab-pane :label="$t('api_adapter.outer_api.popup.request_param')" name="request">
          <public-request-param
          ref="requestTab"
          :apiDetail="apiDetail"></public-request-param>
        </el-tab-pane>
        <el-tab-pane :label="$t('api_adapter.outer_api.popup.response_param')" name="response">
          <public-response-param
          key="response"
          ref="responseTab"
          :paramType="'response'"
          :bodyParams="bodyParams">
          </public-response-param>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <text-button slot="reference" @click="handleCancel">{{ $t('general.cancel') }}</text-button>
        <text-button class="primary" slot="reference" @click="handleSaveConfig" >
          {{ this.type === 'edit' ? $t('api_adapter.btn.confirm_edit') : $t('api_adapter.btn.confirm_add')}}
        </text-button>
      </div>
     </el-dialog>
  </div>
</template>

<script>
import api from '../_api/publicadapter';
import PublicRequestParam from './PublicRequestParam';
import PublicResponseParam from './PublicResponseParam';

export default {
  name: 'public-api-popup',
  api,
  components: {
    PublicRequestParam,
    PublicResponseParam,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'edit', // edit or create
    },
    apiDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      show: false,
      bodyParams: {},
      activeTab: 'request',
    };
  },
  watch: {
    visible(val) {
      this.show = val;
      if (!val) {
        Object.assign(this.$data, this.$options.data());
      }
    },
    apiDetail: {
      handler() {
        this.handleInitParam();
      },
      deep: true,
    },
  },
  methods: {
    handleCancel() {
      this.show = false;
      this.$emit('cancel');
    },
    handleInitParam() {
      if (this.apiDetail && JSON.stringify(this.apiDetail) !== '{}') {
        if (!this.apiDetail.responseDataDefinition.body) {
          return;
        }
        this.bodyParams = this.apiDetail.responseDataDefinition.body;
      } else {
        this.bodyParams = {};
      }
    },
    handleSaveConfig() {
      const requestConfig = this.$refs.requestTab.handleSaveRequestParam(this.type);
      if (!requestConfig) {
        return;
      }
      const responseConfig = this.$refs.responseTab.handleSaveBodyConfig(this.type);
      if (!responseConfig) {
        return;
      }
      requestConfig.responseDataDefinition = {
        body: responseConfig,
      };
      if (this.type === 'edit') {
        this.$api.updateAPI(this.apiDetail.id, requestConfig)
        .then((data) => {
          if (data.status >= 0) {
            this.$message.success(this.$t('api_adapter.outer_api.edit_success'));
            this.$parent.handleGetPublishAPI();
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
        this.$api.addAPI(requestConfig)
        .then((data) => {
          if (data.status >= 0) {
            this.$message.success(this.$t('api_adapter.outer_api.create_success'));
            this.$parent.handleGetPublishAPI();
          } else {
            this.$message.error(data.message);
          }
        });
      }
      this.show = false;
      this.$emit('cancel');
    },
  },
  created() {
    this.handleInitParam();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.api-adapter {
  display: flex;
  flex-direction: column;
  .card-header {
    padding: 0 20px;
    height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    .title {
      @include font-16px();
    }
  }
  ::v-deep .emotibot.el-table {
    display: flex;
    flex-direction: column;
    .el-table__header-wrapper {
      flex-shrink: 0;
    }
    .el-table__body-wrapper {
      flex: 1;
      height: auto;
      overflow-y: auto;
    }
  }
  ::v-deep .emotibot.el-pagination {
    text-align: right;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
::v-deep .emotibot.el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
::v-deep .emotibot.el-tabs--left {
  display: flex;
  margin: 1px 0;
  .el-tabs__header.is-left {
    height: auto;
    flex-shrink: 0;
    background: $color-bg-fc;
    width: 120px;
    .el-tabs__nav-scroll {
      padding: 20px 0;
    }
    .el-tabs__nav-wrap::after {
      width: 1px;
      background-color: $table-border-color-e9;
    }
  }
  .el-tabs__content {
    padding: 20px 20px 20px 0;
    flex: 1;
  }
}

</style>

