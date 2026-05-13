<template>
  <div id='data-report'>
  	<div class="card h-fill w-fill emoti-panel">
      <div class="header-wrapper">
        <div class='title'>数据上报</div>
      </div>
      <div class="content-wrapper">
        <div class="item">数据上报URL: <a href='api.html'>API</a></div>
        <div class="item">下载接口文档: <a href='api.html' download="api.html">下载接口文档</a></div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex';
import api from './_api/';

export default {
  privCode: 'wordbank',
  api,
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';

#data-report {
  .emoti-report{
    display: flex;
    flex-direction: column;
    background-color: $color-white;
    border: 1px solid $table-border-color-e9;
    box-shadow: 0 0 5px hsla(0,0%,40%,.08);
    border-radius: 4px;
  }
  .header-wrapper{
    height: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    border-bottom: 1px dashed $table-border-color;
    .title{
      font-size:16px;
      color: $color-font-active;
      margin-right: 10px;
    }
    .sub-title{
      font-size: 12px;
      color: $color-font-normal;
      margin-right: 10px;
    }
    .operation-left {
      display: inline-block;
      margin-right: 10px;
    }
    .operation-right{
      flex: 1;
      text-align: right;
      display: inline-block;
      .el-input{
        max-width: 190px;
      }
    }
  }

  .content-wrapper{
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;

    .item {
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
}
</style>
