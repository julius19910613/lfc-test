<template>
   <div class="doc-div">
    <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
<h1>任务管理使用指南</h1>
    <p>任务管理模块，主要提供外呼任务的增、删、改操作、启停等运行管理以及并提供名单过滤管理的功能。名单过滤的作用，针对在外呼任务创建时，能自动按规则过滤掉某些号码，确保</p>
    <h2>任务的定义是什么？</h2>
    <p>(外呼)任务通常是一组名单的拨打计划。该组名单可以包含N条拨打名单的集合。在智能外呼系统中，外呼的进行是以任务为单位。更多信息，请参见用户手册。</p>
    <h2>如何查看任务的信息？</h2>
    <p>点击任务名称，即可查看任务信息，包括任务的名称、对应的任务名单、任务的起始-结束时间等。更多信息，请参见用户手册。</p>
    <h2>如何查看任务的当前情况(监控)？</h2>
    <p>在任务的操作栏，点击按钮，即可出现“任务监控”，进入到任务的监控，会显示当前任务的拨打情况，包括拨打进度、接通情况、当前对话实时抓取到的数据。更多信息，请参见用户手册。</p>
     <h2>任务是否可以修改？</h2>
     <p>任务在未拨打之前，可以对全部信息进行修改。运行中的任务无法修改，
         必须先暂停后才允许修改（且只允许修改并发的数量、启停时间，对应的呼叫名单和机器人、场景都不可修改）。已完成的任务无法修改。更多信息，请参见用户手册。</p>
    <h2>名单过滤功能有什么用？</h2>
    <p>名单过滤规则的作用是在任务创建时，名单会保存到数据库，系统按照某些过滤需求进行过滤，
        确保被过滤掉的号码不会进行拨打，避免对最终客户形成骚扰。注意，过滤功能不对已经上传名单的任务生效。</p>
     <h2>如何创建过滤规则？</h2>
    <p>进入名单过滤菜单，选择新建规则。每一个规则至少需包含一个过滤条件（每个条件在界面上表示为灰色块区域），
        不同的过滤规则之间是 OR （或）的关系，在同一个过滤条件内，有不同的过滤类型，类型之间是 AND （与）的关系。更多信息，请参见用户手册。</p>
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
