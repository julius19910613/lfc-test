<template>
    <div class="doc-div">
      <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
   <h1>系统设置使用指南</h1>
    <p>包含警示设置、分机号设置、场景设置三个功能</p>
    <h2>警示设置</h2>
    <p>客可设置助手客户端页面【通话状态】中的：语速警示阈值及通话状态警示话术，设置/修改完成后立即生效。</p>
    <h2>分机号设置</h2>
    <p>仅用于使用软电话演示助手时，配置软电话拨打的分机号。企业生产环境的产品版本不包含此功能。</p>
    <h2>场景设置</h2>
    <p>仅用于demo演示设置不同行业场景，企业生产环境的产品版本不包含此功能。</p>
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
