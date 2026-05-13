<template>
<div class="table-body">
       <div class="table-content">
 <h2>基本信息</h2>
        <p>Path： /xeonKgDal/entityManager/d1e3c8b84b8c43e2a64fec044f12e5b8/deleteEntity/3487</p>
        <p>Method： DELETE</p>
        <p>接口描述：</p>
        <h2>请求参数</h2>
        <h3>Headers</h3>
        <div class="table">
            <el-table :data="u5220u9664_1">
                <el-table-column prop="name" label="参数名称"></el-table-column>
                <el-table-column prop="type" label="参数值"></el-table-column>
                <el-table-column prop="status" label="是否必须"></el-table-column>
                <el-table-column prop="example" label="示例"></el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
            </el-table>
        </div>
        <h3>Body</h3>
        <div class="table">
            <el-table :data="u5220u9664_2">
                <el-table-column prop="name" label="参数名称"></el-table-column>
                <el-table-column prop="type" label="参数类型"></el-table-column>
                <el-table-column prop="status" label="是否必须"></el-table-column>
                <el-table-column prop="example" label="示例"></el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
            </el-table>
        </div>
        <h2>返回数据</h2>
        <div class="table">
            <el-table :data="u5220u9664_3">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="status" label="是否必须"></el-table-column>
                <el-table-column prop="default" label="默认值"></el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
                <el-table-column prop="other" label="其他信息"></el-table-column>
            </el-table>
        </div>
</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      u5220u9664_1: [
        {
          name: 'Content-Type',
          type: 'application/json',
          status: '是',
          example: '',
          memo: '',
        },
      ],
      u5220u9664_2: [
        {
          name: 'name',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '属性名称',
        },
        {
          name: 'corpus',
          type: 'string []',
          status: '非必须',
          example: '',
          memo: '属性语料',
        },
        {
          name: '  ',
          type: '',
          status: '非必须',
          example: '',
          memo: '',
        },
        {
          name: 'category',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '属性类型',
        },
        {
          name: 'unit',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '属性单位',
        },
        {
          name: 'speech',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '属性话术',
        },
        {
          name: 'parentId',
          type: 'number',
          status: '非必须',
          example: '',
          memo: '',
        },
        {
          name: 'slotInfo',
          type: 'object',
          status: '非必须',
          example: '',
          memo: '',
        },
        {
          name: '   url',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '接口类型属性网址',
        },
        {
          name: '   slotList',
          type: 'string []',
          status: '非必须',
          example: '',
          memo: '接口类型属性参数列表',
        },
        {
          name: '  ',
          type: '',
          status: '非必须',
          example: '',
          memo: '',
        },
      ],
      u5220u9664_3: [
        {
          name: 'status',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '执行状态',
          other: '',
        },
        {
          name: 'message',
          type: 'string',
          status: '非必须',
          example: '',
          memo: '错误信息',
          other: '',
        },
        {
          name: 'data',
          type: 'object',
          status: '非必须',
          example: '',
          memo: '',
          other: '',
        },
        {
          name: 'httpCode',
          type: 'number',
          status: '非必须',
          example: '',
          memo: '',
          other: '',
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
