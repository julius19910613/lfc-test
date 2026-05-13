<template>
    <div class="doc-div">
      <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>报表管理</h1>
    <h2>报表管理有哪些功能</h2>
    <p>报表管理包含统计报表和业务部门概览2部分功能。</p>
    <h2>统计报表</h2>
    <p>统计报表包含机器质检、人工质检、教材库审核提交、申述间处理、问题件处理明细等结果及进度统计。</p>
    <h2>业务部门概览</h2>
    <p>业务部门概览可以按坐席和坐席组维度，统计呈现录音的质检结果及质检分数。</p>
    <h2>统计查询支持哪些条件</h2>
    <p>支持按起止时间查询对应的录音文件的质检结果，可以选择1天、7天、30天或自定义起止时间。</p>
  </div>
    </div>
</template>

<script>
export default{
  data() {
    return {
      msg: 'haha',
    };
  },
};
</script>
<style lang="scss" scoped>
.doc-div{
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    div{
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
  font-size: 16px;
  margin-block-start: 0em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
p {
  line-height: 1.4;
  font-size: 14px;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
