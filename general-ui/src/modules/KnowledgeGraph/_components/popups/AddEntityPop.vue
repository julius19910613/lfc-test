<template>
  <div class="user-info-form">
    <template v-if="this.extData.editMode">
      <div class="row">
        <div class="row-title">{{ $t('knowledge_graph.entity_edit.entity_name') }}</div>
        <div class="row-input-col">
          <!-- <input class="row-input" v-model="entityName"> -->
          <div>{{ entityName }}</div>
        </div>
      </div>
      <div class="row">
        <div class="row-title">{{ $t('knowledge_graph.entity_edit.displayName') }}</div>
        <div class="row-input-col">
          <input class="row-input" v-model="entityDisplayName" @blur='onDisplayNameCheck'>
        </div>
      </div>
      <div class="row">
        <div class="row-title">{{ $t('knowledge_graph.entity_edit.synonyms') }}</div>
        <div class="row-input-col">
          <tags-input v-model="synonymSet"  :maxTagCount='20' :content_max_length='50'/>
        </div>
      </div>
      <div class="row">
        <div class="row-title">{{ $t('knowledge_graph.entity_edit.introduction') }}</div>
        <div class="btn_column btn_select">
          <div
            class="btn first"
            :disable='relatedIntroFlag'
            :class="!relatedIntroFlag ? 'btn-primary' : 'btn-disabled'"
            @click.stop="addIntroductionSetting('content')"
          >+{{ $t('knowledge_graph.entity_edit.intro_content') }}</div>
          <div
            class="btn"
            :disable='relatedEntityFlag'
            :class="!relatedEntityFlag ? 'btn-primary' : 'btn-disabled'"
            @click.stop="addIntroductionSetting('entity')"
          >+{{ $t('knowledge_graph.entity_edit.entity_related') }}</div>
           <div
            class="btn"
            :disable='relatedPropertyFlag || relatedValueFlag'
            :class="!(relatedPropertyFlag || relatedValueFlag) ? 'btn-primary' : 'btn-disabled'"
            @click.stop="addIntroductionSetting('property')"
          >+{{ $t('knowledge_graph.entity_edit.intro_related') }}</div>
          <div
            class="btn"
            :disable='relatedValueFlag || relatedPropertyFlag'
            :class="!(relatedValueFlag || relatedPropertyFlag) ? 'btn-primary' : 'btn-disabled'"
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
          <icon
            iconType="delete_task"
            @click.stop="removeIntroductionSetting('content')"
            :size="24"
          ></icon>
        </div>
      </div>
      <!-- <div class="row dark" v-if="relatedEntityFlag">
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
        <div class="delete_operation">
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
              :loading="loadingForGetEntity"
              :placeholder="$t('general.please_choose')"
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
      <!-- <div class="row dark" v-if="relatedPropertyFlag">
        <div class="row-title">{{ $t('knowledge_graph.entity_edit.intro_related') }}</div>
        <div class="btn_column">
          <div class="row_test_area">
            <dropdown-select
              class="selector"
              :options="propertyOptions"
              v-model="propOption"
              multi
              :placeholder="$t('general.please_choose')"
            />
          </div>
        </div>
        <div class="delete_operation">
          <icon
            iconType="delete_task"
            @click.stop="removeIntroductionSetting('property')"
            :size="24"
          ></icon>
        </div>
      </div>-->
      <div class="row dark" v-if="relatedPropertyFlag">
        <div class="row-title m-l-10">{{ $t('knowledge_graph.entity_edit.intro_related') }}</div>
        <div class="btn_column">
          <div class="row_test_area">
            <el-select
              v-model="propOption"
              multiple
              filterable
              remote
              reserve-keyword
              :placeholder="$t('general.please_choose')"
              :loading="loadingForGetProperty"
              @change="handlePropValueChange(propOption, 'prop')"
              size="mini"
            >
              <el-option
                v-for="item in propertyOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="delete_operation">
          <icon
            iconType="delete_task"
            @click.stop="removeIntroductionSetting('property')"
            :size="24"
          ></icon>
        </div>
      </div>
      <!-- <div class="row dark" v-if="relatedValueFlag">
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
              :placeholder="$t('general.please_choose')"
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
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DropdownSelector from '@/components/DropdownSelect';
import TagsInput from '../TagsInput';
import api from '../../_api/knowledgeGraph';
import misc from '../../../../utils/js/misc';
import MixinMultiEditor from '../../_mixin/multiEditor';
import MixinValidate from '../../_mixin/Validate';

export default {
  name: 'AddEntityPop',
  api,

  props: {
    extData: {
      type: Object,
      default: () => ({
        type: 2,
      }),
    },
  },
  mixins: [MixinMultiEditor, MixinValidate],
  components: {
    DropdownSelector,
    TagsInput,
  },

  data() {
    return {
      entityId: '',
      entityName: '',
      entityDisplayName: '',
      entityIntroduction: '',
      synonymSet: [],
      propertyOptions: [],
      entityOptions: [],
      valueOptions: [],
      propOption: [],
      entityOption: [],
      valueOption: [],
      introContent: '',
      introValue: '',
      introductionEditMode: false,
      relatedIntroFlag: false,
      relatedEntityFlag: false,
      relatedPropertyFlag: false,
      relatedValueFlag: false,

      INTRODUCTION: {
        INTRODUCTION: 'INTRODUCTION',
        MULTI_ENTITY: 'MULTI_ENTITY',
        MULTI_PROPERTY: 'MULTI_PROPERTY',
        MULTI_VALUE: 'MULTI_VALUE',
      },
      loadingForGetEntity: false, // 加载实体数据
      loadingForGetValue: false, // 加载值数据
      loadingForGetProperty: false, // 加载属性数据
    };
  },

  computed: {

    ...mapGetters([
      'robotID',
      'userID',
    ]),
  },

  watch: {
  },

  methods: {
    onSynonymNameCheck() {
      const isExist = this.synonymSet.find(item => item === this.entityName);
      if (isExist) {
        this.$message({
          message: this.$t('knowledge_graph.entity_edit.entity_synonym_same_as_entity_name',
           { name: this.entityName }),
          type: 'error',
        });
      }
      return isExist;
    },
    onDisplayNameCheck() {
      const name = this.onFormatName(this.entityDisplayName);
      const isExist = this.entityName === name;
      if (isExist) {
        this.$message({
          message: this.$t('knowledge_graph.entity_edit.entitydisplayname_same_as_name',
           { name }),
          type: 'error',
        });
      }
      return isExist;
    },
    handlePropValueChange(values, type) {
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
          if (!this.relatedValueFlag) {
            this.relatedPropertyFlag = true;
          }
          break;
        case 'entity':
          this.relatedEntityFlag = true;
          break;
        case 'value':
          if (!this.relatedPropertyFlag) {
            this.relatedValueFlag = true;
          }
          break;
        default:
          break;
      }
    },

    validate() {
      const tempName = this.onFormatName((this.entityDisplayName || '').trim());
      if (this.onDisplayNameCheck() || this.onSynonymNameCheck()) {
        return;
      }
      const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
          { text: misc.getEllipsisStr(tempName, 6), len: this.MIXIN_ENTITY_MAX_LENGTH });
      const param = {
        ...this.checkEntityNameDataBase,
        str: tempName,
        errMsg,
        enableEmpty: true,
      };
      if (!this.onStrLengthCheck(param)) {
        return;
      }
      const { result, isEmptyIntroduction } = this.generateIntroductionStr();
      this.entityIntroduction = result;
      const editedEntity = {
        id: this.entityId,
        name: this.entityName,
        displayName: tempName,
        introduction: result,
        synonym: this.synonymSet,
        introductionEditMode: this.introductionEditMode,
      };
      console.log('editedEntity:', editedEntity);
      this.$api.updateNodeName(this.robotID, {
        id: editedEntity.id,
        name: editedEntity.name,
        isUpdateDisplayName: true,
        displayName: editedEntity.displayName,
      }).then(() => this.$api.updateSynonyms(this.robotID, 'entity', {
        id: editedEntity.id,
        synonym: editedEntity.synonym,
      })).then(() => {
        if (editedEntity.introductionEditMode) {
          return this.$api.updateEntityProfile(this.robotID, editedEntity.id, {
            introduction: editedEntity.introduction,
          });
        } else if (!isEmptyIntroduction) {
          return this.$api.createEntityProfile(this.robotID, editedEntity.id, {
            introduction: editedEntity.introduction,
          });
        }
         // else：新增模式，判断introduction是否有内容，若无内容，不调用新增实体简介接口
        return Promise.resolve('新增模式，简介内容为空，不做简介内容的接口请求');
      }).then(() => {
        this.$emit('validateSuccess', editedEntity);
      })
      .catch((err) => {
        console.error('confirm:validate:error:', err.response || {});
        const errFlag = ((err.response || {}).data || {}).message || '';
        if (errFlag) {
          const msg = this.$t(`knowledge_graph.entity_edit.${errFlag}`);
          this.$notifyWarn(msg);
        }
      });

      // const updateEntityPromise = new Promise((resolve, reject) =>
      //   this.$api.updateNodeName(this.robotID, {
      //     id: editedEntity.id,
      //     name: editedEntity.name,
      //     isUpdateDisplayName: true,
      //     displayName: editedEntity.displayName,
      //   }).then(() => {
      //     resolve();
      //   })
      //   .catch((res) => {
      //     console.log('updateEntityPromise', res.response);
      //     const errFlag = res.response.data.message;
      //     this.$notifyWarn(this.$t(`knowledge_graph.entity_edit.${errFlag}`));
      //     reject('err');
      //   }));

      // const updateSynonymPromise = new Promise((resolve, reject) =>
      //   this.$api.updateSynonyms(this.robotID, 'entity', {
      //     id: editedEntity.id,
      //     synonym: editedEntity.synonym,
      //   }).then(() => {
      //     resolve();
      //   }).catch((res) => {
      //     console.log('updateSynonymPromise', res.response);
      //     const errFlag = res.response.data.message;
      //     this.$notifyWarn(this.$t(`knowledge_graph.entity_edit.${errFlag}`));
      //     reject('err');
      //   }).then(),
      // );

      // let introductionPromise = '';
      // if (editedEntity.introductionEditMode) {
      //   introductionPromise = new Promise(resolve =>
      //     this.$api.updateEntityProfile(this.robotID, editedEntity.id, {
      //       introduction: editedEntity.introduction,
      //     }).then(() => {
      //       resolve(editedEntity.introduction);
      //     }));
      // } else if (!editedEntity.introduction ||
      //   (editedEntity.introduction &&
      //   editedEntity.introduction && editedEntity.introduction.length === 0) ||
      //   (misc.isJsonString(editedEntity.introduction) &&
      //     JSON.parse(editedEntity.introduction).length === 0)) {
      //   // 新增模式，判断introduction是否有内容，若无内容，不调用新增实体简介接口
      //   introductionPromise = new Promise((resolve) => { resolve(''); });
      // } else {
      //   introductionPromise = new Promise((resolve) => {
      //     this.$api.createEntityProfile(this.robotID, editedEntity.id, {
      //       introduction: editedEntity.introduction,
      //     }).then(() => {
      //       resolve(editedEntity.introduction);
      //     });
      //   },
      //   );
      // }

      // Promise.all([updateEntityPromise,
      //   updateSynonymPromise,
      //   introductionPromise]).then(() => {
      //     this.$emit('validateSuccess', editedEntity);
      //   }).catch((res) => {
      //     console.log(res);
      //   });
    },

    // 处理简介内容
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
      console.log(JSON.stringify(result, null, 2), 'result');
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
            && item.property) {
            if (item.property.length > 0) {
              console.log(item.property);
              console.log(this.valueOptions);
              this.valueOption = item.property;
              if (this.valueOption.length > 0) {
                this.relatedValueFlag = true;
                this.valueOption = this.valueOption.map(i => i.toString());
                // this.valueOption = ['0'];
              }
            } else if (item.property.length === 0) {
              this.relatedValueFlag = true;
              // this.valueOption = this.valueOptions.map(i => i.id.toString());
              this.valueOption = ['0'];
            }
          }
        });
      }
    },
    // 相关实体选择框 异步获取实体数据
    getEntityByKeyword(key = '', limit = 100000) {
      return new Promise((resolve) => {
        this.loadingForGetEntity = true;
        this.$api.getRelatedEntitiesByEntityId(this.robotID, this.entityId, key, limit)
        .then((res) => {
          this.loadingForGetEntity = false;
          this.entityOptions = (res.data.data || [])
            .map(item => ({ ...item, value: item.id, text: item.name, disabled: false }));
          const showAllOption = {
            value: '0',
            text: this.$t('general.all'),
            disabled: false,
          };
          this.entityOptions.splice(0, 0, showAllOption);
          resolve();
        }).catch((err) => {
          this.loadingForGetEntity = false;
          console.log('getEntityByKeyword:err:', err);
        });
      });
    },
    // 相关值选择框 异步获取值数据
    getValueByKeyword(key = '', limit = 100000) {
      return new Promise((resolve) => {
        this.loadingForGetValue = true;
        this.$api.getRelatedPropertiesByEntityId(this.robotID, this.entityId, key, limit)
        .then((res) => {
          this.loadingForGetValue = false;
          this.valueOptions = (res.data.data || [])
            .map(item => ({ ...item, value: item.id, text: item.name, disabled: false }));
          const showAllOption = {
            value: '0',
            text: this.$t('general.all'),
            disabled: false,
          };
          this.valueOptions.splice(0, 0, showAllOption);
          resolve();
        }).catch((err) => {
          this.loadingForGetValue = false;
          console.log('getEntityByKeyword:err:', err);
        });
      });
    },
    // 相关属性选择框 异步获取属性数据
    getPropertyByKeyword(key = '') {
      return new Promise((resolve) => {
        this.loadingForGetProperty = true;
        this.$api.getRelatedPropertiesByEntityId(this.robotID, this.entityId, key).then((res) => {
          this.loadingForGetProperty = false;
          this.propertyOptions = (res.data.data || [])
            .map(item => ({ ...item, value: item.id, text: item.name, disabled: false }));
          const showAllOption = {
            value: '0',
            text: this.$t('general.all'),
            disabled: false,
          };
          this.propertyOptions.splice(0, 0, showAllOption);
          resolve();
        }).catch((err) => {
          this.loadingForGetProperty = false;
          console.log('getEntityByKeyword:err:', err);
        });
      });
    },
  },

  beforeMount() {
    this.entityId = this.extData.entity.id;
    this.entityName = this.extData.entity.name;
    this.entityDisplayName = this.extData.entity.displayName;
    this.entityIntroduction = this.extData.entity.introduction;
    this.synonymSet = this.extData.entity.synonym;
    // this.propertyOptions = this.extData.entity.relatedProperties;
    this.introductionEditMode = this.extData.entity.introductionEditMode;
    Promise.all([this.getEntityByKeyword(),
      this.getValueByKeyword(),
      this.getPropertyByKeyword()]).then(() => {
        this.restructureIntroduction(this.entityIntroduction);
        this.$on('validate', this.validate);
      });
  },
};
</script>

<style lang="scss" scoped>
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

    .btn_column {
      flex: 1;
      max-width: 80%;
      .row_test_area {
        padding: 10px 0px;
      }
    }
    .btn_select {
      display: flex;
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
    .m-l-10 {
      margin-left: 10px;
      flex: 0 0 90px;
      max-width: 90px;
    }
    .row-input {
      width: 100%;
      flex: 1;
      padding: 3px 8px;
      @include font-14px();
    }

    .length-auto {
      flex: 0 1 340px;
    }
    .row-input-col {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.selector ::v-deep {
  flex: 0 0 400px;
  input {
    width: 400px;
  }
}

.delete_operation {
  margin: 0px 10px;
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
</style>
