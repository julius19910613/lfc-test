<template>
<div class="table-body">
       <div class="table-content">
     <h2>基本信息</h2>
        <p>Path： /xeonKgDal/b85265bf6f2a4c6e8edbcefde25f8733/ftTrainTrigger</p>
        <p>Method： GET</p>
        <p>接口描述：</p>
        <h2>请求参数</h2>
        <h3>Headers</h3>
        <div class="table">
            <el-table :data="u5f00u59cb_1">
                <el-table-column prop="name" label="参数名称"></el-table-column>
                <el-table-column prop="status" label="是否必须"></el-table-column>
                <el-table-column prop="example" label="示例"></el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
            </el-table>
        </div>
       </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      u5f00u59cb_1: [
        {
          name: 'env',
          status: '是',
          example: '',
          memo: '',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
    .table-body {
      max-height: calc(100vh - 60px);
      width: calc(100vw - 250px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
       .table-content{
          margin: 20px 0;
          padding: 0 20px;
          overflow: auto;
        }
    }
    h1 {
        display: block;
        font-size: 20px;
        margin-block-start: 0em;
        margin-block-end: 0.67em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
    }
    h2 {
         display: block;
        font-size: 20px;
        margin-block-start: 0em;
        margin-block-end: 0.67em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
    }
    h3 {
          display: block;
        font-size: 18px;
        margin-block-start: 0em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
    }

    p {
        font-size: 14px;
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    .table {
        margin-bottom: 20px;
        max-width: calc(100vw - 300px);
        /deep/ .el-table {
       border: 1px solid #EBEEF5;


       th{
           padding: 0;
        height: 36px;
        background: rgba(252,252,252,1);
        box-shadow: 0px -1px 0px 0px rgba(233,233,233,1), 0px 1px 0px 0px rgba(233,233,233,1);
        }
        td{
                height: 39px;
                 padding: 0;
        }
    }

    }
</style>
