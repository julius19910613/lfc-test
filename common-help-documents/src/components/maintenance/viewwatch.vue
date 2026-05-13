<template>
<div class="doc-div">
    <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>查看监控</h1>
    <h2>如何查看系统是否健康</h2>
    <p>bf2020安装时，默认会安装zabbix监控系统(可选不装)，并自动配置好监控，可以直接登录查看</p>
    <p>地址：IP:10053 、 账号：Admin、 密码：zabbix</p>

    <h2>监控系统都有哪些数据，需要重点关注哪些</h2>
    <p>服zabbix除了监控机器的硬件资源，如cpu 百分比，load值，内存，swap，硬盘空间等</p>
    <p>在web监控中，还有各个项目的子功能模块监控，可以重点关注</p>
    <p>docker-compose ： 最新版本    主要用来启动DB，监控等服务</p>
    <p>登录zabbix后，选择 检测–>最新数据，在主机中选择既可以，主机组是 zhujian</p>

  </div>

</div>

</template>

<script>
export default {
  path: 'test',
  name: 'test',
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
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
h2 {
  display: block;
  font-size: 16px;
  margin-block-start: 0.83em;
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
</style>
