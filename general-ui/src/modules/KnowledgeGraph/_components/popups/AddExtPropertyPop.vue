<template>
  <div class="user-info-form normal">
    <div class="row">
      <div class="row-title">*{{ $t('knowledge_graph.property_edit.basic_info') }}</div>
    </div>
    <div class="row">
      <div class="row-title">{{ $t('knowledge_graph.property_edit.property_name') }}</div>
      <div class="row-input">
        <template v-if="!isEditMode">
          <el-select
            class="width-auto"
            v-model="propertyId"
            filterable
            reserve-keyword
            :loading="propertyLoading"
          >
            <el-option
              v-for="item in commonPropertyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template v-else>
          <span>{{ propertyName }}</span>
        </template>
      </div>
    </div>
    <div class="row">
      <div>
        <text-button
          button-type="primary"
          @click="addConfig"
        >+{{ $t('knowledge_graph.property_edit.add_extra_btn') }}</text-button>
      </div>
    </div>
    <div class="config-list">
      <div class="config-item" v-for="(config, index) in configList" :key="index">
        <div class="content">
          <div class="config">
            <div class="row">
              <div class="row-title">{{ $t('knowledge_graph.property_edit.add_entity') }}</div>
              <div class="row-input">
                <el-select
                  class="width-auto"
                  v-model="config.entity"
                  filterable
                  reserve-keyword
                  multiple
                  :loading="entityLoading"
                  remote
                  @change="onEntitySelectChange($event, index)"
                >
                  <el-option
                    v-for="item in commonEntityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="row-title">{{ $t('knowledge_graph.property_edit.param_type') }}</div>
              <div class="row-input">
                <!-- <dropdown-select
                  class="selector"
                  :options="categories"
                  v-model="config.type"
                  :placeholder="$t('general.please_choose')"
                />-->
                <el-select
                  v-model="config.type"
                  reserve-keyword
                  :placeholder="$t('general.please_choose')"
                  size="mini"
                  @change="onCategorySelectChange(config, index)"
                >
                  <el-option
                    v-for="item in categories"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="row-title">{{ $t('knowledge_graph.property_edit.speech') }}</div>
              <div class="row-input">
                <!-- <input class="row-input" v-model="config.speech" /> -->
                <em-answer-editor
                  :ref="`emAnswerEditor-${index}`"
                  class="kg-style"
                  :materialList='fileData'
                  :treeList='treeList'
                  :total='total'
                  :curData='config.speech'
                  :active='getActiveTabTypeBySubCategory(config.speechType)'
                  @addMaterial='handleAddMaterial'
                  @changePage='handleMaterialChangePage'
                  @nodeSelect='handleNodeSelect'
                  @uploadFile='handleUploadMaterial'
              ></em-answer-editor>
              </div>
            </div>
            <div class="row" v-if="(config.type[0] === '3' || config.type[0] === '8')">
              <div class="row-title">{{ $t('knowledge_graph.property_edit.unit') }}</div>
              <div class="row-input">
                <input class="row-input" v-model="config.unit" />
              </div>
            </div>
            <template v-if="config.type[0] === '9'">
              <div class="row">
                <div class="row-title">{{ $t('knowledge_graph.data_manage.interface_address') }}</div>
                <div class="row-input">
                  <input class="row-input" v-model="config.slotInfo.url" />
                </div>
              </div>
              <div>
                <div class="row">
                  <div class="row-title">{{ $t('knowledge_graph.data_manage.interface_param') }}</div>
                  <text-button
                    button-type="primary"
                    style='margin-left:10px;'
                    @click="addSlotInfo(config, index)"
                  >{{ $t('knowledge_graph.property_edit.add_parameter') }}</text-button>
                </div>
                <div class="row" v-for="(item, idx) in config.slotInfo.slotList" :key="item.id">
                  <div class="row-title"></div>
                  <div class="row-title">{{ $t('knowledge_graph.property_edit.param_name') }}</div>
                  <div class="row-input">
                    <input class="row-input" v-model="item.slotName" />
                  </div>
                  <div class="row-title">{{ $t('knowledge_graph.property_edit.param_type') }}</div>
                  <div class="row-input">
                    <!-- <dropdown-selector
                      class="param_selector"
                      :options="paramSelection"
                      v-model="item.slotType"
                    ></dropdown-selector> -->
                <el-select
                  v-model="item.slotType"
                  reserve-keyword
                  :placeholder="$t('general.please_choose')"
                  size="mini"
                >
                  <el-option
                    v-for="item in paramSelection"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                  </div>
                  <text-button
                    class="row-subtitle"
                    button-type="error"
                    @click="deleteSlotInfo(config, index, config.slotInfo.slotList, idx)"
                  >{{ $t('general.delete') }}</text-button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="delete">
          <icon iconType="delete_task" @click="removeConfig(index)" :size="24"></icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Tools from '../../../../utils/js/Tools';
import api from '../../_api/knowledgeGraph';
import mixInMultiEditor from '../../_mixin/multiEditor';
import MixinValidate from '../../_mixin/Validate';
import i18nData from '../../i18n.json';


export default {
  name: 'AddExtPropertyPop',
  i18n: i18nData,
  api,
  mixins: [mixInMultiEditor, MixinValidate],
  data() {
    return {
      commonEntityList: [],
      propertyLoading: false,
      entityLoading: false,
      propertyId: '',
      categories: [],
      propertyName: '',
      configList: [],
      paramSelection: [],
      commonPropertyList: [], // 可添加附加属性的属性列表
      CATEGORY_TYPE: [
        { value: '1', text: '实体', ENTITY: '1' },
        { value: '3', text: '数值', NUMBER: '3' },
        { value: '2', text: '文本', TEXT: '2' },
        { value: '5', text: '关键字', KEYWORD: '5' },
        { value: '7', text: '日期', DATA: '7' },
        { value: '8', text: '范围值', RANGE: '8' },
        { value: '9', text: '接口', INTERFACE: '9' },
      ],
    };
  },

  props: {
    extData: {
    },
  },

  components: {
  },

  methods: {
    // 参数接口参数的列表item
    deleteSlotInfo(config, index, slotListData, idx) {
      slotListData.splice(idx, 1);
      this.configList.splice(index, 1, config);
      console.log('deleteSlotInfo', JSON.stringify(config, null, 2), JSON.stringify(slotListData, null, 2));
    },
    // 修改config的type值
    onCategorySelectChange(outerData, outerIndex) {
      console.log('onCategorySelectChange', JSON.stringify(outerData, null, 2), outerIndex);
      this.configList.splice(outerIndex, 1, outerData);
    },
    // 根据实体id获取实体名称
    getEntityName(entityId) {
      return this.commonEntityList.find(item => item.value === `${entityId}`).label || '';
    },
    // 实体添加select 改变值
    onEntitySelectChange($event = []) {
      const temp = ($event || [])
        .filter(item => (this.hadSelectEntity || []).filter(item2 => item2 === item).length >= 2);
      temp.map((item) => {
        this.$notifyFail(this.$t('i18n.notify.repeat_entity_name_2', { name: this.getEntityName(item) }));
        return item;
      });
    },
    // 根据输入搜索db的可用实体
    getAvailableEntitiesBykeyword(query) {
      if (query !== '') {
        this.entityLoading = true;
        const param = {
          keyword: query,
        };
        this.$api.getAllEntitiesByRobotId(this.robotID, param).then((res) => {
          this.commonEntityList = res.data.entities.map(d => ({
            value: d.id,
            label: d.name,
          }));
          this.entityLoading = false;
        });
      } else {
        this.$api.getAllEntitiesByRobotId(this.robotID, {}).then((res) => {
          this.commonEntityList = res.data.entities.map(d => ({
            value: d.id,
            label: d.name,
          }));
          this.entityLoading = false;
        });
      }
    },

    addSlotInfo(config, index) {
      if (!(config.slotInfo || {}).slotList) {
        (config.slotInfo || {}).slotList = [];
      }
      ((config.slotInfo || {}).slotList || []).push({
        slotName: '',
        slotType: [''],
        id: Tools.uuid(),
      });
      this.configList.splice(index, 1, config);
    },

    getAvailablePropertiesBykeyword(query) {
      if (query !== '') {
        this.propertyLoading = true;
        const param = {
          keyword: query,
        };
        this.$api.getAvailableExtraProperties(this.robotID, param).then((res) => {
          this.commonPropertyList = res.data.data.result.map(d => ({
            value: d.id,
            label: d.name,
          }));
          this.propertyLoading = false;
        });
      } else {
        this.$api.getAvailableExtraProperties(this.robotID, {}).then((res) => {
          this.commonPropertyList = res.data.data.result.map(d => ({
            value: d.id,
            label: d.name,
          }));
          this.propertyLoading = false;
        });
      }
    },

    removeConfig(index) {
      this.configList.splice(index, 1);
    },

    addConfig() {
      this.configList.push({
        entity: [],
        type: [],
        unit: '',
        speech: '',
        slotInfo: {
          url: '',
          slotList: [],
        },
      });
    },
    // 表单验证
    onFormValidCheck() {
      let isValid = true;
      let errMsg = '';
      if (!this.propertyId) {
        errMsg = this.$t('i18n.notify.property_name_empty');
        isValid = false;
      }
      // 添加实体是否重复数据检查
      const keyList = [];
      const keyObj = {};
      (this.configList || []).map((item, index) => {
        if (item.entity && item.entity.length === 0 && isValid) {
          errMsg = this.$t('i18n.notify.entity_empty', { one: index + 1 });
          isValid = false;
        }
        if (!item.type && isValid) {
          errMsg = this.$t('i18n.notify.param_type_empty', { one: index + 1 });
          isValid = false;
        }
        // 接口类型 单独处理
        if (item.type === '9' && item.slotInfo) {
          if (!item.slotInfo.url && isValid) {
            errMsg = this.$t('i18n.notify.url_empty', { one: index + 1 });
            isValid = false;
          }
          if (item.slotInfo.slotList && item.slotInfo.slotList.length > 0) {
            item.slotInfo.slotList.map((slot, slotIndex) => {
              if ((!slot.slotName || !slot.slotType) && isValid) {
                errMsg = this.$t('i18n.notify.interface_param_empty', { one: index + 1, two: slotIndex + 1 });
                isValid = false;
              }
              return slot;
            });
          }
        }
        item.entity.map((item2) => {
          if (!keyList.includes(item2)) {
            keyList.push(item2);
            keyObj[item2.toString()] = { item2, index };
          } else if (isValid) {
            errMsg = this.$t('i18n.notify.repeat_entity_name', { one: keyObj[item2.toString()].index + 1, two: index + 1, name: this.getEntityName(item2) });
            isValid = false;
          }
          return item2;
        });
        return item;
      });
      if (!isValid) {
        this.$message({
          message: errMsg,
          type: 'error',
        });
      }
      return isValid;
    },
    validate() {
      const isValid = this.onFormValidCheck();
      if (!isValid) {
        console.log('validate', JSON.stringify(this.configList, null, 2));
        return;
      }
      const extraProperties = [];
      this.configList.forEach((config, index) => {
        const editorEl = ((this.$refs[`emAnswerEditor-${index}`] || [])[0] || {});
        const multiData = editorEl.handleGetAnswer();
        (config.entity || []).forEach((e) => {
          extraProperties.push({
            entityId: e,
            category: config.type[0],
            unit: config.unit,
            speech: multiData,
            speechType: this.getSubCategoryByActiveTabType(editorEl.activeTab),
            extra_content: config.slotInfo || {},
          });
        });
      });

      const response = {
        propertyId: this.propertyId,
        extraProperties,
      };

      this.$emit('validateSuccess', response);
    },
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),
    isEditMode() {
      return this.extData.editMode;
    },
    hadSelectEntity() {
      const temp = this.configList.reduce((pre, cur) => [...pre, ...cur.entity], []);
      console.log('hadSelectEntity:temp:', temp);
      return temp;
    },
  },

  beforeMount() {
    const slotTypeApi = new Promise((resolve) => {
      this.$api.getSlotTypes().then((res) => {
        this.paramSelection = res.data.type.map(r => ({
          value: r.id,
          text: r.name,
        })).filter(item => item.text === 'entity' || item.text === 'float');
        resolve();
      });
    });

    const propListApi = new Promise((resolve) => {
      this.$api.getAvailableExtraProperties(this.robotID, { limit: 100000 }).then((res) => {
        this.commonPropertyList = res.data.data.result.map(d => ({
          value: d.id,
          label: d.name,
        }));
        resolve();
      });
    });

    const entityList = new Promise((resolve) => {
      const param = {
        limit: 100000,
      };
      this.$api.getAllEntitiesByRobotId(this.robotID, param).then((res) => {
        this.commonEntityList = res.data.entities.map(d => ({
          value: d.id,
          label: d.name,
        }));
        resolve();
      });
    });

    Promise.all([slotTypeApi, propListApi, entityList]).then(() => {
      if (!this.isEditMode) {
        this.addConfig();
      } else {
        this.propertyId = this.extData.property.propertyId;
        this.propertyName = this.extData.property.propertyName;
        this.configList = JSON.parse(JSON.stringify(this.extData.property.configList));
      }
      if (this.extData.property.categorySet && this.extData.property.categorySet.length > 0) {
        this.categories = this.extData.property.categorySet.map(c => ({
          value: c.id,
          text: c.name,
        }));
      }

      this.$on('validate', this.validate);
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';
::v-deep .el-input__inner {
  width: 100%;
}
.width-auto {
  width: 100%;
}

.user-info-form {
  color: #666666;
  padding: 0 25px;
  width: 60vw;
  @include font-14px();
  display: flex;
  flex-direction: column;
  .config-list {
    display: flex;
    flex-direction: column;
    .config-item {
      background: rgba(247, 247, 247, 1);
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
      .content {
        width: 95%;
        display: flex;
        flex-direction: column;
      }
      .delete {
        padding: 10px 10px 0px 0px;
        width: 5%;
      }
    }
  }

  .row {
    margin: 5px 0px;
    flex: 0 0 40px;
    /*max-height: 40px;*/
    flex-wrap: wrap;

    display: flex;
    align-items: center;

    &.dark {
      background: rgba(247, 247, 247, 1);
    }

    .row-subtitle {
      margin: 0px 10px;
      display: flex;
      align-items: center;
    }

    .btn_column {
      flex: 1;
      padding: 3px 8px;
      .row_test_area {
        padding: 10px 0px;
      }
    }

    .column_display {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .row_display {
      width: 100%;
      display: flex;
      flex-direction: row;
    }

    .row-title {
      padding-right: 10px;
      flex: 0 0 110px;
      max-width: 110px;
      font-size: 14px;
      font-family: PingFangHK-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      text-align: right;
      .required {
        display: inline-block;
        width: 14px;
        color: $color-primary;
      }
    }
    .row-input {
      width: 100%;
      max-width: 90%;
      flex: 1;
      padding: 3px 8px;
      display: flex;
      flex-direction: row;
      @include font-14px();
      ::v-deep .el-select {
        width: 100%;
        input {
          width: 100%;
        }
      }
      // ::v-deep .emotibot.el-tabs .el-tabs__nav-wrap{
      //   padding-left: 0;
      // }
       ::v-deep .em-ans-editor {
        width: 100%;
        .el-textarea {
          min-width: 550px;
        }
      }
    }
    .row-text {
      margin: 0 8px 0 10px;
      width: 80%;
      // min-width: 60px;
    }

    .length-auto {
      flex: 0 1 340px;
    }
    .row-input-col {
      padding: 3px 8px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.param_selector {
  flex: 0 0 200px;
  input {
    width: 200px;
  }
}

.selector {
  flex: 1;
  input {
    width: 100%;
  }
}
</style>
