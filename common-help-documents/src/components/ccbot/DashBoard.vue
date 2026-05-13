<template>
    <div class="doc-div">
    <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>展板（Dashboard）使用指南</h1>
    <p>展板（Dashboard）主要针对外呼任务、拨打、接通数据进行实时的统计和可视化的展现。方便业务掌握实时的运营情况和系统情况。同时，也能直接在大屏上进行播放和展示。</p>
    <h2>展板（Dashboard）提供了哪些数据？</h2>
    <p>标准版的展板提供了以下三个部分的数据。</p>
    <p>1、顶部Banner：累计拨打（累计已经拨打的电话数量）、累计通话（已经接通的电话累计通时）、接通率（等于累计接通/累计拨打）、触达率（通话时间大于10S的通话数量/累计拨打）；</p>
    <p>2、大数据展板：接通客户的地理分布（按照区号或手机归属地）、呼叫量折线图（当天|最近7天|最近30天）、任务进度指示器（拨打进度|时间进度）；</p>
    <p>3、任务看板，任务看板提供了针对单一任务运行情况，提供了：实时数据收集（多轮标签）、对话分类、客户情绪分类、以及实时对话窗口。</p>
   <h2>展板的刷新频率是多久？</h2>
    <p>默认为30s</p>
    <h2>展板的接通客户的分布地图是怎么实现的？</h2>
    <p>展板的客户分布地图，是按照（被叫）客户号码的区号和手机号的归属地来实现的。手机号归属地，在系统内部自带一个归属地的DB来实现区分。</p>
    <h2>任务的不同进度状态是怎么定义的？</h2>
    <p>任务的进度状态针对的是"运行中"和"暂停"任务的进度，
        按照 "拨打进度/ 时间进度"，得到3种结果。每个任务的进度指示有2个数据项，绿色条（时间进度），蓝色条（任务拨打进度）。当任务的拨打进度（60%）/时间进度（50%）
        大于等于1.2  代表拨打进度提前；任务的拨打进度/时间进度介于( 0.8，,1.2) ，代表拨打进度正常；任务的拨打进度/时间进度 小于等于0.8 时，代表拨打进度落后</p>
    <h2>任务的拨打进度和时间进度分别是怎么计算的？</h2>
    <p>任务的拨打进度=已拨打名单/任务的总名单</p>
    <p>任务的时间进度=（自任务开始运行后）已消耗的时间 / 任务总的有效期时长。分子和分母的单位均为小时，已消耗时间，不足1小时按1小时算，
        也包括中间暂停的时间。任务总的有效期时长，取任务有效期的开始和结束时间。</p>
    <h2>客户情绪分类是怎么计算的？</h2>
    <p>客户情绪分类的基础是采用BF输出的文字情绪（22种类型，详见用户手册）分值，系统将原先的22个分类归纳成3个分类：P/N/M，P代表Positive（
        积极地，正面的），N 代表Negative（负面的，消极的），M 代表middle （中间的，中立的）。结合每一轮的对话情绪，再计算出这一通电话的情绪分值。</p>
    <p>计算方式：取一通通话中，每轮对话的情绪值，正向的（P）和中性（M）的进行相加，负向的（N）进行相减，求和后再除以轮数。</p>
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
