<template>
  <div class="public-body-wrapper">
    <section>
      <div class="param-title">BODY</div>
      <div class="shadow-box">
        <div class="flex-box">
          <span>{{ $t('api_adapter.outer_api.popup.body_type') }}</span>
          <el-select class="emotibot" v-model="bodyType" size="small">
            <el-option
              v-for="item in bodyTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="bodyType==='jsonArray'" class="emotibot" v-model="elementType" size="small" style="margin-left: 20px;">
            <el-option
              v-for="item in fieldTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <section class="sub-section">
        <div class="sub-section-title">body</div>
        <div class="sub-section-body">
          <el-table class="emotibot small inline"
          :data="bodyTable"
          :span-method="arraySpanMethod">
            <el-table-column min-width="1">
              <template slot-scope="scope">
                <el-button @click="handleAddRoot(scope.row)" type="text" class="emotibot primary pd15" size="small">{{ $t('api_adapter.outer_api.popup.btn_add_root') }}</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="`*${$t('api_adapter.outer_api.popup.field_name')}`" min-width="20">
              <template slot-scope="scope">
                <template v-if="scope.row.paramNameEdit === true">
                  <el-input :ref="`paramNameBody${scope.$index}`" @blur="handleBlurCol('paramName', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.param_name_placeholder')" v-model="scope.row.paramName"></el-input>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('paramName', 'Body', scope)">
                  <span class="pd15">
                    {{ scope.row.paramName.length === 0 ? $t('api_adapter.outer_api.popup.param_name_placeholder') : scope.row.paramName }}
                  </span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="`*${$t('api_adapter.outer_api.popup.is_array')}`" min-width="15">
              <template slot-scope="scope">
                <template v-if="scope.row.isArrayEdit === true">
                  <el-select :ref="`isArrayBody${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('isArray', scope, isVisible)" class="emotibot" v-model="scope.row.isArray" size="mini">
                    <el-option
                      v-for="item in boolList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('isArray', 'Body', scope, true)">
                  <span class="pd15">{{ scope.row.isArray ? $t('general.yes') : $t('general.no') }}</span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="`*${$t('api_adapter.outer_api.popup.field_type')}`" min-width="20">
              <template slot-scope="scope">
                <template v-if="scope.row.typeEdit === true">
                  <el-select :ref="`typeBody${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('type', scope, isVisible)" class="emotibot" v-model="scope.row.type" size="mini">
                    <el-option
                      v-for="item in fieldTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('type', 'Body', scope, true)">
                  <span class="pd15">
                    {{ scope.row.type.length === 0 ? $t('api_adapter.outer_api.popup.field_type') : scope.row.type }}
                  </span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('api_adapter.outer_api.popup.default')" min-width="11" v-if="paramType === 'request'">
              <template slot-scope="scope">
                <template v-if="scope.row.defaultValueEdit === true">
                  <el-input :ref="`defaultValueBody${scope.$index}`" @blur="handleBlurCol('defaultValue', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.default_placeholder')" v-model="scope.row.defaultValue"></el-input>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('defaultValue', 'Body', scope)">
                  <span class="pd15">{{ scope.row.defaultValue.length > 0 ? scope.row.defaultValue : '-' }}</span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="`*${$t('api_adapter.outer_api.popup.required')}`" min-width="10">
              <template slot-scope="scope">
                <template v-if="scope.row.mustEdit === true">
                  <el-select :ref="`mustBody${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('must', scope, isVisible)" class="emotibot" v-model="scope.row.must" size="mini">
                    <el-option
                      v-for="item in boolList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('must', 'Body', scope, true)">
                  <span class="pd15">{{ scope.row.must ? $t('general.yes') : $t('general.no') }}</span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('api_adapter.outer_api.popup.comment')" min-width="17">
              <template slot-scope="scope">
                <template v-if="scope.row.commentEdit === true">
                  <el-input :ref="`commentBody${scope.$index}`" @blur="handleBlurCol('comment', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.comment_placeholder')" v-model="scope.row.comment"></el-input>
                </template>
                <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('comment', 'Body', scope)">
                  <span class="pd15">{{ scope.row.comment.length > 0 ? scope.row.comment : '-' }}</span>
                  <i class="edit-icon"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('api_adapter.outer_api.table.opt')" min-width="9">
              <template slot-scope="scope">
                <el-button @click="handleDelParam(scope, bodyTable)" type="text" class="emotibot error pd15" size="small">{{ $t('general.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <template v-if="bodyType === 'jsonArray' || bodyType === 'jsonObject'">
         <section class="sub-section">
          <div class="sub-section-title">
            {{ $t('api_adapter.outer_api.popup.field_type') }}
            <el-button @click="handleAddCustomParam" type="text" class="emotibot primary" size="small">{{ $t('api_adapter.outer_api.popup.btn_add_field_type') }}</el-button>
          </div>
          <div class="sub-section-body">
            <div v-for="(item, index) in fieldParams" :key="`field${index}`" class="param-custom-wrapper">
              <div class="param-type-title">
                <span>{{ $t('api_adapter.outer_api.popup.type_name') }}</span>
                <el-input class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.type_name_placeholder')" v-model="item.typeName" @blur="handleCustomTypeChange(index)"></el-input>
                <icon :size=14 class="button" icon-type="material_del" @click="handleDelCustomParam(index)"></icon>
              </div>
              <el-table class="emotibot small inline"
              :data="item.fieldTable"
              :span-method="arraySpanMethod">
                <el-table-column min-width="1">
                  <template slot-scope="scope">
                    <el-button @click="handleAddCustomRow(item.fieldTable, scope)" type="text" class="emotibot primary pd15" size="small">{{ $t('api_adapter.outer_api.popup.btn_add_field') }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="`*${$t('api_adapter.outer_api.popup.field_name')}`" min-width="20">
                  <template slot-scope="scope">
                    <template v-if="scope.row.paramNameEdit === true">
                      <el-input :ref="`paramName${index}${scope.$index}`" @blur="handleBlurCol('paramName', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.param_name_placeholder')" v-model="scope.row.paramName"></el-input>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('paramName', index, scope)">
                      <span class="pd15">
                        {{ scope.row.paramName.length === 0 ? $t('api_adapter.outer_api.popup.param_name_placeholder') : scope.row.paramName }}
                      </span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="`*${$t('api_adapter.outer_api.popup.is_array')}`" min-width="15">
                  <template slot-scope="scope">
                    <template v-if="scope.row.isArrayEdit === true">
                      <el-select :ref="`isArray${index}${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('isArray', scope, isVisible)" class="emotibot" v-model="scope.row.isArray" size="mini">
                        <el-option
                          v-for="item in boolList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('isArray', index, scope, true)">
                      <span class="pd15">{{ scope.row.isArray ? $t('general.yes') : $t('general.no') }}</span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="`*${$t('api_adapter.outer_api.popup.field_type')}`" min-width="16">
                  <template slot-scope="scope">
                    <template v-if="scope.row.typeEdit === true">
                      <el-select :ref="`type${index}${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('type', scope, isVisible)" class="emotibot" v-model="scope.row.type" size="mini">
                        <el-option
                          v-for="item in fieldTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('type', index, scope, true)">
                      <span class="pd15">
                        {{ scope.row.type.length === 0 ? $t('api_adapter.outer_api.popup.field_type') : scope.row.type }}
                      </span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('api_adapter.outer_api.popup.default')" min-width="11" v-if="paramType === 'request'">
                  <template slot-scope="scope">
                    <template v-if="scope.row.defaultValueEdit === true">
                      <el-input :ref="`defaultValue${index}${scope.$index}`" @blur="handleBlurCol('defaultValue', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.default_placeholder')" v-model="scope.row.defaultValue"></el-input>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('defaultValue', index, scope)">
                      <span class="pd15">{{ scope.row.defaultValue.length > 0 ? scope.row.defaultValue : '-' }}</span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="`*${$t('api_adapter.outer_api.popup.required')}`" min-width="10">
                  <template slot-scope="scope">
                    <template v-if="scope.row.mustEdit === true">
                      <el-select :ref="`must${index}${scope.$index}`" @visible-change="(isVisible) => handleBlurCol('must', scope, isVisible)" class="emotibot" v-model="scope.row.must" size="mini">
                        <el-option
                          v-for="item in boolList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('must', index, scope, true)">
                      <span class="pd15">{{ scope.row.must ? $t('general.yes') : $t('general.no') }}</span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('api_adapter.outer_api.popup.comment')" min-width="17">
                  <template slot-scope="scope">
                    <template v-if="scope.row.commentEdit === true">
                      <el-input :ref="`comment${index}${scope.$index}`" @blur="handleBlurCol('comment', scope)" class="emotibot mini" :placeholder="$t('api_adapter.outer_api.popup.comment_placeholder')" v-model="scope.row.comment"></el-input>
                    </template>
                    <div v-else-if="scope.row.id !== -1" class="display-box" @click="handleEditCol('comment', index, scope)">
                      <span class="pd15">{{ scope.row.comment.length > 0 ? scope.row.comment : '-' }}</span>
                      <i class="edit-icon"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('api_adapter.outer_api.table.opt')" min-width="9">
                  <template slot-scope="scope">
                    <el-button @click="handleDelParam(scope, item.fieldTable)" type="text" class="emotibot error pd15" size="small">{{ $t('general.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>

<script>
import api from '../_api/publicadapter';

export default {
  name: 'public-response-param',
  api,
  components: {},
  props: {
    paramType: {
      type: String,
      default: 'request',
    },
    bodyParams: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    bodyTypes() {
      if (this.paramType === 'request') {
        return [{
          value: 'jsonObject',
          label: 'jsonObject',
        }, {
          value: 'form',
          label: 'form',
        }];
      }
      return [{
        value: 'jsonArray',
        label: 'jsonArray',
      }, {
        value: 'jsonObject',
        label: 'jsonObject',
      }];
    },
  },
  data() {
    return {
      bodyType: '',
      bodyTable: [{
        id: -1,
      }],
      fieldParams: [],
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
      fieldTypes: [{
        value: 'string',
        label: 'string',
      }, {
        value: 'number',
        label: 'number',
      }, {
        value: 'boolean',
        label: 'boolean',
      }],
      elementType: null,
    };
  },
  watch: {
    bodyParams: {
      handler() {
        Object.assign(this.$data, this.$options.data.call(this));
        this.handleInitBodyParam();
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
    handleAddRoot() {
      const fieldObj = {
        paramName: '',
        isArray: true,
        type: '',
        defaultValue: '',
        must: true,
        comment: '',
      };
      this.bodyTable.splice(this.bodyTable.length - 1, 0, fieldObj);
    },
    handleAddCustomParam() {
      const fieldTable = [{
        id: -1,
      }];
      this.fieldParams.push({
        typeName: '',
        fieldTable,
      });
    },
    handleAddCustomRow(fieldTable) {
      const fieldObj = {
        paramName: '',
        isArray: true,
        type: '',
        defaultValue: '',
        must: true,
        comment: '',
      };
      fieldTable.splice(fieldTable.length - 1, 0, fieldObj);
    },
    handleDelCustomParam(index) {
      const typeName = this.fieldParams[index].typeName;
      let typeFlag = false;
      if (this.bodyTable.findIndex(ele => ele.type === typeName) > -1 && typeName.trim() !== '') {
        typeFlag = true;
      }
      this.fieldParams.forEach((item) => {
        if (item.fieldTable.findIndex(ele => ele.type === typeName) > -1 && typeName.trim() !== '') {
          typeFlag = true;
        }
      });
      if (this.elementType === typeName || typeFlag) {
        this.$message.error(this.$t('api_adapter.outer_api.api_type_delete_err'));
        return;
      }
      this.fieldParams.splice(index, 1);
    },
    handleEditCol(key, type, scope, isSelect) {
      this.$set(scope.row, `${key}Edit`, true);
      this.$nextTick(() => {
        let refVal = this.$refs[`${key}${type}${scope.$index}`];
        if (type !== 'Body') {
          refVal = this.$refs[`${key}${type}${scope.$index}`][0];
        }
        if (isSelect) {
          refVal.toggleMenu();
          return;
        }
        refVal.focus();
      });
    },
    handleBlurCol(key, scope, isVisible) {
      if (isVisible) {
        return;
      }
      this.$set(scope.row, `${key}Edit`, false);
      delete scope.row[`${key}Edit`];
    },
    handleCustomTypeChange(index) {
      this.$set(this.fieldParams[index], 'typeName', this.fieldParams[index].typeName.trim());
      this.handleInitFieldTypes();
    },
    handleInitFieldTypes() {
      this.fieldTypes = this.fieldTypes.slice(0, 3);
      this.fieldParams.forEach((item) => {
        if (this.fieldTypes.findIndex(ele => ele.value === item.typeName) === -1
        && item.typeName.trim() !== '') {
          this.fieldTypes.push({
            label: item.typeName,
            value: item.typeName,
          });
        }
      });
    },
    handleInitBodyParam() {
      console.log(this.paramType);
      if (this.bodyParams && JSON.stringify(this.bodyParams) !== '{}') {
        this.bodyType = this.bodyParams.bodyType;
        this.elementType = this.bodyParams.elementType;
        if (!this.bodyParams.types) {
          return;
        }
        if (this.bodyParams.types.body) {
          this.bodyParams.types.body.forEach((ele) => {
            if (!ele.defaultValue) {
              ele.defaultValue = '';
            }
            if (!ele.comment) {
              ele.comment = '';
            }
          });
          this.bodyTable =
          JSON.parse(JSON.stringify([...this.bodyParams.types.body, ...this.bodyTable]));
        }
        const fieldNames = Object.keys(this.bodyParams.types);
        if (fieldNames.length > 0) {
          const fieldTable = [{
            id: -1,
          }];
          fieldNames.forEach((item) => {
            if (item === 'body') {
              return;
            }
            this.bodyParams.types[item].forEach((ele) => {
              if (!ele.defaultValue) {
                ele.defaultValue = '';
              }
              if (!ele.comment) {
                ele.comment = '';
              }
            });
            this.fieldParams.push({
              typeName: item,
              fieldTable:
              JSON.parse(JSON.stringify([...this.bodyParams.types[item], ...fieldTable])),
            });
          });
        }
      } else {
        Object.assign(this.$data, this.$options.data.call(this));
      }
      this.handleInitFieldTypes();
    },
    handleSaveBodyConfig() {
      const types = {};
      const bodyTable = JSON.parse(JSON.stringify(this.bodyTable));
      bodyTable.pop();
      const paramTypeTip = this.$t(`api_adapter.outer_api.popup.${this.paramType}_param`);
      if (bodyTable.length > 0) {
        if (this.bodyType === '') {
          this.$message.error(`${paramTypeTip}${this.$t('api_adapter.outer_api.api_body_type_empty')}`);
          return false;
        } else if (this.bodyType === 'jsonArray' && (!this.elementType || this.elementType === '')) {
          this.$message.error(`${paramTypeTip}${this.$t('api_adapter.outer_api.api_element_type_empty')}`);
          return false;
        }
      }
      types.body = bodyTable;
      if (this.fieldParams.findIndex(item => item.typeName.trim() === '') > -1) {
        this.$message.error(`${paramTypeTip}${this.$t('api_adapter.outer_api.api_element_type_name_empty')}`);
        return false;
      }
      let emptyFlag = false;
      if (bodyTable.findIndex(ele => ele.paramName.trim() === '' || ele.type === '') > -1) {
        emptyFlag = true;
      }
      const bodyTableArr = bodyTable.map(ele => ele.paramName);
      if ([...new Set(bodyTableArr)].length < bodyTableArr.length) {
        this.$message.error(`${paramTypeTip}${this.$t('api_adapter.outer_api.api_param_name_duplicate')}`);
        return false;
      }
      const typeNameArr = this.fieldParams.map(item => item.typeName);
      if ([...new Set(typeNameArr)].length < typeNameArr.length) {
        this.$message.error(this.$t('api_adapter.outer_api.api_element_type_name_duplicate'));
        return false;
      }
      let fieldParamDuplicate = false;
      this.fieldParams.forEach((item) => {
        const fieldTable = JSON.parse(JSON.stringify(item.fieldTable));
        const fieldTableArr = fieldTable.map(ele => ele.paramName);
        if ([...new Set(fieldTableArr)].length < fieldTableArr.length) {
          fieldParamDuplicate = true;
          return;
        }
        fieldTable.pop();
        if (fieldTable.findIndex(ele => ele.paramName.trim() === '' || ele.type === '') > -1) {
          emptyFlag = true;
          return;
        }
        types[item.typeName] = fieldTable;
      });
      if (emptyFlag) {
        this.$message.error(`${this.$t('api_adapter.outer_api.prefix_empty')}${paramTypeTip}${this.$t('api_adapter.outer_api.api_type_element_empty')}`);
        return false;
      }
      if (fieldParamDuplicate) {
        this.$message.error(`${paramTypeTip}${this.$t('api_adapter.outer_api.api_param_name_duplicate')}`);
        return false;
      }
      const bodyParam = {
        bodyType: this.bodyType,
        elementType: this.elementType,
        types,
      };
      console.log(bodyParam);
      return bodyParam;
    },
  },
  created() {
    this.handleInitBodyParam();
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
.public-body-wrapper {
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
        .el-button {
          min-width: 20px;
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

