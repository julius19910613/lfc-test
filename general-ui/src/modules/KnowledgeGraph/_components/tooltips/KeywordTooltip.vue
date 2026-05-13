<template>
  <div class="text_tooltip">
    <div class="row input-wrap" >
      <input-tags
        class="row-input-col"
        v-model="inputModels"
        @addTags="addKeyWordSynonyms"
        @deleteTags="deleteKeyWordSynonyms"
        @tagInput="tagInput"
        :content_max_length='50'
      ></input-tags>
    </div>
    <!--    <div class="row">-->
    <!--      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import InputTags from '../TagsInput';
import api from '../../_api/knowledgeGraph';

export default {
  name: 'KeywordTooltip',
  api,

  props: {
    extData: {
    },
  },

  data() {
    return {

      newAddList: [],
      deleteList: [],
      propertyValues: [],
      isInherited: false,
      inputModels: [],
      editMode: false,
      relationId: '',
      entityId: '',
      entityName: '',
      propertyId: '',
      propertyName: '',
      category: '',
      unit: '',
      tagInputVal: '', // tagInput值 输入tag，但是未确认添加，点击确定时，需要添加该值到tags数据中
    };
  },

  watch: {
    inputModels() {
      this.getPropertyValues();
      // this.propertyValues = this
      //   .propertyValues.filter(item => this.inputModels.indexOf(item.propertyValue) > -1);
    },
    extData() {
      this.init();
    },
  },

  methods: {
    getPropertyValues() {
      this.propertyValues = this.inputModels.map((item) => {
        if (this.propertyValues.filter(i => i.propertyValue === item).length > 0) {
          return this.propertyValues.filter(i => i.propertyValue === item)[0];
        }
        return {
          propertyId: '',
          propertyValue: item,
        };
      });
    },
    tagInput(data) {
      this.tagInputVal = data;
    },
    addKeyWordSynonyms(param) {
      this.newAddList.push(param);
    },

    deleteKeyWordSynonyms(param) {
      if (this.newAddList.indexOf(param) > -1) {
        this.newAddList.splice(this.newAddList.indexOf(param), 1);
      } else {
        this.deleteList.push(param);
      }
    },

    addPropertyValue() {
      this.propertyValues.push({
        propertyValueId: '',
        propertyValue: '',
      });
    },

    deletePropertyValue(idx) {
      this.propertyValues.splice(idx, 1);
    },

    validate() {
      if (this.tagInputVal && this.tagInputVal.length > 50) {
        this.$notifyFail(this.$t('knowledge_graph.data_manage.len_gt_error', { len: 50 }));
        return;
      }
      if (this.tagInputVal) {
        if (!this.inputModels.includes(this.tagInputVal)) {
          this.inputModels.push(this.tagInputVal);
          this.newAddList.push(this.tagInputVal);
          this.tagInputVal = '';
          this.getPropertyValues();
        }
      }
      let index = -1;
      const valid = this.newAddList.reduce((pre, cur, _index) => {
        const re = pre && cur.length <= 50;
        if (index === -1 && !re) {
          index = _index + 1;
        }
        return re;
      }, true);
      if (!valid) {
        this.$notifyFail(this.$t('knowledge_graph.data_manage.keyword_len_gt_error', { index, len: 50 }));
        return;
      }
      const validatePromiseList = this.propertyValues.map(item => new Promise((resolve) => {
        const that = this;
        if (item.propertyValueId === undefined || item.propertyValueId === null) {
          item.propertyValueId = '';
        }
        this.$api.checkReapeatEntityName(this.robotID, item.propertyValue, item.propertyValueId, '5')
        .then((res) => {
          if (res.data.data.found) {
            // console.log(that.$t(`knowledge_graph.data_manage.${res.data.data.errMsg}`));
            that.$notifyWarn(
                    that.$t(`knowledge_graph.data_manage.${res.data.data.errMsg}`));
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }));
      console.log(validatePromiseList);
      Promise.all(validatePromiseList).then((result) => {
        console.log(result);
        const errorFlag = result.filter(item => item === true).length === 0;
        if (errorFlag) {
          const createApiBatch = new Promise((resolve) => {
            resolve();
          });
          const deleteBatch = new Promise((resolve) => {
            resolve();
          });
          const unEmptyParamCount = (this.inputModels || []).filter(item => !!item).length;
          Promise.all([...createApiBatch, ...deleteBatch]).then(() => {
            if (!this.editMode) {
              const param = {
                fromEntityId: this.entityId,
                fromEntityName: this.entityName,
                propertyId: this.propertyId,
                propertyName: this.propertyName,
                category: parseInt(this.category, 10),
            // unit: this.unit,
            // toEntityId: '',
                toEntityName: this.propertyValues.map(item => item.propertyValue),
                isInheritParent: false,
                inheritedParentEntityId: '-1',
              };
              if (unEmptyParamCount === 0) {
                this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
                return;
              }
              this.$api.addPropertyValue(this.robotID, param).then((res) => {
            // param.relationId = res.data.data.id;
                param.toEntityId = res.data.data.toEntityId;
                this.$emit('validateSuccess', param);
              });
            } else {
          // update relation mode
              const param = {
                id: this.relationId,
                fromEntityId: this.entityId,
                fromEntityName: this.entityName,
                propertyId: this.propertyId,
                propertyName: this.propertyName,
                category: parseInt(this.category, 10),
                unit: this.unit,
                toEntityId: this.propertyValues.map(item => item.propertyValueId),
                toEntityName: this.propertyValues.map(item => item.propertyValue),
                isInheritParent: false,
                inheritedParentEntityId: '-1',
              };
              if (unEmptyParamCount === 0) {
                const temp = {
                  relations: [{
                    fromEntityId: this.entityId,
                    propertyId: `${this.propertyId}`,
                  }],
                };
                this.$api.deletePropertyValue(this.robotID, temp).then(() => {
                  this.$emit('validateSuccess', param);
                });
              } else {
                this.$api.updatePropertyValue(this.robotID, param).then((res) => {
                  console.log(res);
                  this.$emit('validateSuccess', param);
                });
              }
            }
          });
        }
      });
    },
    init() {
      this.propertyValues.length = 0;
      // this.propertyValue = this.extData.propertyValue;
      this.editMode = this.extData.editMode;
      if (this.editMode) {
        this.extData.propertyValueId.forEach((id, idx) => {
          this.propertyValues.push({
            propertyValueId: id,
            propertyValue: this.extData.propertyValue[idx],
          });
        });
        this.inputModels = this.propertyValues
          .filter(item => !!item && !!item.propertyValue).map(i => i.propertyValue);
      } else {
        this.propertyValues.push({
          propertyValueId: '',
          propertyValue: '',
        });
        this.inputModels = [];
      }
      this.relationId = this.extData.relationId;
      this.entityId = this.extData.entityId;
      this.entityName = this.extData.entityName;
      this.propertyId = this.extData.propertyId;
      this.propertyName = this.extData.propertyName;
      this.propertyValueId = this.extData.propertyValueId;
      this.category = this.extData.category;
      this.unit = this.extData.unit;
    },
  },

  beforeMount() {
    this.init();
    this.$on('validate', this.validate);
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },

  components: {
    VCheckbox,
    InputTags,
  },

};
</script>

<style lang="scss" scoped>
.text_tooltip {
  width: 100%;
  display: flex;
  flex-direction: column;
  .input-wrap {
    max-width: 300px;
    max-height: 300px;
    overflow-y: scroll;
    @include customScrollbar();
    @include auto-overflow-Y();
  }
  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 10px 0px;
    .row_title {
      flex: 0 0 60px;
      max-width: 60px;
    }
    .row-input-col {
     padding-bottom: 5px;
     @include auto-overflow-Y();
     @include customScrollbar();
    }

    input {
      width: 100%;
    }
  }
}
</style>
