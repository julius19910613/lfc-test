<template>
    <div class="doc-div">
      <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
        <h1>质检通话列表</h1>
        <h2>手动上传支持哪些格式的文件？</h2>
        <p>支持WAV、MP3的录音文件和xlsx的文本对话。</p>
        <h2>如何查看录音文件的质检结果？</h2>
        <p>点击列表中对应录音文件的“查看”，可以进入对应文件的质检结果详情，查看质检分数及质按规则质检结果详情。</p>
        <h2>如何查找违规点？</h2>
        <p>在质检结果详情中，点击右下角波形图上的红色圆点，可以自动同步到对话中对应的违规点，并对违规内容进行高亮显示。</p>
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
