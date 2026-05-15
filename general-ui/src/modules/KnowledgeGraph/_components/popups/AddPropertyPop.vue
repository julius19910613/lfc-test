<template>
  <div class="user-info-form normal">
    <div class="row">
      <div class="row-title">*{{ $t('knowledge_graph.property_edit.basic_info') }}</div>
    </div>
    <!--    <div class="row" v-if="isCommonProperty">-->
    <!--      <div class="row-title">{{ $t('knowledge_graph.property_edit.is_hierarchy') }}</div>-->
    <!--      <div class="row-input">-->
    <!--        <input type="radio" value="unhierarchy" v-model="isHierarchyProperty">-->
    <!--        <label>{{ $t('general.no')}}</label>-->
    <!--        <input type="radio" value="hierarchy" v-model="isHierarchyProperty">-->
    <!--        <label>{{ $t('general.yes')}}</label>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="row">
      <div class="row-title">{{ $t('knowledge_graph.property_edit.property_name') }}</div>
      <div class="row-input">
        <input
          v-if="!isFunctionProperty"
          class="row-input"
          v-model="propertyName"
          @change="onInputChange('property_name', $event)"
          ref="propertyNameRef"
          :maxlength="10"
        >
        <span v-else>{{ propertyName }}</span>

<!--        <dropdown-select-->
<!--          v-if="!isCommonProperty"-->
<!--          class="selector"-->
<!--          :options="commonPropertyList"-->
<!--          v-model="selectCommonPropertyId"-->
<!--          :placeholder="$t('general.please_choose')"-->
<!--        />-->
      </div>
    </div>
    <div class="row" v-if="!isFunctionProperty">
      <div class="row-title">{{ $t('knowledge_graph.property_edit.property_type') }}</div>
      <div class="row-input">
        <dropdown-select
          class="selector"
          :options="categories"
          v-model="category"
          :placeholder="$t('general.please_choose')"
        />
      </div>
    </div>
    <div class="row" v-if="(category[0] === '3' || category[0] === '8') && !isFunctionProperty">
      <div class="row-title">{{ $t('knowledge_graph.property_edit.unit') }}</div>
      <div class="row-input">
        <input
          class="row-input"
          v-model="propertyUnit"
          :maxlength="10"
          >
      </div>
    </div>
    <template v-if="category[0] === '9' && !isFunctionProperty">
      <div class="row">
        <div class="row-title">{{ $t('knowledge_graph.data_manage.interface_address') }}</div>
        <div class="row-input">
          <input class="row-input" v-model="slotInfo.url">
        </div>
      </div>
      <div>
        <div class="row">
          <div class="row-title">{{ $t('knowledge_graph.data_manage.interface_param') }}</div>
          <text-button
            button-type="primary"
            @click.stop="addSlotInfo"
          >{{ $t('knowledge_graph.property_edit.add_parameter') }}</text-button>
        </div>
        <div class="row" v-for="(item, idx) in slotInfo.slotList" :key="item.id">
          <div class="row-title"></div>
          <div class="row-title">{{ $t('knowledge_graph.property_edit.param_name') }}</div>
          <div class="row-input">
            <input class="row-input" v-model="item.slotName">
          </div>
          <div class="row-title">{{ $t('knowledge_graph.property_edit.param_type') }}</div>
          <div class="row-input">
            <dropdown-selector
              class="param_selector"
              :options="paramSelection"
              v-model="item.slotType"
            ></dropdown-selector>
          </div>
          <text-button
            class="row-subtitle"
            button-type="error"
            @click.stop="deleteSlotInfo(idx)"
          >{{ $t('general.delete') }}</text-button>
        </div>
      </div>
    </template>

<!--    <div class="row" v-if="!isCommonProperty">-->
<!--      <div class="row-title">{{ $t('knowledge_graph.property_edit.entity') }}</div>-->
<!--      <div class="row-input">-->
<!--        <dropdown-select-->
<!--          class="selector"-->
<!--          :options="entityList"-->
<!--          v-model="entitySelect"-->
<!--          :placeholder="$t('general.please_choose')"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
    <div class="row">
      <div class="row-title">{{ $t('knowledge_graph.entity_edit.synonyms') }}</div>
      <div class="row-input-col">
        <tags-input v-model="synonymSet"
         :maxTagCount='20' :content_max_length='50'/>
      </div>
    </div>
    <div class="row" v-if="!isFunctionProperty">
      <div class="row-title">{{ $t('knowledge_graph.property_edit.speech') }}</div>
      <div class="row-input">
        <!-- <input class="row-input" v-model="singleSpeech"> -->
        <em-answer-editor
              ref='emAnswerEditorForSpeech'
              class="kg-style"
              :materialList='fileData'
              :treeList='treeList'
              :total='total'
              :curData='singleSpeech'
              :active='activeTabForSpeech'
              @addMaterial='handleAddMaterial'
              @changePage='handleMaterialChangePage'
              @nodeSelect='handleNodeSelect'
              @uploadFile='handleUploadMaterial'
            ></em-answer-editor>
      </div>
    </div>
    <div class="row" v-if="!isFunctionProperty">
      <div class="row-title">{{ $t('knowledge_graph.entity_edit.introduction') }}</div>
      <div class="btn_column btn_select">
        <div
            class="btn first"
            :disable='relatedPropertyFlag'
            :class="!relatedIntroFlag ? 'btn-primary' : 'btn-disabled'"
            @click.stop="addIntroductionSetting('content')"
          >+{{ $t('knowledge_graph.entity_edit.intro_content') }}</div>
        <!-- <text-button
          :button-type="!this.relatedIntroFlag ? 'primary' : 'disable'"
          @click.stop="addIntroductionSetting('content')"
        >+{{ $t('knowledge_graph.entity_edit.intro_content') }}</text-button> -->
        <div
          class="btn"
          v-if="extData.editMode"
          :disable='relatedValueFlag || relatedEntityFlag'
          :class="!(relatedValueFlag || relatedEntityFlag) ? 'btn-primary' : 'btn-disabled'"
          @click.stop="addIntroductionSetting('entity')"
        >+{{ $t('knowledge_graph.entity_edit.entity_related') }}</div>
        <div
          class="btn"
          v-if="extData.editMode"
          :disable='relatedValueFlag || relatedEntityFlag'
          :class="!(relatedValueFlag || relatedEntityFlag) ? 'btn-primary' : 'btn-disabled'"
          @click.stop="addIntroductionSetting('value')"
        >+{{ $t('knowledge_graph.entity_edit.intro_value') }}</div>
      </div>
    </div>
    <div class="row dark" v-if="relatedIntroFlag">
      <div class="row-title m-l-10">{{ $t('knowledge_graph.entity_edit.intro_content') }}</div>
      <div class="btn_column">
        <div class="row_test_area">
          <!-- <textarea style="width: 100%" v-model="introContent"></textarea> -->
          <em-answer-editor
              ref='emAnswerEditor'
              class="kg-style"
              :materialList='fileData'
              :treeList='treeList'
              :total='total'
              :curData='introContent'
              :active='activeTab'
              @addMaterial='handleAddMaterial'
              @changePage='handleMaterialChangePage'
              @nodeSelect='handleNodeSelect'
              @uploadFile='handleUploadMaterial'
            ></em-answer-editor>
        </div>
      </div>
      <div class="delete_operation">
        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('content')" :size="24"></icon>
      </div>
    </div>
    <!-- <div class="row dark" v-if="relatedEntityFlag && isCommonProperty">
      <div class="row-title">{{ $t('knowledge_graph.entity_edit.entity_related') }}</div>
      <div class="btn_column">
        <div class="row_test_area">
          <dropdown-select
            class="selector"
            :options="entityOptions"
            v-model="entityOption"
            multi
            :placeholder="$t('general.please_choose')"
          />
        </div>
      </div>
      <div class="delete_operation" v-if="isCommonProperty">
        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('entity')" :size="24"></icon>
      </div>
    </div>-->
    <div class="row dark" v-if="relatedEntityFlag">
      <div class="row-title m-l-10">{{ $t('knowledge_graph.entity_edit.entity_related') }}</div>
      <div class="btn_column">
        <div class="row_test_area">
          <el-select
            v-model="entityOption"
            multiple
            filterable
            remote
            reserve-keyword
            :placeholder="$t('knowledge_graph.placeholder.entity_search')"
            :loading="loadingForGetEntity"
            @change="handlePropValueChange(entityOption, 'entity')"
            size="mini"
          >
            <el-option
              v-for="item in entityOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="delete_operation">
        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('entity')" :size="24"></icon>
      </div>
    </div>
    <!--    <div class="row dark" v-if="relatedPropertyFlag && isCommonProperty">-->
    <!--      <div class="row-title">{{ $t('knowledge_graph.entity_edit.intro_related') }}</div>-->
    <!--      <div class="btn_column">-->
    <!--        <div class="row_test_area">-->
    <!--          <dropdown-select-->
    <!--            class="selector"-->
    <!--            :options="propertyOptions"-->
    <!--            v-model="propOption"-->
    <!--            multi-->
    <!--            :placeholder="$t('general.please_choose')"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="delete_operation">-->
    <!--        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('property')" :size="24"></icon>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- <div class="row dark" v-if="relatedValueFlag && isCommonProperty">
      <div class="row-title">{{ $t('knowledge_graph.entity_edit.intro_value') }}</div>
      <div class="btn_column">
        <div class="row_test_area">
          <dropdown-select
            class="selector"
            :options="valueOptions"
            v-model="valueOption"
            multi
            :placeholder="$t('general.please_choose')"
          />
        </div>
      </div>
      <div class="delete_operation">
        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('value')" :size="24"></icon>
      </div>
    </div>-->
    <div class="row dark" v-if="relatedValueFlag">
      <div class="row-title m-l-10">{{ $t('knowledge_graph.entity_edit.intro_value') }}</div>
      <div class="btn_column">
        <div class="row_test_area">
          <el-select
            v-model="valueOption"
            multiple
            filterable
            remote
            reserve-keyword
            :placeholder="$t('knowledge_graph.placeholder.value_search')"
            :loading="loadingForGetValue"
            @change="handlePropValueChange(valueOption, 'val')"
            size="mini"
          >
            <el-option
              v-for="item in valueOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="delete_operation">
        <icon iconType="delete_task" @click.stop="removeIntroductionSetting('value')" :size="24"></icon>
      </div>
    </div>
    <div class="row">
      <div class="row-title">*{{ $t('knowledge_graph.property_edit.corpus') }}</div>
    </div>
    <div class="row" style="margin-left:20px">
      <input @keyup.enter="addCorpus" class="row-input" v-model="newCorpus">
      <div class="column_display">
        <div class="row_display" v-for="(cropus, idx) in corpusSet" :key="idx">
          <el-tooltip
            placement="top"
            :open-delay="666" :disabled="!(corpusSet[idx] && corpusSet[idx].length > 50)" :content="corpusSet[idx]">
             <div class="row-text">{{ corpusSet[idx] }}</div>
          </el-tooltip>
          <div class="delete-text" @click.stop="removeCorpus(idx)">{{ $t('general.delete') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import DropdownSelector from '@/components/DropdownSelect';
import Tools from '../../../../utils/js/Tools';
import TagsInput from '../TagsInput';
import api from '../../_api/knowledgeGraph';
import misc from '../../../../utils/js/misc';
import mixInMultiEditor from '../../_mixin/multiEditor';
import MixinValidate from '../../_mixin/Validate';

export default {
  props: {
    extData: {
    },
  },
  mixins: [mixInMultiEditor, MixinValidate],
  components: {
    DropdownSelector,
    TagsInput,
  },

  api,
  data() {
    return {
      newCorpus: '',
      propertyIntroduction: {},
      newSynonym: '',
      category: [],
      singleSpeech: '',
      categories: [],
      inputVisible: false,
      isHierarchyProperty: false,
      propertyId: '',
      propertyName: '',
      synonymSet: [],
      corpusSet: [],
      propertyUnit: '',
      introContent: '',
      propertyOptions: [],
      entityOptions: [],
      valueOptions: [],
      propOption: [],
      entityOption: [],
      valueOption: [],
      introductionEditMode: false,
      relatedIntroFlag: false,
      relatedEntityFlag: false,
      relatedPropertyFlag: false,
      relatedValueFlag: false,
      paramSelection: [],
      slotInfo: { // 属性类型为接口时，接口参数及接口参数
        url: '',
        slotList: [],
      },
      INTRODUCTION: {
        INTRODUCTION: 'INTRODUCTION',
        MULTI_ENTITY: 'MULTI_ENTITY',
        MULTI_PROPERTY: 'MULTI_PROPERTY',
        MULTI_VALUE: 'MULTI_VALUE',
      },
      propertyType: '', // 当前弹窗类型
      PROPERTY_TYPE: { COMMON: 'common', EXTRA: 'special' }, // 当前弹窗类型常量 普通/补充属性添加弹窗
      entityList: [], // 应用实体option
      entitySelect: [], // 应用实体选择项
      commonPropertyList: [], // 通用属性list
      selectCommonPropertyId: [], // 新增补充属性时，选择要补充属性对应的通用属性id
      isCheckingRepeatName: false, // 是否在check重名
      isPropertyNameRepeat: false, // 属性名是否重名
      loadingForGetEntity: false, // 是否加载相关实体中
      loadingForGetValue: false, // 是否加载相关值中
      activeTabForSpeech: 'text', // 话术的编辑器Tab
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    // isCommonProperty() {
    //   return this.propertyType === this.PROPERTY_TYPE.COMMON;
    // },
    isFunctionProperty() {
      return !this.extData.property.isCommonProperty;
    },
    isContent() {
      return this.propertyIntroduction.content !== undefined;
    },

    isValue() {
      return this.propertyIntroduction.value !== undefined;
    },

    isProperty() {
      return this.propertyIntroduction.property !== undefined;
    },
  },
  watch: {
    category() {
      if (this.category
        && this.category[0]
        && this.category[0] !== '3'
        && this.category[0] !== '8') {
        this.propertyUnit = '';
      }
    },
    propertyType(val) {
      console.log(JSON.stringify(val, null, 2));
    },
  },
  methods: {
    handlePropValueChange(values, type) {
      console.log('handlePropValueChange:values:', values);
      console.log('handlePropValueChange:type:', type);
      if (values && values.length === 1 && values[0] === '0') {
        // 只有一个选项且选项为0时，将所有属性的disable情况改成true
        if (type === 'prop') {
          this.propertyOptions.forEach((item) => {
            if (item.value !== '0') {
              item.disabled = true;
            }
          });
        } else if (type === 'entity') {
          this.entityOptions.forEach((item) => {
            if (item.value !== '0') {
              item.disabled = true;
            }
          });
        } else if (type === 'val') {
          this.valueOptions.forEach((item) => {
            if (item.value !== '0') {
              item.disabled = true;
            }
          });
        }
      } else if (values && values.length > 1) {
        if (values.indexOf('0') > -1) {
          if (type === 'prop') {
            this.propertyOptions.forEach((item) => {
              if (item.value !== '0') {
                item.disabled = true;
              }
            });
            this.propOption = ['0'];
          } else if (type === 'entity') {
            this.entityOptions.forEach((item) => {
              if (item.value !== '0') {
                item.disabled = true;
              }
            });
            this.entityOption = ['0'];
          } else if (type === 'val') {
            this.valueOptions.forEach((item) => {
              if (item.value !== '0') {
                item.disabled = true;
              }
            });
            this.valueOption = ['0'];
          }
        } else if (type === 'prop') {
          this.propertyOptions.forEach((item) => {
            item.disabled = false;
          });
        } else if (type === 'entity') {
          this.entityOptions.forEach((item) => {
            item.disabled = false;
          });
        } else if (type === 'val') {
          this.valueOptions.forEach((item) => {
            item.disabled = false;
          });
        }
      } else if (values !== null && values !== undefined && values.length === 0) {
        if (type === 'prop') {
          this.propertyOptions.forEach((item) => {
            item.disabled = false;
          });
        } else if (type === 'entity') {
          this.entityOptions.forEach((item) => {
            item.disabled = false;
          });
        } else if (type === 'val') {
          this.valueOptions.forEach((item) => {
            item.disabled = false;
          });
        }
      }
      // else if (type === 'prop') {
      //   this.propertyOptions.forEach((item) => {
      //     item.disabled = false;
      //   });
      // } else if (type === 'entity') {
      //   this.entityOptions.forEach((item) => {
      //     item.disabled = false;
      //   });
      // } else if (type === 'val') {
      //   this.valueOptions.forEach((item) => {
      //     item.disabled = false;
      //   });
      // }
    },

    checkDuplicatedParamName() {
      if (this.slotInfo.slotList && this.slotInfo.slotList.length === 0) {
        return true;
      }

      const originList = this.slotInfo.slotList.map(item => item.slotName);
      const checkSet = new Set(originList);

      const originTypeList = this.slotInfo.slotList.map(item => item.slotType[0]);
      const checkTypeSet = new Set(originTypeList);

      return (originList.length === [...checkSet].length)
        && (originTypeList.length === [...checkTypeSet].length);
    },

    addSlotInfo() {
      this.slotInfo.slotList.push({
        slotName: '',
        slotType: [''],
        id: Tools.uuid(),
      });
    },

    deleteSlotInfo(idx) {
      this.slotInfo.slotList.splice(idx, 1);
    },
    // 处理简介内容, 生产简介内容的JSON字符串
    generateIntroductionStr() {
      let result = [];
      let isEmptyIntroduction = true;
      if (this.relatedIntroFlag) {
        const editorEl = (this.$refs.emAnswerEditor || {});
        const introContentMulti = editorEl.handleGetAnswer();
        isEmptyIntroduction = isEmptyIntroduction && !introContentMulti;
        result.push({
          type: this.INTRODUCTION.INTRODUCTION,
          entity: [],
          property: [],
          value: introContentMulti,
          subCategory: this.getSubCategoryByActiveTabType(editorEl.activeTab),
        });
      }

      if (this.relatedPropertyFlag && this.propOption.length > 0) {
        let finalPropOption = [];
        finalPropOption = JSON.parse(JSON.stringify(this.propOption));
        if (this.propOption && this.propOption.length === 1 && this.propOption[0] === '0') {
          finalPropOption = [];
        }
        isEmptyIntroduction = isEmptyIntroduction && !finalPropOption.length;
        result.push({
          type: this.INTRODUCTION.MULTI_PROPERTY,
          entity: [],
          property: finalPropOption,
          value: '',
        });
      }

      if (this.relatedEntityFlag && this.entityOption.length > 0) {
        let finalEntityOption = [];
        finalEntityOption = JSON.parse(JSON.stringify(this.entityOption));
        if (this.entityOption && this.entityOption.length === 1 && this.entityOption[0] === '0') {
          finalEntityOption = [];
        }
        isEmptyIntroduction = isEmptyIntroduction && !finalEntityOption.length;
        result.push({
          type: this.INTRODUCTION.MULTI_ENTITY,
          entity: finalEntityOption,
          property: [],
          value: '',
        });
      }

      if (this.relatedValueFlag && this.valueOption.length > 0) {
        let finalValueOption = [];
        finalValueOption = JSON.parse(JSON.stringify(this.valueOption));
        if (this.valueOption && this.valueOption.length === 1 && this.valueOption[0] === '0') {
          finalValueOption = [];
        }
        isEmptyIntroduction = isEmptyIntroduction && !finalValueOption.length;
        result.push({
          type: this.INTRODUCTION.MULTI_VALUE,
          entity: [],
          property: finalValueOption,
          value: '',
        });
      }
      console.log('generateIntroductionStr：result', JSON.stringify(result, null, 2));
      result = JSON.stringify(result).toString();
      return { result, isEmptyIntroduction };
    },
    restructureIntroduction(introStr) {
      if (misc.isJsonString(introStr)) {
        const introObj = JSON.parse(introStr);
        introObj.forEach((item) => {
          if (item.type === this.INTRODUCTION.INTRODUCTION
            && item.value && item.value.length > 0) {
            this.relatedIntroFlag = true;
            this.introContent = item.value;
            this.activeTab = this.getActiveTabTypeBySubCategory(item.subCategory);
          } else if (item.type === this.INTRODUCTION.MULTI_ENTITY
            && item.entity) {
            if (item.entity.length > 0) {
              this.entityOption = item.entity;
              if (this.entityOption.length > 0) {
                this.relatedEntityFlag = true;
                this.entityOption = this.entityOption.map(i => i.toString());
              }
            } else if (item.entity.length === 0) {
              this.relatedEntityFlag = true;
              // this.entityOption = this.entityOptions.map(i => i.id.toString());
              this.entityOption = ['0'];
            }
          } else if (item.type === this.INTRODUCTION.MULTI_PROPERTY
            && item.property) {
            // console.log(this.propertyOptions);
            // console.log(item.property.map(i => this.propertyOptions
            //   .filter(prop => prop.value === i.toString())));
            if (item.property.length > 0) {
              this.propOption = item.property;
              console.log(this.propOption);
              if (this.propOption.length > 0) {
                this.relatedPropertyFlag = true;
                this.propOption = this.propOption.map(i => i.toString());
              }
            } else if (item.property.length === 0) {
              this.relatedPropertyFlag = true;
              // this.propOption = this.propertyOptions.map(i => i.id.toString());
              this.propOption = ['0'];
            }
          } else if (item.type === this.INTRODUCTION.MULTI_VALUE
            && item.entity) {
            if (item.entity.length > 0) {
              console.log(item.property);
              console.log(this.valueOptions);
              this.valueOption = item.entity;
              if (this.valueOption.length > 0) {
                this.relatedValueFlag = true;
                this.valueOption = this.valueOption.map(i => i.toString());
                // this.valueOption = ['0'];
              }
            } else if (this.valueOption.length === 0) {
              this.relatedValueFlag = true;
              // this.valueOption = this.valueOptions.map(i => i.id.toString());
              this.valueOption = ['0'];
            }
          }
        });
      }
    },

    removeIntroductionSetting(property) {
      switch (property) {
        case 'content':
          this.relatedIntroFlag = false;
          this.introContent = '';
          break;
        case 'property':
          this.relatedPropertyFlag = false;
          this.propOption = [];
          break;
        case 'entity':
          this.relatedEntityFlag = false;
          this.entityOption = [];
          break;
        case 'value':
          this.relatedValueFlag = false;
          this.valueOption = [];
          break;
        default:
          break;
      }
    },

    addIntroductionSetting(property) {
      switch (property) {
        case 'content':
          this.relatedIntroFlag = true;
          break;
        case 'property':
          this.relatedPropertyFlag = true;
          break;
        case 'entity':
          if (!this.relatedValueFlag) {
            this.relatedEntityFlag = true;
          }
          break;
        case 'value':
          if (!this.relatedEntityFlag) {
            this.relatedValueFlag = true;
          }
          break;
        default:
          break;
      }
    },

    addSynonym() {
      if ((this.newSynonym || '').length > 50) {
        this.$notifyFail(this.$t('knowledge_graph.data_manage.len_gt_error', { len: 50 }));
        return;
      }
      const newValue = this.newSynonym;
      newValue.replace(/[\r\n]/g, '');
      if (newValue && newValue.length > 0 && /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(newValue)) {
        this.synonymSet.push(this.newSynonym);
        this.inputVisible = false;
        this.newSynonym = '';
      } else if (newValue && newValue.length > 0) {
        this.$message({
          message: this.$t('knowledge_graph.entity_edit.value_warn_msg'),
          type: 'error',
          showClose: true,
        });
      }
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    removeSynonym(item) {
      this.synonymSet.splice(this.synonymSet.indexOf(item), 1);
    },

    addCorpus() {
      if (!(this.newCorpus || '').trim()) {
        return;
      }
      const temp = this.newCorpus.trim();
      if (!this.corpusSet.includes(temp)) {
        this.corpusSet.unshift(temp);
        this.newCorpus = '';
      } else {
        this.$notifyFail(this.$t('knowledge_graph.notify.repeat_corpus', { name: this.newCorpus }));
      }
    },

    removeCorpus(idx) {
      this.corpusSet.splice(idx, 1);
    },

    // 补充属性表单验证
    extraPropertyFormCheck() {
      if (this.propertyType === this.PROPERTY_TYPE.COMMON) {
        return true;
      }
      if (!this.selectCommonPropertyId || !this.selectCommonPropertyId[0]) {
        this.$notifyFail(this.$t('knowledge_graph.notify.property_name'));
        return false;
      }
      if (!this.category || !this.category[0]) {
        this.$notifyFail(this.$t('knowledge_graph.notify.property_type'));
        return false;
        // eslint-disable-next-line no-else-return
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.category[0] === '3' && (!this.propertyUnit || !this.propertyUnit[0])) {
          this.$notifyFail(this.$t('knowledge_graph.notify.number_unit'));
          return false;
        }
      }
      if (!this.entitySelect || !this.entitySelect[0]) {
        this.$notifyFail(this.$t('knowledge_graph.notify.entity_select'));
        return false;
      }
      if (!this.singleSpeech) {
        this.$notifyFail(this.$t('knowledge_graph.notify.chat_skill'));
        return false;
      }
      return true;
    },
    // 同义词的校验
    onSynonymSetCheck() {
      // 同义词长度不超过50个字符 + 同义词不能与属性名称一致
      let index = -1;
      const repeatResult = {};
      const valid = this.synonymSet.reduce((pre, cur, _index) => {
        const re = pre && cur && cur.length <= 50;
        if (index === -1 && !re) {
          index = _index + 1;
        }
        if (cur === this.propertyName) {
          repeatResult.index = _index + 1;
          repeatResult.name = cur;
        }
        return re;
      }, true);
      if (!valid) {
        this.$message({
          message: this.$t('knowledge_graph.data_manage.synonym_len_gt_error', { index, len: 50 }),
          type: 'error',
        });
      }
      if (repeatResult.name) {
        this.$message({
          message: this.$t('knowledge_graph.entity_edit.synonym_same_as_property_name',
            { name: repeatResult.name }),
          type: 'error',
        });
      }
      return valid && !repeatResult.name;
    },
    // 普通属性的表单验证
    commonPropertyFormCheck() {
      // 校验属性名称 小于10字符 不为空 替换空格
      const tempName = this.onFormatName((this.propertyName || '').trim());
      const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
          { text: misc.getEllipsisStr(tempName, 6), len: this.MIXIN_PROPERTY_MAX_LENGTH });
      const emptyErrMsg = this.$t('knowledge_graph.property_edit.empty_name_msg');
      const param = {
        ...this.checkPropertyNameDataBase,
        str: tempName,
        errMsg,
        isShowEmptyTip: true,
        emptyErrMsg,
      };
      if (!this.onStrLengthCheck(param)) {
        return false;
      }
      // 校验类别不为空
      if (this.category.length === 0 || this.category[0].length === 0) {
        this.$message({
          message: this.$t('knowledge_graph.property_edit.empty_category_msg'),
          type: 'error',
        });
        return false;
      }
      // 同义词不为空且不重复校验
      if (!this.onSynonymSetCheck()) {
        return false;
      }
      // slotinfolist不重复校验
      if (!this.checkDuplicatedParamName()) {
        this.$message({
          message: this.$t('knowledge_graph.property_edit.duplicated_param_msg'),
          type: 'error',
        });
        return false;
      }
      // 补充属性验证？ 似乎已经不需要了，待检查  TODO: 待检查
      if (!this.extraPropertyFormCheck()) {
        return false;
      }
      // 单位校验 可为空 替换空格 小于10位
      const tempUnit = this.onFormatName((this.propertyUnit || '').trim());
      const errUnitMsg = this.$t('knowledge_graph.property_edit.unit_length_msg',
          { text: misc.getEllipsisStr(tempUnit, 6), len: this.MIXIN_UNIT_MAX_LENGTH });
      const paramUnit = {
        ...this.checkUnitNameDataBase,
        str: tempUnit,
        errMsg: errUnitMsg,
        enableEmpty: true,
      };
      if (!this.onStrLengthCheck(paramUnit)) {
        return false;
      }
      // 属性名重复检测是否在进行中...
      if (this.isCheckingRepeatName) {
        this.$message({
          message: this.$t('knowledge_graph.notify.name_repeat_checking'),
          type: 'error',
        });
        return false;
      }
      // 属性名是否重名
      if (this.isPropertyNameRepeat) {
        this.$message({
          message: this.$t('knowledge_graph.notify.name_repeat'),
          type: 'error',
        });
        this.$refs.propertyNameRef.focus();
        return false;
      }
      return true;
    },

    // 提交编辑之后的属性
    submitPropertyEdit(editedProperty) {
      const param = {
        name: editedProperty.name,
        corpus: editedProperty.corpusSet,
        category: editedProperty.category,
        unit: editedProperty.unit,
        speech: editedProperty.speech,
        parentId: -1,
        slotInfo: editedProperty.slotInfo,
        speechType: editedProperty.speechType,
      };

      const updateApiBatch = [
        this.$api.updateProperty(this.robotID, editedProperty.id, param),
        new Promise((resolve, reject) => {
          this.$api.updateSynonyms(this.robotID, 'property', {
            id: editedProperty.id,
            synonym: editedProperty.synonymSet,
          }).then(() => {
            resolve();
          }).catch((err) => {
            console.log(err.response);
            const errFlag = err.response.data.message;
            this.$notifyWarn(this.$t(`knowledge_graph.property_edit.${errFlag}`));
            reject(err);
          });
        }),
      ];

      if (editedProperty.modifiable) {
        updateApiBatch.push(this.$api.updatePropertyIntroduction(this.robotID, {
          propertyId: editedProperty.id,
          introduction: editedProperty.introduction,
        }));
      }

      Promise.all(updateApiBatch).then(() => {
        this.$emit('validateSuccess', editedProperty);
      }).catch((err) => {
        console.error('updateApiBatch:err:', err);
      });
    },

    // 新增属性操作
    submitPropertyAdd(editedProperty, isEmptyIntroduction) {
      const param = {
        name: editedProperty.name,
        corpus: editedProperty.corpusSet,
        category: editedProperty.category,
        unit: editedProperty.unit,
        speech: editedProperty.speech,
        slotInfo: editedProperty.slotInfo,
        parentId: -1,
        speechType: editedProperty.speechType,
      };
      this.$api.createProperty(this.robotID, param)
      .then((res) => {
        const synonymApi = this.$api.updateSynonyms(this.robotID, 'property', {
          id: res.data.data,
          synonym: editedProperty.synonymSet,
        });
        const descApi = isEmptyIntroduction ? Promise.resolve()
         : this.$api.updatePropertyIntroduction(this.robotID, {
           propertyId: res.data.data,
           introduction: editedProperty.introduction,
         });
        return Promise.all([synonymApi, descApi]);
      }).then(() => {
        this.$emit('validateSuccess', editedProperty);
      }).catch((err) => {
        console.error('submitPropertyAdd:err', err.response);
        const errData = err.response.data;
        const message = this.$t(`knowledge_graph.property_edit.${errData.httpCode !== 400 ? 'add_new_property_error' : errData.message}`);
        this.$message({
          message,
          type: 'error',
        });
      });
    },

    validate() {
      if (this.isFunctionProperty) {
        // 当前编辑 [简介] 属性，只有编辑模式
        const editedProperty = {
          modifiable: this.extData.property.isCommonProperty,
          id: this.propertyId,
          corpusSet: this.corpusSet,
          name: this.propertyName,
          synonymSet: this.synonymSet,
          introduction: '',
          speech: '',
          category: '',
          unit: '',
          parentId: -1,
          propertyId: (this.selectCommonPropertyId || [])[0],
          entityId: (this.entitySelect || [])[0],
          slotInfo: this.slotInfo,
        };
        this.submitPropertyEdit(editedProperty, true);
      } else {
        // 普通(非【简介】)属性，有新增和编辑两种情况，要根据editable参数判断
        if (!this.commonPropertyFormCheck()) {
          return;
        }
        const { result, isEmptyIntroduction } = this.generateIntroductionStr();
        this.propertyIntroduction = result;
        const editorElForSpeech = (this.$refs.emAnswerEditorForSpeech || {});
        const speechMulti = editorElForSpeech.handleGetAnswer();
        const editedProperty = {
          modifiable: this.extData.property.isCommonProperty,
          id: this.propertyId,
          name: this.propertyName,
          introduction: this.propertyIntroduction,
          synonymSet: this.synonymSet,
          corpusSet: this.corpusSet,
          speech: speechMulti,
          category: (this.category || [])[0],
          unit: this.propertyUnit,
          parentId: -1,
          propertyId: (this.selectCommonPropertyId || [])[0],
          entityId: (this.entitySelect || [])[0],
          slotInfo: this.slotInfo,
          speechType: this.getSubCategoryByActiveTabType(editorElForSpeech.activeTab),
        };
        if (this.extData.editMode) {
          this.submitPropertyEdit(editedProperty, isEmptyIntroduction);
        } else {
          this.submitPropertyAdd(editedProperty, isEmptyIntroduction);
        }
      }
    },

    // input change 事件
    onInputChange(type, { target: { value } }) {
      if (type === 'property_name') {
        this.isCheckingRepeatName = true;
        this.$api.onCheckNameRepeat(this.robotID,
          { propertyId: this.propertyId, propertyName: value }).then((res) => {
            this.isCheckingRepeatName = false;
            if (res.data.status === 'success') {
              this.isPropertyNameRepeat = res.data.data.found;
              if (this.isPropertyNameRepeat) {
                this.$notifyFail(this.$t('knowledge_graph.notify.name_repeat'));
                this.$message({
                  message: this.$t('knowledge_graph.notify.name_repeat'),
                  typpe: 'error',
                });
                this.$refs.propertyNameRef.focus();
              }
            } else {
              this.$message({
                message: this.$t('knowledge_graph.notify.name_repeat_check_fail'),
                typpe: 'error',
              });
            }
          }).catch((err) => {
            console.log('onCheckNameRepeat:err', err);
            this.isCheckingRepeatName = false;
          });
      }
    },
    // 输入实体名称+propertyId搜索 仅编辑时有
    getEntityByKeyword(key = '') {
      console.log('getEntityByKeyword：key:', key);
      return new Promise((resolve) => {
        const param = key || '';
        this.loadingForGetEntity = true;
        this.$api.getRelatedEntitiesByPropertyId(this.robotID, this.propertyId, param)
          .then((res) => {
            this.loadingForGetEntity = false;
            this.entityOptions = (res.data.data || [])
            .map(item => ({ ...item, value: item.id, text: item.name }));
            console.log('getRelatedEntitiesByPropertyId:res:', res);
            const showAllOption = {
              value: '0',
              text: this.$t('general.all'),
              disabled: false,
            };
            this.entityOptions.splice(0, 0, showAllOption);
            resolve();
          }).catch((err) => {
            this.loadingForGetEntity = false;
            console.error('getEntityByKeyword:err:', err);
          });
      });
    },
    // 输入值名称+propertyId搜索 仅编辑时有
    getValueByKeyword(key = '') {
      return new Promise((resolve) => {
        const param = key || '';
        console.log('getValueByKeyword:key', key);
        this.loadingForGetValue = true;
        this.$api.getRelatedEntitiesByPropertyId(this.robotID, this.propertyId, param)
          .then((res) => {
            console.log('getRelatedEntitiesByPropertyId:res', res);
            this.loadingForGetValue = false;
            this.valueOptions = (res.data.data || [])
            .map(item => ({ ...item, value: item.id, text: item.name }));
            const showAllOption = {
              value: '0',
              text: this.$t('general.all'),
              disabled: false,
            };
            this.valueOptions.splice(0, 0, showAllOption);
            resolve();
          }).catch((err) => {
            this.loadingForGetValue = false;
            console.error('getEntityByKeyword:err:', err);
          });
      });
    },
  },
  beforeMount() {
    this.$api.getSlotTypes().then((res) => {
      this.paramSelection = res.data.type.map(r => ({
        value: r.id,
        text: r.name,
      })).filter(item => item.text === 'entity' || item.text === 'float');

      this.propertyName = this.extData.property.propertyName;
      // this.propertyIntroduction = this.extData.property.introduction;
      this.synonymSet = this.extData.property.synonymSet.map(item => item);
      this.corpusSet = this.extData.property.corpusSet.map(item => item);
      if (this.extData.editMode) {
        this.propertyId = this.extData.property.id;
      }
      if (this.extData.property.isCommonProperty) {
        this.propertyType = this.extData.propertyType;
        // case: create new Property
        this.commonPropertyList = ((this.extData.property || [])
          .commonPropertyList || []).map((item) => {
            item.text = item.name || '-';
            item.value = item.id;
            return item;
          });
        this.entityList = ((this.extData.property || [])
          .entityList || []).map((item) => {
            item.text = item.name || '-';
            item.value = item.id;
            return item;
          });
        this.singleSpeech = this.extData.property.speech;
        this.propertyUnit = this.extData.property.unit;
        this.propertyIntroduction = this.extData.property.introduction === null ? '' : this.extData.property.introduction;
        this.introductionEditMode = this.extData.property.introductionEditFlag;
        this.category = [...this.extData.property.category];
        if (this.extData.property.categorySet && this.extData.property.categorySet.length > 0) {
          this.categories = this.extData.property.categorySet.map(c => ({
            value: c.id,
            text: c.name,
          }));
        }
        this.entityOptions = this.extData.property.entityOptions;
        this.propertyOptions = this.extData.property.propertyOptions;
        this.valueOptions = this.extData.property.valueOptions;
        this.slotInfo = this.extData.property.slotInfo;
        if (!this.slotInfo.url) {
          this.$set(this.slotInfo, 'url', '');
        }
        if (!this.slotInfo.slotList) {
          this.$set(this.slotInfo, 'slotList', []);
        }
        if (this.extData.editMode) {
          this.propertyId = this.extData.property.id;
          const temp = (this.commonPropertyList[0] || {}).id;
          this.selectCommonPropertyId = [temp];
          this.entitySelect = (this.entityList[0] || []).id;
          this.category = [...this.extData.property.category];
          Promise.all([this.getEntityByKeyword(), this.getValueByKeyword()])
            .then(() => {
              this.restructureIntroduction(this.propertyIntroduction);
              this.activeTabForSpeech =
                this.getActiveTabTypeBySubCategory(this.extData.property.speechType);
            });
        }
      }
      this.$on('validate', this.validate);
    });
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';

.user-info-form {
  color: #666666;
  padding: 0 25px;
  width: 60vw;
  @include font-14px();
  display: flex;
  flex-direction: column;
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
      max-width: 80%;
      .row_test_area {
        padding: 10px 0px;
      }
    }

    .column_display {
      @include customScrollbar();
      @include auto-overflow-Y();
      max-height: 300px;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 0;
    }

    .row_display {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
      background-color: #f9f9f9;
      padding: 5px 10px;
      border-radius: 2px;
      transition: all 500;
      &:hover {
         background-color: #d9d9d9;
      }
      .row-text {
        margin: 0 8px 0 10px;
        width: 90%;
        max-width: 90%;
        @include textEllipsis();
      }
      .delete-text {
        padding: 0px 10px;
        color: #F25C62;
        text-align: center;
        cursor: pointer;
      }
    }

    .row-title {
      flex: 0 0 100px;
      max-width: 100px;
      font-size: 14px;
      font-family: PingFangHK-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      .required {
        display: inline-block;
        width: 14px;
        color: $color-primary;
      }
    }
    .row-input {
      width: 100%;
      flex: 1;
      padding: 3px 8px;
      display: flex;
      flex-direction: row;
      @include font-14px();
      ::v-deep .el-textarea {
        width: 500px;
      }
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
::v-deep .el-select {
  width: 100%;
  .el-input.is-focus .el-input__inner {
    border-color: $color-borderline;
  }
  .el-input__inner {
    border-radius: 2px;
  }
  input {
    width: 100%;
  }
  .el-select__input {
    height: 100%;
  }
}
.btn {
  cursor: pointer;
  border-radius: 2px;
  width:90px;
  height:32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  &.first {
    margin-left: 0px;
  }
}
.btn-primary {
  background-color: #1875F0;
  color: white;
  &:focus{
    background-color: #1875F0;
    color: white;
  }
}
.btn-disabled {
  background-color: #E9E9E9;
  color: #CCCCCC;
  &:focus{
    background-color: #E9E9E9;
    color: #CCCCCC;
  }
}
.btn_select {
  display: flex;
}
.m-l-10 {
  margin-left: 10px;
  flex: 0 0 90px;
  max-width: 90px;
}
</style>
