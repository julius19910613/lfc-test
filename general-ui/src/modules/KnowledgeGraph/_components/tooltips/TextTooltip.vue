<template>
  <div class="text_tooltip">
    <!--    <div class="row">-->
    <!--      <text-button button-type="primary" @click.stop="addPropertyValue">{{ $t('general.add') }}</text-button>-->
    <!--    </div>-->
    <div class="input-wrap">
      <div v-for="(item, idx) in propertyValues" :key="idx">
        <div class="row">
          <!-- <el-input
            type="textarea"
            :rows="5"
            v-model="item.propertyValue"
            :maxlength="500"
            :minlength="1"
            clearable
            @change="onChangeText"
          ></el-input> -->
          <em-answer-editor
            class="kg-style"
            ref='emAnswerEditor'
            :materialList='fileData'
            :treeList='treeList'
            :total='total'
            :curData='curData'
            :active='activeTab'
            @addMaterial='handleAddMaterial'
            @changePage='handleMaterialChangePage'
            @nodeSelect='handleNodeSelect'
            @uploadFile='handleUploadMaterial'
          ></em-answer-editor>
        </div>
        <!-- <div class="count">
          <span>{{inputCount||0}}/500</span>
        </div> -->
        <!--        <div class="row">-->
        <!--          <text-button-->
        <!--            button-type="error"-->
        <!--            @click.stop="deletePropertyValue(idx)"-->
        <!--          >{{ $t('general.delete') }}</text-button>-->
        <!--        </div>-->
      </div>
    </div>
    <!--    <div class="row">-->
    <!--      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import api from '../../_api/knowledgeGraph';
import mixInMultiEditor from '../../_mixin/multiEditor';

export default {
  name: 'TextTooltip',
  api: [api],
  components: { VCheckbox },
  props: {
    extData: {
    },
  },
  mixins: [mixInMultiEditor],
  data() {
    return {
      propertyValues: [
      ],
      isInherited: false,
      // propertyValue: '',
      // propertyValueId: '',
      editMode: false,
      relationId: '',
      entityId: '',
      entityName: '',
      propertyId: '',
      propertyName: '',
      category: '',
      unit: '',
      inputCount: '', // 第一个文本输入框的字数 目前只支持第一个；
    };
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },
  watch: {
    fileData(val) {
      console.log('fileData', val);
    },
    extData(val) {
      console.log('extData', val);
      this.init();
    },
    propertyValues(val) {
      console.log(JSON.stringify(val, null, 2), 2222);
      this.inputCount = (((val || [])[0] || {}).propertyValue || '').length;
      this.curData = (((val || [])[0] || {}).propertyValue || '');
    },
  },
  methods: {
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
      const editorEl = ((this.$refs.emAnswerEditor || [])[0] || {});
      const multiFileData = editorEl.handleGetAnswer();
      console.log('multiFileData', multiFileData, editorEl.activeTab);
      const temp0 = (this.propertyValues || [])[0] || {};
      temp0.propertyValue = multiFileData;
      const unEmptyParamCount = (this.propertyValues || [])
        .filter(item => !!((item.propertyValue || '').trim())).length;
      if (unEmptyParamCount !== 0 && unEmptyParamCount < this.propertyValues.length) {
        this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
        return;
      }
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
          subCategory: this.getSubCategoryByActiveTabType(editorEl.activeTab),
        };
        if (unEmptyParamCount === 0) {
          this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
          return;
        }
        console.log('param:', JSON.stringify(param, null, 2));
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
          subCategory: this.getSubCategoryByActiveTabType(editorEl.activeTab),
        };
        if (unEmptyParamCount === 0) {
          // delete mode
          const temp = {
            relations: [{
              fromEntityId: this.extData.entityId,
              propertyId: `${this.extData.propertyId}`,
            }],
          };
          this.$api.deletePropertyValue(this.robotID, temp).then(() => {
            this.$emit('validateSuccess', param);
          }).catch((err) => {
            console.log('deletePropertyValue:err:', err);
          });
          return;
        }
        console.log('param:', JSON.stringify(param, null, 2));
        this.$api.updatePropertyValue(this.robotID, param).then(() => {
          this.$emit('validateSuccess', param);
        });
      }
    },

    init() {
      this.activeTab = this.getActiveTabTypeBySubCategory(this.extData.subCategory);
      this.editMode = this.extData.editMode;
      this.propertyValues.length = 0;
      if (this.editMode) {
        (this.extData.propertyValueId || []).forEach((id, idx) => {
          this.propertyValues.push({
            propertyValueId: id,
            propertyValue: (this.extData.propertyValue[idx] || '').trim(),
          });
        });
      } else {
        this.propertyValues.push({
          propertyValueId: '',
          propertyValue: '',
        });
      }
      console.log(JSON.stringify(this.propertyValues, null, 2), 11111);
      // this.propertyValue = this.extData.propertyValue[0];
      this.relationId = this.extData.relationId;
      this.entityId = this.extData.entityId;
      this.entityName = this.extData.entityName;
      this.propertyId = this.extData.propertyId;
      this.propertyName = this.extData.propertyName;
      // this.propertyValueId = this.extData.propertyValueId[0];
      this.category = this.extData.category;
      this.unit = this.extData.unit;
    },
    onChangeText(value) {
      this.inputCount = value.length;
    },
  },

  beforeMount() {
    this.init();
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
.text_tooltip {
  width: 100%;
  display: flex;
  flex-direction: column;
  .input-wrap {
    // width: 300px;
    // max-width: 300px;
    max-height: 300px;
    // overflow: scroll;
  }
  .row {
    @include auto-overflow();
    @include customScrollbar();
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    padding: 10px 0px;
    max-height: 300px;
    textarea {
      width: 80%;
    }
    /deep/ .el-textarea {
      min-width: 520px;
    }
  }
  .count {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 5px 0px;
    justify-content: end;
    align-items: center;
    color: #999999;
    font-size: 12px;
    > span {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
