<template>
  <div class="trigger-wrapper">
    <!-- {{commonSlotsInNodes}} -->
    <div class="trigger-title-box">
      <span class="trigger-title">触发{{ triggerIndex + 1 }}</span>
      <span class="delete-btn" @click="handleDeleteTrigger">删除触发{{ triggerIndex + 1 }}</span>
    </div>
    <edit-condition-group
    @update="handleUpdate"
    v-for="(data, index) in conditionGroups" :key="index"
    :groupIndex="index" :groupOperator="groupOperator" :data="data"
    @deleteGroup="handleRemoveConditionGroup"></edit-condition-group>
    <div class="add-condition-group-box">
      <div class="add-condition-group-btn" @click="handleAddConditionGroup">+新增条件组</div>
    </div>
    <div class="strategy-wrapper">
      <div class="strategy-title-box">
        <span class="title">槽位策略</span>
        <span class="description">选择当前问话优先解析的槽位</span>
      </div>
      <div class="slots-box" v-if="slotsInConditions.length > 0">
        <span class="slot-item" v-for="(slot, index) in slotsInConditions" :key="index"
        :class="{'selected': slot === data.targets}"
        @click="handleSelectStrategicSlot(slot)">
          {{slot}}
          <img src="../../assets/images/selected.png">
        </span>
      </div>
    </div>
    <div class="speech-wrapper">
      <h1 class="title">机器人问</h1>
      <div class="speech-item" v-for="(speech, index) in nlTemplOptions" :key="index">
        <span class="label">{{ index === 0 ? '预设' : '自定义'}}</span>
        <reference-input class="reference-input" v-model="nlTemplOptions[index]"
        @change="handleUpdate" placeholder="请输入机器人的回复内容"
        :referenceList="selectionsWithDollar"></reference-input>
        <img @click="handleRemoveNLOption(index)"
        class="delete-btn" src="../../assets/images/delete_s.png"/>
      </div>
      <p class="add-speech" @click="handleAddNLOption">+新增自定义问</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditConditionGroup from './EditConditionGroup';
import ReferenceInput from './ReferenceInput';

export default {
  props: {
    triggerIndex: {
      type: Number,
    },
    data: {
      type: Object,
    },
    nodeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      conditionGroups: [],
      nlTemplOptions: [],
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
  components: {
    EditConditionGroup,
    ReferenceInput,
  },
  computed: {
    ...mapGetters([
      'selectionsWithDollar',
    ]),
    slotsInConditions() {
      if (!this.conditionGroups || !this.conditionGroups.length) {
        return [];
      }
      const res = [];
      let strategicSlot = '';
      this.conditionGroups.forEach((group) => {
        if (group.items && group.items.length) {
          group.items.forEach((slot) => {
            if (slot.left !== '' && res.indexOf(slot.left) === -1
            && slot.left.indexOf(`\${${this.nodeId}.`) !== -1
            && slot.left.indexOf('次数') === -1) {
              // 只有是当前节点的槽位，才会出现在槽位策略中
              console.log(slot.left);
              res.push(slot.left);
              if (slot.operator === 'N_EXIST' && strategicSlot === '') {
                strategicSlot = slot.left;
              }
            }
          });
        }
      });
      if (!this.data.targets || res.indexOf(this.data.targets) === -1) {
        // 没有选择优先解析槽位时，默认选择第一个NOT EXIST的槽位
        if (strategicSlot !== '') {
          // eslint-disable-next-line
          this.data.targets = strategicSlot;
          this.handleUpdate();
        } else if (res.length > 0) {
          // eslint-disable-next-line
          this.data.targets = res[0];
          this.handleUpdate();
        } else {
          // eslint-disable-next-line
          this.data.targets = '';
          this.handleUpdate();
        }
        this.$forceUpdate();
      }
      return res;
    },
    groupOperator() {
      let res = 'OR';
      if (this.data && this.data.criteriaSet && this.data.criteriaSet.operator) {
        res = this.data.criteriaSet.operator;
      }
      return res;
    },
  },
  methods: {
    // 初始化
    initializeData() {
      // 条件组
      let condGroups = [];
      if (this.data && this.data.criteriaSet && this.data.criteriaSet.items) {
        condGroups = this.data.criteriaSet.items;
      }
      this.conditionGroups = condGroups;
      // 解析失败话术
      let options = [''];
      if (this.data && this.data.nlTemplates && this.data.nlTemplates.options) {
        options = this.data.nlTemplates.options;
      }
      this.nlTemplOptions = options;
    },
    handleUpdate() {
      this.$emit('update');
    },
    // 新增条件组
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
    // 删除条件组
    handleRemoveConditionGroup(index) {
      this.conditionGroups.splice(index, 1);
      this.data.criteriaSet.items = this.conditionGroups;
      this.handleUpdate();
    },
    // 选择策略
    handleSelectStrategicSlot(slot) {
      this.data.targets = slot;
      this.$forceUpdate();
      this.handleUpdate();
    },
    // 添加话术
    handleAddNLOption() {
      this.nlTemplOptions.push('');
      this.data.nlTemplates.options = this.nlTemplOptions;
      this.handleUpdate();
    },
    // 删除话术
    handleRemoveNLOption(index) {
      // debugger;
      this.nlTemplOptions.splice(index, 1);
      this.data.nlTemplates.options = this.nlTemplOptions;
      this.handleUpdate();
    },
    handleDeleteTrigger() {
      this.$emit('deleteTrigger', this.triggerIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.trigger-wrapper{
  background-color: #F7F7F7;
  border-radius: 2px;
  border:1px solid rgba(219,219,219,1);
  &:hover{
    box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
  }
  .trigger-title-box{
    background-color: #EEEEEE;
    height: 40px;
    display: flex;
    padding: 0px 20px;
    align-items: center;
    border-radius: 2px 2px 0px 0px;
    .trigger-title{
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
  .strategy-wrapper{
    padding: 20px;
    box-shadow: 0px -1px 0px 0px rgba(233,233,233,1);
    .strategy-title-box{
      .title{
        color: #333333;
        font-size: 14px;
      }
      .description{
        margin-left: 10px;
        color: #999999;
        font-size: 12px;
      }
    }
    .slots-box{
      box-sizing: border-box;
      display: inline-block;
      width: 100%;
      margin-top: 10px;
      background-color: #EEEEEE;
      padding: 0px 10px 10px 10px;
      .slot-item{
        position: relative;
        cursor: pointer;
        margin-top: 10px;
        margin-left: 10px;
        display: inline-block;
        background-color: #FFFFFF;
        border-radius:2px;
        color: #666666;
        font-size: 14px;
        padding: 10px 15px;
        border: 1px solid #DBDBDB;
        img{
          display: none;
          position: absolute;
          bottom: -1px;
          right: -1px;
        }
        &.selected {
          border-color: #1875F0;
          img{
            display: block;
          }
        }
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
  }
}
</style>

