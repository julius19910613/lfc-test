<template>
  <div class="doc-div">
    <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
<h1>语音平台使用指南</h1>
    <p>竹间机器人平台（Bot Factory），提供语音识别 （Automated Speech Recognition, ASR）
        及语音合成 (Text To Speech, TTS) 两种服务。提供多模态的交互能力。可以应用在电话机器人、质检机器人、坐席助手、销售助手。</p>
 <h1>语音识别</h1>
    <p>提供在线语音识别测试。点击开始录音就可以测试，在三十秒内说话会被实时转写出文字。测试端需要有麦克风收音的设备。</p>
  <p>功能及参数包含：</p>
    <p> 识别语言：支持中文普通话</p>
    <p>标准服务接口：支持 HTTP 及 MRCP 接口</p>
    <p>识别速度：实时识别延迟时间小于1秒，离线识别实时率 0.4</p>
    <p>识别率：16K 采样率模型，正确率可超过9成5。</p>
    <p>模型优化：项目开发阶段能针对使用场景进行优化，提高使用场景的语音识别效果，上线使用后也可以更新语言模型学习新词。</p>
    <p>范例：</p>
    <p>可以在点击开始录音后，说出：</p>
    <p>语音识别支持中文普通话，识别延迟时间小于1秒。正确率可超过95。</p>
    <p>项目开发阶段可以针对使用场景进行优化。</p>
    <h1>语音合成</h1>
    <p>提供在线语音合成测试。输入一段文字，点击合成按钮，即可体验流畅自然的语音合成服务。</p>
    <p>范例：</p>

    <p>可以在输入框贴上下面文字，点击合成后会自动播放，也可以下载语音：</p>


<p>语音识别支持中文普通话，识别延迟时间小于1秒。正确率可超过95。</p>

    <p>项目开发阶段可以针对使用场景进行优化。</p>
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
