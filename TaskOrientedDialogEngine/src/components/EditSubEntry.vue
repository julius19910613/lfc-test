<template>
  <div class="edit-sub-entry-wrapper">
    <div class="header-wrapper">
      <span class="title">节点详细规则 -【{{data.title}}】</span>
    </div>
    <div class="basic-wrapper">
      <h1 class="title"></h1>
      <div class="node-name-box">
        <span class="label">节点名称</span>
        <el-input class="input-box" v-model="data.title" size="small"></el-input>
      </div>
    </div>
    <div class="triggers-wapper">
      <h1 class="title">开始触发</h1>
      <div class="triggers-section">
        <div class="section-title">触发条件</div>
        <edit-condition-group v-for="(data, index) in conditionGroups" :key="index"
        :advanceMode="true" @update="handleUpdate"
        :groupIndex="index" :data="data"
        @deleteGroup="handleRemoveConditionGroup"></edit-condition-group>
        <div class="add-condition-group-box">
          <div class="add-condition-group-btn" @click="handleAddConditionGroup">+新增条件组</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import EditConditionGroup from './basic/EditConditionGroup';

export default {
  components: {
    EditConditionGroup,
  },
  props: {
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
    // conditionGroups() {
    //   let res = [];
    //   if (this.data.criteriaSet && this.data.criteriaSet.items) {
    //     res = this.data.criteriaSet.items;
    //   }
    //   return res;
    // },
  },
  methods: {
    initializeData() {
      let groups = [];
      if (this.data.criteriaSet && this.data.criteriaSet.items) {
        groups = this.data.criteriaSet.items;
      }
      this.conditionGroups = groups;
    },
    handleUpdate() {
      this.$emit('update');
    },
    // 新增条件组
    handleAddConditionGroup() {
      this.conditionGroups.push({
        operator: 'AND',
        items: [
          { left: '', operator: '', right: '' },
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
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.edit-sub-entry-wrapper{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  .header-wrapper{
    border-radius: 2px;
    background-color: #F7F7F7;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    .title {
      color: #333333;
      font-size: 14px;
    }
  }
  .basic-wrapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .node-name-box{
      border-radius: 2px;
      margin-top: 10px;
      background-color: #F7F7F7;
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0px 20px;
      .label{
        color: #666666;
        font-size: 14px;
      }
      .input-box{
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
  .triggers-wapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .triggers-section{
      &:hover{
        box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
      }
      margin-top: 10px;
      background-color: #F7F7F7;
      border-radius: 2px;
      .section-title{
        background-color: #EEEEEE;
        color: #666666;
        font-size: 14px;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0px 20px;
        border-radius: 2px 2px 0px 0px;
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
    }
  }
}
</style>

