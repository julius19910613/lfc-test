<template>
  <div class="edit-group-wrapper">
    <div class="header-wrapper">
      <span class="title">节点组详细规则 -【{{data.title}}】</span>
      <span class="ungroup-btn">解散组</span>
    </div>
    <div class="basic-wrapper">
      <h1 class="title"></h1>
      <div class="node-name-box">
        <span class="label">节点组名称</span>
        <el-input class="input-box" v-model="data.title" size="small"></el-input>
      </div>
    </div>
    <div class="slots-wrapper">
      <h1 class="title">节点slot信息</h1>
      <div class="node-content">
        <div class="node-item" v-for="(node, index) in data.nodes" :key="index">
          <span class="label">{{node.title}}</span>
          <span class="value">{{getNodeSlots(node)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    slots: {
      type: Array,
      default() {
        return [
          { nodeName: '是否本人', slot: 'NAME' },
          { nodeName: '是否认识', slot: '' },
          { nodeName: '提供新号码', slot: 'NUMBER' },
        ];
      },
    },
  },
  data() {
    return {
      groupName: '',
    };
  },
  created() {
    this.groupName = this.title;
  },
  methods: {
    getNodeSlots(node) {
      let slotStr = '';
      if (node.slotFinder && node.slotFinder.slots && node.slotFinder.slots.length) {
        node.slotFinder.slots.forEach((slot) => {
          slotStr = `${slotStr} ${slot.name}`;
        });
      }
      if (slotStr === '') {
        slotStr = '-';
      }
      return slotStr;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.edit-group-wrapper{
  box-sizing: border-box;
  padding: 20px;
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
      flex: 1;
    }
    .ungroup-btn{
      cursor: pointer;
      &:hover{
        color: #F25C62;
      }
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
  .slots-wrapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .node-content{
      padding: 20px;
      background-color: #F7F7F7;
      margin-top: 10px;
      .node-item{
        margin-top: 20px;
        &:first-child{
          margin-top: 0px;
        }
        .label{
          display: inline-block;
          color: #666666;
          font-size: 14px;
          min-width: 74px;
          text-align: right;
          margin-right: 10px;
        }
        .value{
          color: #333333;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
