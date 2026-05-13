<template>
  <div class="public-params-wrapper">
    <section>
      <div class="param-title">{{ $t('api_adapter.outer_api.popup.API_declare') }}</div>
      <div class="shadow-box">
        <div class="flex-box">
          <span>{{ $t('api_adapter.outer_api.popup.API_name') }}</span>
          <el-input class="emotibot normal" v-model="apiName" :placeholder="$t('api_adapter.outer_api.popup.API_name_placeholder')"></el-input>
        </div>
        <div class="flex-box url">
          <span>API URL</span>
          <div class="input-box">
            <el-input class="emotibot normal" v-model="apiUrl" :placeholder="'HTTP://'"></el-input>
            <p class="desc">{{ $t('api_adapter.outer_api.popup.API_URL_placeholder') }}</p>
          </div>
        </div>
        <div class="flex-box">
          <span>{{ $t('api_adapter.outer_api.popup.request_method') }}</span>
          <el-select class="emotibot" v-model="method" placeholder="" size="mini">
            <el-option
              v-for="item in methods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="flex-box">
          <span>{{ $t('api_adapter.outer_api.popup.timeout') }}</span>
          <el-input-number v-model="timeout" ref="edit-input" size="mini" class="emotibot"
            controls-position="right" :min="0"></el-input-number>
          <span style="margin-left: 10px;">ms</span>
        </div>
      </div>
    </section>
    <section>
      <div class="param-title">
        {{ $t('api_adapter.outer_api.popup.request_param') }}
        <el-button
        type="text"
        class="emotibot primary"
        size="small"
        @click="handleAddRequestParam">{{ $t('api_adapter.outer_api.popup.btn_add_param') }}</el-button>
      </div>
      <el-table class="emotibot small" :data="requestParams">
        <el-table-column :label="`*${$t('api_adapter.outer_api.popup.param_name')}`">
          <template slot-scope="scope">
            <template v-if="scope.row.paramNameEdit === true">
              <el-input :ref="`paramName${scope.$index}`" @blur="handleBlurCol('paramName', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.param_name_placeholder')" v-model="scope.row.paramName"></el-input>
            </template>
            <div class="display-box" v-else @click="handleEditCol('paramName', scope)">
              <span class="pd15">
                {{ scope.row.paramName.length === 0 ? $t('api_adapter.outer_api.popup.param_name_placeholder') : scope.row.paramName }}
              </span>
              <i class="edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="`*${$t('api_adapter.outer_api.popup.param_position')}`">
          <template slot-scope="scope">
            <template v-if="scope.row.paramLocationEdit === true">
              <el-select :ref="`paramLocation${scope.$index}`" class="emotibot" v-model="scope.row.paramLocation" @visible-change="(isVisible) => handleBlurCol('paramLocation', scope, isVisible)" size="mini">
                <el-option
                  v-for="item in positionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <div class="display-box" v-else @click="handleEditCol('paramLocation', scope, true)">
              <span class="pd15">
                {{ scope.row.paramLocation.length === 0 ? $t('api_adapter.outer_api.popup.param_position') : scope.row.paramLocation }}
              </span>
              <i class="edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('api_adapter.outer_api.popup.default')">
          <template slot-scope="scope">
            <template v-if="scope.row.defaultValueEdit === true">
              <el-input :ref="`defaultValue${scope.$index}`" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.default_placeholder')" v-model="scope.row.defaultValue" @blur="handleBlurCol('defaultValue', scope)"></el-input>
            </template>
            <div class="display-box" v-else @click="handleEditCol('defaultValue', scope)">
              <span class="pd15">
                {{ scope.row.defaultValue.length > 0 ? scope.row.defaultValue : '-' }}
              </span>
              <i class="edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="`*${$t('api_adapter.outer_api.popup.required')}`">
          <template slot-scope="scope">
            <template v-if="scope.row.mustEdit === true">
              <el-select :ref="`must${scope.$index}`" class="emotibot" v-model="scope.row.must" @visible-change="(isVisible) => handleBlurCol('must', scope, isVisible)" size="mini">
                <el-option
                  v-for="item in boolList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <div class="display-box" v-else @click="handleEditCol('must', scope, true)">
              <span class="pd15">{{ scope.row.must ? $t('general.yes') : $t('general.no') }}</span>
              <i class="edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('api_adapter.outer_api.popup.comment')">
          <template slot-scope="scope">
            <template v-if="scope.row.commentEdit === true">
              <el-input :ref="`comment${scope.$index}`" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.comment_placeholder')" v-model="scope.row.comment" @blur="handleBlurCol('comment', scope)"></el-input>
            </template>
            <div class="display-box" v-else @click="handleEditCol('comment', scope)">
              <span class="pd15">{{ scope.row.comment.length > 0 ? scope.row.comment : '-' }}</span>
              <i class="edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('api_adapter.outer_api.table.opt')">
          <template slot-scope="scope">
            <el-button @click="handleDelParam(scope, requestParams)" type="text" class="emotibot error pd15" size="small">{{ $t('general.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <public-response-param
    ref="requestBodyTab"
    key="request"
    :paramType = "'request'"
    :bodyParams="bodyParams">
    </public-response-param>
  </div>
</template>

<script>
import api from '../_api/publicadapter';
import PublicResponseParam from '../_components/PublicResponseParam';

export default {
  name: 'public-request-param',
  api,
  components: {
    PublicResponseParam,
  },
  props: {
    apiDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      apiName: '',
      method: 'POST',
      apiUrl: '',
      timeout: 1000,
      requestParams: [],
      bodyParams: {},
      methods: [{
        value: 'POST',
        label: 'POST',
      }, {
        value: 'GET',
        label: 'GET',
      }, {
        value: 'PUT',
        label: 'PUT',
      }, {
        value: 'DELETE',
        label: 'DELETE',
      }],
      positionList: [{
        value: 'header',
        label: 'header',
      }, {
        value: 'path',
        label: 'path',
      }, {
        value: 'query',
        label: 'query',
      }],
      boolList: [{
        value: true,
        label: this.$t('general.yes'),
      }, {
        value: false,
        label: this.$t('general.no'),
      }],
    };
  },
  watch: {
    apiDetail: {
      handler() {
        this.handleInitParam();
      },
      deep: true,
    },
  },
  methods: {
    arraySpanMethod({ row }) {
      if (row.id === -1) {
        return [1, 2, 3, 4, 5, 6, 7];
      }
      return true;
    },
    handleAddRequestParam() {
      const requestParamObj = {
        paramName: '',
        paramLocation: '',
        must: true,
        defaultValue: '',
        comment: '',
      };
      this.requestParams.push(requestParamObj);
    },
    handleDelParam(scope, table) {
      const index = scope.$index;
      table.splice(index, 1);
    },
    handleEditCol(key, scope, isSelect) {
      this.$set(scope.row, `${key}Edit`, true);
      this.$nextTick(() => {
        if (isSelect) {
          this.$refs[`${key}${scope.$index}`].toggleMenu();
          return;
        }
        this.$refs[`${key}${scope.$index}`].focus();
      });
    },
    handleBlurCol(key, scope, isVisible) {
      if (isVisible) {
        return;
      }
      this.$set(scope.row, `${key}Edit`, false);
      delete scope.row[`${key}Edit`];
    },
    handleInitParam() {
      if (this.apiDetail && JSON.stringify(this.apiDetail) !== '{}') {
        this.apiName = this.apiDetail.apiName;
        this.apiUrl = this.apiDetail.apiUrl;
        this.method = this.apiDetail.method;
        this.timeout = this.apiDetail.timeout;
        if (this.apiDetail.requestDataDefinition.params) {
          this.requestParams =
          JSON.parse(JSON.stringify(this.apiDetail.requestDataDefinition.params));
        }
        if (this.apiDetail.requestDataDefinition.body) {
          this.bodyParams = this.apiDetail.requestDataDefinition.body;
        }
      } else {
        Object.assign(this.$data, this.$options.data.call(this));
      }
    },
    handleSaveRequestParam() {
      if (this.apiName.trim() === ''
      || this.apiUrl.trim() === ''
      || this.method.trim === ''
      || typeof this.timeout === 'undefined') {
        this.$message.error(this.$t('api_adapter.outer_api.api_declare_empty'));
        return false;
      }
      if (this.requestParams.length > 0) {
        const paramNameArr = this.requestParams.map(item => item.paramName);
        if ([...new Set(paramNameArr)].length < paramNameArr.length) {
          this.$message.error(this.$t('api_adapter.outer_api.api_request_param_duplicate'));
          return false;
        }
        if (this.requestParams.findIndex(item => item.paramName.trim() === ''
        || item.paramLocation.trim() === '') > -1) {
          this.$message.error(this.$t('api_adapter.outer_api.api_request_param_empty'));
          return false;
        }
      }
      const bodyParam = this.$refs.requestBodyTab.handleSaveBodyConfig();
      if (!bodyParam) {
        return false;
      }
      const requestParam = {
        apiName: this.apiName,
        apiUrl: this.apiUrl,
        method: this.method,
        timeout: this.timeout,
        requestDataDefinition: {
          params: this.requestParams,
          body: bodyParam,
        },
      };
      return requestParam;
    },
  },
  created() {
    this.handleInitParam();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

i.edit-icon {
  margin-left: 3px;
  width: 10px;
  height: 10px;
  background: url('../../../assets/icons/edit_blue_icon.svg') no-repeat center;
  background-size: 10px 10px;
  display: none;
  vertical-align: middle;
}
.public-params-wrapper {
  .el-button {
    min-width: 20px;
  }
  color: $color-font-normal;
  > section {
    margin-bottom: 20px;
    .param-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      @include font-14px();
      /deep/ button {
        @include font-12px();
      }
    }
    .shadow-box {
      border-radius:2px;
      padding: 20px;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      background-color: $color-bg-f7;
    }
    .flex-box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      >span {
        display: block;
        width: 70px;
        flex-shrink: 0;
      }
      &.url {
        align-items: initial;
        >span {
          margin-top: 10px;
        }
      }
      >div.input-box {
        width: 100%;
        flex: 1;
      }
      p.desc {
        margin-top: 5px;
        color: $color-font-mark;
        @include font-12px();
      }
    }
    /deep/ .el-table {
      td .cell {
        padding: 0 5px;
      }
      .display-box {
        display: flex;
        padding: 0 15px;
        align-items: center;
        cursor: pointer;
        .pd15 {
          padding: 0;
        }
        &:hover {
          .pd15 {
            color: $color-primary;
          }
          .edit-icon {
            display: block;
            flex-shrink: 0;
          }
        }
      }
      .emotibot.el-button--text {
        @include font-12px();
      }
    }
    .pd15 {
      display: block;
      box-sizing: border-box;
      padding: 0 15px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .sub-section {
      border-radius: 2px;
      .sub-section-title {
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-shadow: 0px 1px 0px 0px $color-borderline;
        height: 40px;
        background-color: $table-header-background;
        button {
          margin-left: 20px;
        }
      }
      .sub-section-body {
        padding: 20px;
        background-color: $table-body-hover-background;
        /deep/ .el-table {
          .emotibot.el-button--text {
            @include font-12px();
          }
        }
        .param-custom-wrapper {
          margin-top: 10px;
          background: #eee;
          padding: 10px;
          border-radius: 1px;
          @include font-12px();
          &:first-child {
            margin-top: 0px;
          }
          .param-type-title {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            >* {
              flex-shrink: 0;
              margin-left: 10px;
            }
            /deep/ .emotibot.el-input.mini {
              flex: 1;
              input {
                width: 300px;
              }
            }
          }
        }
      }
    }
  }
}
.el-table {
  .cell{
    div{
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>

