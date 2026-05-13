<template>
    <div class="doc-div">
      <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
     <h1>坐席地图使用指南</h1>
    <p>管理人员可通过坐席地图实时监控坐席人员通话状态及警示记录统计</p>
    <h2>今日通话概况</h2>
    <p>1.展示各小组名称，主管姓名，小组人数，以及当日截止查看时统计的会话总数量及各通话状态警示总次数</p>
    <p>2.每个坐席对应一个状态警示灯，实时展示当前坐席通话状态：</p>
    <p>. 在线，且未出现通话状态违规警示，显示绿色灯号</p>
    <p>. 在线，且出现通话状态违规警示，显示红色灯号</p>
    <p>. 离线/不在通话中，显示灰色灯号</p>

    <p>3.可点击小组框内任一位置（警示灯除外）进入【小组今日通话详情】页面，也可点击任一在线坐席的警示灯查看该坐席通话详情页面</p>
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
