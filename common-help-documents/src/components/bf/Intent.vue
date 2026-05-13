<template>
     <div class="doc-div">
        <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>意图引擎使用指南</h1>
    <p>意图是指用户与机器人对话的目的，定义、训练和测试这些意图有助于机器人完成复杂的多轮对话。
        用户在表达某个意图时的说法千差万别，我们需要通过补充语料来让机器人学习每个意图的不同表达方式。</p>
    <h1>意图管理</h1>
    <h2>如何创建意图？</h2>
    <p>意图可以通过导入和手动两种方式创建。</p>
    <h2>意图训练</h2>
    <p>新增意图之后，必须进行意图训练以提高机器人识别的正确率。点击意图页面右上角的【意图训练】即可一键完成意图的训练，训练完成后即可生效。</p>
    <h2>意图测试</h2>
    <p>完成测试集编辑、意图模型训练后，可以对意图模型进行测试。系统会记录最近的五次训练意图模型结果及对应语料内容，
        并支持对这五个模型分别进行测试。根据测试结果确定语料对应效果最好的模型是哪一个，并支持恢复到对应的模型。</p>
    <p>未标注任何意图的测试语料：未标注的测试集为期望意图引擎不出结果的语料。一般为系统已有意图的反例语料或者不相关用户表述。</p>
    <h2>如何优化意图语料？</h2>
    <p>在意图调优时，如果发现结果比较理想的情况时，可以将该意图添加记录，作为候选上线意图。保存的测试记录会在意图测试记录里。
        意图语料调整完毕，确定完上线意图版本后，可以选择需要上线的意图模型，点击【还原意图模型与测试集】。在还原意图模型时，线上会实时生效，需要注意操作。</p>
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
