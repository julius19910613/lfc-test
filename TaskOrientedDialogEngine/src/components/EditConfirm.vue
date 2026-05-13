<template>
  <div class="edit-confirm-wrapper">
    <div class="header-wrapper">
      <span class="title">节点详细规则 -【{{data.title}}】</span>
      <span class="ungroup-btn">删除</span>
    </div>
    <div class="basic-wrapper">
      <h1 class="title">基础设置</h1>
      <div class="node-name-box">
        <span class="label">节点组名称</span>
        <el-input class="input-box" v-model="data.title" size="small"></el-input>
      </div>
    </div>
    <div class="confirm-wrapper">
      <h1 class="title">信息确认</h1>
      {{data}}
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
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.edit-confirm-wrapper{
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
  .confirm-wrapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
