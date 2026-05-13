<template>
  <div class="question-exit-wrapper">
    <div class="title-box">
      <span class="title">结束{{ exitIndex + 1}}</span>
      <span class="delete-btn" @click="handleDeleteTermination">删除结束{{ exitIndex + 1}}</span>
    </div>
    <edit-condition-group v-for="(data, index) in conditionGroups" :key="index"
    @update="handleUpdate"
    :groupIndex="index" :groupOperator="groupOperator" :data="data"
    @deleteGroup="handleRemoveConditionGroup"></edit-condition-group>
    <div class="add-condition-group-box">
      <div class="add-condition-group-btn" @click="handleAddConditionGroup">+新增条件组</div>
    </div>
    <div class="speech-wrapper" v-if="nlTemplOptions">
      <span class="title">离开话术</span>
      <el-checkbox @change="handleChangeEndFlag" v-model="endFlag">是否退出场景</el-checkbox>
      <!-- <el-switch v-model="data.nlTemplates.enabled"></el-switch> -->
      <div class="speech-item" v-for="(speech, index) in nlTemplOptions" :key="index">
        <span class="label">{{ index === 0 ? '预设' : '自定义'}}</span>
        <reference-input class="reference-input"
        @change="handleUpdate" placeholder="请输入结束话术"
        :referenceList="selectionsWithDollar"
        v-model="nlTemplOptions[index]"></reference-input>
        <img @click="handleRemoveNLOption(index)"
        class="delete-btn" src="../../assets/images/delete_s.png"/>
      </div>
      <!-- <p class="add-speech" @click="handleAddNLOption">+新增自定义话术</p> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditConditionGroup from './EditConditionGroup';
import ReferenceInput from './ReferenceInput';

export default {
  props: {
    exitIndex: {
      type: Number,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      conditionGroups: [],
      nlTemplOptions: [],
      endFlag: false,
    };
  },
  created() {
    this.initializeData();
  },
  watch: {
    data() {
      this.initializeData();
    },
  },
  computed: {
    ...mapGetters([
      'selectionsWithDollar',
    ]),
    groupOperator() {
      let res = 'OR';
      if (this.data && this.data.criteriaSet && this.data.criteriaSet.operator) {
        res = this.data.criteriaSet.operator;
      }
      return res;
    },
  },
  methods: {
    initializeData() {
      let groups = [];
      if (this.data && this.data.criteriaSet && this.data.criteriaSet.items) {
        groups = this.data.criteriaSet.items;
      }
      this.conditionGroups = groups;
      let options = [''];
      let endFlag = false;
      if (this.data && this.data.nlTemplates) {
        endFlag = this.data.exitType === 'EXIT_TASK';
        if (this.data.nlTemplates.options) {
          options = this.data.nlTemplates.options;
        }
      }
      this.endFlag = endFlag;
      this.nlTemplOptions = options;
    },
    handleUpdate() {
      this.$emit('update');
    },
    handleAddConditionGroup() {
      this.conditionGroups.push({
        operator: 'AND',
        items: [
          { left: '', operator: '' },
        ],
      });
      this.data.criteriaSet.items = this.conditionGroups;
      this.handleUpdate();
    },
    handleRemoveConditionGroup(index) {
      this.conditionGroups.splice(index, 1);
      this.data.criteriaSet.items = this.conditionGroups;
      this.handleUpdate();
    },
    handleAddNLOption() {
      this.nlTemplOptions.push('');
      this.data.nlTemplates.options = this.nlTemplOptions;
      this.handleUpdate();
    },
    handleRemoveNLOption(index) {
      this.nlTemplOptions.splice(index, 1);
      this.data.nlTemplates.options = this.nlTemplOptions;
      this.handleUpdate();
    },
    handleChangeEndFlag() {
      this.data.exitType = this.endFlag ? 'EXIT_TASK' : null;
      console.log(`${this.data.exitType} - ${this.endFlag}`);
    },
    handleDeleteTermination() {
      this.$emit('delete', this.exitIndex);
    },
  },
  components: {
    EditConditionGroup,
    ReferenceInput,
  },
};
</script>

<style lang="scss" scoped>
.question-exit-wrapper{
  background-color: #F7F7F7;
  border-radius: 2px;
  border:1px solid rgba(219,219,219,1);
  &:hover{
    box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
  }
  .title-box{
    background-color: #EEEEEE;
    height: 40px;
    display: flex;
    padding: 0px 20px;
    align-items: center;
    border-radius: 2px 2px 0px 0px;
    .title{
      color: #666666;
      font-size: 14px;
      flex: 1;
    }
    .delete-btn{
      color: #666666;
      font-size: 12px;
      cursor: pointer;
      &:hover{
        color: #F25C62;
      }
    }
  }
  .add-condition-group-box{
    padding: 10px 20px;
    .add-condition-group-btn{
      background-color: #FFFFFF;
      border: 1px dotted #DBDBDB;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 2px;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        border-color: #1875F0;
        color: #1875F0;
      }
    }
  }
  .speech-wrapper{
    padding: 20px;
    box-shadow:0px -1px 0px 0px #E9E9E9;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    /deep/ .el-checkbox{
      margin-left: 10px;
      .el-checkbox__label{
        font-size: 14px;
      }
    }
    .speech-item{
      margin-top: 10px;
      background-color: #EEEEEE;
      height: 52px;
      display: flex;
      align-items: center;
      padding: 0px 17px 0px 10px;
      .label{
        width: 42px;
        text-align: right;
        font-size: 14px;
      }
      .reference-input{
        margin-left: 10px;
        flex: 1;
        font-size: 14px;
      }
      .delete-btn{
        margin-left: 23px;
        width: 13px;
        height: 16px;
        cursor: pointer;
      }
    }
    .add-speech{
      color: #1875F0;
      margin-top: 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .el-switch{
      margin-left: 10px;
    }
  }
}
</style>

