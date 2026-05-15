<template>
  <div class="user-info-form normal">
    <div class="row">
      <div class="row-title">{{ $t('knowledge_graph.synonym_manage.synonym_type') }}</div>
      <div class="row-input">{{ synonymType }}</div>
    </div>
    <div class="row">
      <div class="row-title">{{ diaplaySourceName }}</div>
      <div class="row-input" v-if="extData.editMode">{{extData.synonym.name}}</div>
      <div v-if="extData.synonym.synonymType !== 'entity' && !extData.editMode" class="row-input">
        <dropdown-select
          class="selector"
          :options="sourceNames"
          v-model="sourceName"
          :placeholder="$t('general.please_choose')"
        />
      </div>
      <el-select
        v-if="extData.synonym.synonymType === 'entity' && !extData.editMode"
        v-model="entityName"
        filterable
        reserve-keyword
        :placeholder="$t('knowledge_graph.placeholder.entity_name_search')"
        :loading="loading"
        class="row-input elselect"
      >
        <el-option
          v-for="item in entityOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="row">
      <div class="row-title">{{ $t('knowledge_graph.entity_edit.synonyms') }}</div>
      <div class="row-input-col">
        <tags-input v-model="synonymSet" :maxTagCount='20' :content_max_length='50'/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../../_api/knowledgeGraph';
import tagsInput from '../TagsInput';

export default {
  name: 'AddSynonymPop',
  api,
  props: {
    extData: {
    },
  },

  components: {
    tagsInput,
  },

  watch: {
    entityName(val) {
      console.log('entityName:', val);
      this.sourceName = [val];
    },
    extData() {
      this.init();
    },
    sourceName(val) {
      console.log('sourceName:', val);
      if (this.sourceName[0] !== '' && this.sourceName[0] !== undefined) {
        if (this.synonymTypeVal !== 'property_value') {
          const param = {
            show: 'matchId',
            type: this.synonymTypeVal,
            object_id: this.sourceName[0],
          };
          this.$api.getSynonym(this.robotID, param).then((res) => {
            this.synonymSet = res.data.data.synonym ? res.data.data.synonym : [];
            if (this.synonymSet.length > 0) {
              this.editMode = true;
            }
          });
        } else {
          const filterResult = this.originSynonymSet.find(item => item.id === this.sourceName[0]);
          if (filterResult.synonym.length > 0) {
            this.synonymSet = filterResult.synonym;
          } else {
            this.synonymSet = [];
          }
          // this.synonymSet = (this.originSynonymSet
          //   .filter(item => item.id === this.sourceName[0]).synonym || [])[0];
        }
      }
    },
    originSynonymSet() {
      if (this.synonymTypeVal === 'property_value') {
        const temp = this.originSynonymSet
          .filter(item => item.id === this.sourceName[0]);
        this.synonymSet = (temp[0] || {}).synonym || [];
      }
    },
  },

  computed: {
    ...mapGetters([
      'robotID',
      'userID',
    ]),
    synonymTypeVal() {
      return this.extData.synonym.synonymType;
    },
  },

  data() {
    return {
      synonymType: '',
      sourceName: [''],
      diaplaySourceName: '',
      sourceNames: [],
      synonymSet: [],
      editMode: false,
      originSynonymSet: [],
      entityOptions: [{ label: '', value: '' }], // 实体的选择下拉
      loading: false, // 远程获取实体下拉选项数据
      entityName: '', // 新增实体时的实体名称
    };
  },

  methods: {
    getName() {
      return ((this.sourceNames
        .filter(item => item.value === this.sourceName[0]))[0] || {}).text;
    },
    // 校验同义词不得与实体/属性/值 名称相同
    onCheckSynonym() {
      const result = { valid: true, index: -1 };
      (this.synonymSet || []).map((item, index) => {
        if (item === this.getName()) {
          this.$message({
            message: this.$t('knowledge_graph.entity_edit.synonym_same_as_name', { name: item }),
            type: 'error',
          });
          result.valid = false;
          result.index = index;
        }
        return item;
      });
      return result;
    },
    validate() {
      if (!this.onCheckSynonym().valid) {
        return;
      }
      if (this.extData.synonym.synonymType === 'entity' && !this.editMode) {
        this.sourceName = [this.entityName];
      }
      if ((this.sourceName || []).length <= 0 || !((this.sourceName || [])[0])) {
        return;
      }
      if (this.editMode) { // 编辑模式
        let synonymLimitFlag = true;
        if (this.synonymSet.length > 0) {
          this.synonymSet.forEach((item) => {
            if (item.length > 50) {
              this.$notifyWarn(this.$t('knowledge_graph.entity_edit.synonym_length_msg'));
              synonymLimitFlag = false;
            }
          });
        }
        if (synonymLimitFlag) {
          if (this.synonymTypeVal === 'property_value') {
            const param = {
              name: this.getName(),
              synonym: this.synonymSet,
            };
            this.$api.updateKeywordSynonym(this.robotID, param)
            .then(() => {
              this.$emit('validateSuccess', param);
            })
            .catch((err) => {
              console.log(err.response);
              const errFlag = err.response.data.message;
              this.$notifyWarn(this.$t(`knowledge_graph.synonym_manage.${errFlag}`));
            });
          } else {
            const param = {
              id: this.sourceName[0],
              synonym: this.synonymSet,
            };
            this.$api.updateSynonyms(this.robotID, this.extData.synonym.synonymType, param)
            .then(() => {
              this.$emit('validateSuccess', param);
            }).catch((err) => {
              console.log('updateSynonyms err:', err.response);
              const errFlag = err.response.data.message;
              if (this.extData.synonym.synonymType === 'entity') {
                this.$notifyWarn(this.$t(`knowledge_graph.entity_edit.${errFlag}`));
              } else if (this.extData.synonym.synonymType === 'property') {
                this.$notifyWarn(this.$t(`knowledge_graph.property_edit.${errFlag}`));
              }
            });
          }
        }
      } else if (this.synonymSet.length === 0) { // 新增同义词模式
          // 新增模式下如果未配置同义词，提示客户配置
        this.$notifyWarn(this.$t('knowledge_graph.entity_edit.synonym_empty_msg'));
      } else {
        let synonymLimitFlag = true;
        this.synonymSet.forEach((item) => {
          if (item.length > 50) {
            this.$notifyWarn(this.$t('knowledge_graph.entity_edit.synonym_length_msg'));
            synonymLimitFlag = false;
          }
        });

        if (synonymLimitFlag) {
  // eslint-disable-next-line no-lonely-if
          if (this.synonymTypeVal === 'property_value') {
            const param = {
              name: this.getName(),
              synonym: this.synonymSet,
            };
            this.$api.addKeywordSynonym(this.robotID, param)
            .then(() => {
              this.$emit('validateSuccess', param);
            })
            .catch((err) => {
              console.log('addKeywordSynonym:err:', err);
              this.$notifyFail(`${this.$t('error_msg.data_format_err')}:${err.message}`);
            });
          } else {
            const param = {
              synonym: this.synonymSet,
            };
            this.$api.addSynonyms(this.robotID,
            this.sourceName[0],
            this.extData.synonym.synonymType, param).then(() => {
              param.id = this.sourceName[0];
              this.$emit('validateSuccess', param);
            });
          }
        }
      }
    },
    init() {
      let p1 = null;
      const tempName = this.extData.synonym.sourceName.toString();
      if (this.extData.synonym.synonymType === 'entity') {
        p1 = new Promise((resolve) => {
          this.$api.getAllEntitiesByRobotId(this.robotID, { limit: 1000000 }).then((res) => {
            this.sourceNames = res.data.entities.map(item => ({
              value: item.id,
              text: item.name,
            }));
            this.entityOptions = (res.data.entities || []).map((item) => {
              item.label = item.name;
              item.value = item.id;
              return item;
            });
            if (this.extData.editMode) {
              this.sourceNames = this.sourceNames.filter(item => item.value === tempName);
            }
            resolve();
          });
        });
      } else if (this.extData.synonym.synonymType === 'property') {
        p1 = new Promise((resolve) => {
          this.$api.getAllCommonProperties(this.robotID).then((res) => {
            this.sourceNames = res.data.data.map(item => ({
              value: item.id,
              text: item.name,
            }));
            if (this.extData.editMode) {
              this.sourceNames = this.sourceNames.filter(item => item.value === tempName);
            }
            resolve();
          });
        });
      } else if (this.extData.synonym.synonymType === 'property_value') {
        p1 = new Promise((resolve) => {
          this.$api.getAllSynonymKeywordInfo(this.robotID)
            .then((res) => {
              this.originSynonymSet = (((res || {}).data || []).data || []).map((item, index) => {
                item.id = `${item.id || index}`;
                const temp = {
                  value: item.id,
                  text: item.name,
                };
                item.synonym = (item.synonym || []).filter(item2 => !!item2);
                if (this.extData.editMode && temp.value === tempName) {
                  this.sourceNames.push(temp);
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (!this.extData.editMode && item.synonym.length === 0) {
                    this.sourceNames.push(temp);
                  }
                }
                return item;
              });
              resolve();
            })
            .catch((err) => {
              console.log('getAllSynonymKeywordInfo:err:', err);
              this.$notifyFail(`${this.$t('error_msg.data_format_err')}:${err.message}`);
              resolve();
            });
        });
      }
      p1.then(() => {
        this.editMode = this.extData.editMode;
        this.diaplaySourceName = this.$t(`knowledge_graph.synonym_manage.title_${this.extData.synonym.synonymType}`);
        this.synonymType = this.$t(`knowledge_graph.synonym_manage.${this.extData.synonym.synonymType}`);
        this.synonymSet = this.extData.synonym.synonymSet;
        this.sourceName = [this.extData.synonym.sourceName.toString()];
        this.entityName = this.sourceName[0] || '';
        this.$on('validate', this.validate);
      });
    },

    // 输入搜索获取实体选项
    getEntityOptions(query) {
      console.log('getEntityOptions:', query);
      this.$api.getAllEntitiesByRobotId(this.robotID, { keyword: query }).then((res) => {
        console.log('getAllEntitiesByRobotId:', JSON.stringify(res, null, 2));
        this.entityOptions = (res.data.entities || []).map((item) => {
          item.label = item.name;
          item.value = item.id;
          return item;
        });
      });
    },
  },
  beforeMount() {
    this.init();
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
      @include font-14px();
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
.selector ::v-deep {
  flex: 0 0 400px;
  input {
    width: 400px;
  }
}
.elselect ::v-deep {
  input {
    border-color: $color-borderline;
    width: 100%;
    border-radius: 0px;
    &:focus {
      border-color: $color-borderline;
    }
  }
  .el-input.is-focus .el-input__inner {
    border-color: $color-borderline;
    border-radius: 0px;
    &:focus {
      border-color: $color-borderline;
    }
  }
  .el-input__inner {
    border-color: $color-borderline;
    border-radius: 0px;
    &:focus {
      border-color: $color-borderline;
    }
  }
}
</style>

