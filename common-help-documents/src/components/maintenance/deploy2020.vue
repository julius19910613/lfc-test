<template>
  <div class="doc-div">
      <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>使用脚本部署bf2020产品</h1>
    <h2>使用什么方式部署管理</h2>
    <p>竹间有提供部署脚本，一般的部署与维护，都可以使用脚本完成</p>
    <h2>脚本主要可以做哪些事情</h2>
    <p>为方便快速部署，脚本已集成bf2020运行中的所有维护，可使用 ./deploy.sh -h 查看完整用法，主要功能如下</p>
    <p> 1.安装DB集群</p>
    <p> 2.安装DB单机版</p>
    <p> 3.初始化DB数据</p>
    <p> 4.部署各个模块</p>
    <p> 5.对某个DB的维护</p>
    <p> 6.对某个模块的维护</p>
    <p> 7.单机部署支持</p>
    <p> 8.swarm集群部署支持</p>
    <p> 9.k8s集群部署支持</p>

    <h2>如何使用脚本进行bf2020产品部署</h2>
    <p>以三台服务器为例，部署swarm集群，前提条件，已经完成swarm集群初始化配置</p>
    <p># 三台机器都需要修改主机IP变量，如下</p>
    <p>hostA  hostB   hostC  ：</p>
    <p>pwd</p>
    <p>    /home/deployer/emotibot_deploy/dev.env   （git主目录）</p>
    <p>cat host.env</p>
    <p>    DB_HOST_1=10.0.0.125</p>
    <p>    DB_HOST_2=10.0.0.126</p>
    <p>    DB_HOST_3=10.0.0.127</p>
    <p># 创建DB集群</p>
    <p>hostA: </p>
    <p>        cd /home/deployer/emotibot_deploy/</p>
    <p>        ./deploy.sh     # 执行脚本</p>
    <p>            自检后自动退出</p>
    <p>hostB:</p>
    <p>        cd /home/deployer/emotibot_deploy/</p>
    <p>        ./deploy.sh     # 执行脚本</p>
    <p>            自检后自动退出</p>
    <p>hostC:</p>
    <p>        cd /home/deployer/emotibot_deploy/</p>
    <p>        ./deploy.sh     # 执行脚本</p>
    <p>            自检后自动退出</p>
    <p>hostA:</p>
    <p>         enter    # 开始安装应用模块</p>
    <p>          在此输入要安装的功能序号即可 </p>
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
