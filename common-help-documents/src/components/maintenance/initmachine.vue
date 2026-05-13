<template>
<div class="doc-div">
  <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>机器初始化</h1>
    <h2>空机器为什么需要做初始化</h2>
    <p>空机器准备以后，其运行环境缺少相关配置，无法顺利运行bf2020系统，需要做完初始化工作，使之支持系统部署。</p>
    <h2>服务运行需要安装哪些软件</h2>
    <p>服务部署前，需要安装以下软件，用以支持系统部署</p>
    <p>docker： 最新版本    主要的运行环境</p>
    <p>docker-compose ： 最新版本    主要用来启动DB，监控等服务</p>
    <p>git： 最新版               用来管理部署脚本</p>
    <p>其他工具支持：    如  zip unzip vim python环境等</p>

    <h2>怎么安装swarm集群</h2>
    <p>swarm集群安装以3台机器为例</p>
    <p># database分布式集群全部按照三台设计，所以DB主机群至少三台，swarm无要求，三台机器分别为 hostA， hostB， hostC</p>
    <p># 保证三台机器 主机名 相异</p>
    <p>#组建swarm集群</p>
    <p>hostA:  docker swarm init --advertise-addr [ hostA-ip ]</p>
    <p>hostA:  docker swarm join-token manager</p>
    <p>hostB:  将以上命令的返回结果粘贴执行</p>
    <p>hostC:  将以上命令的返回结果粘贴执行</p>
    <p>#在hostA上查看节点状态，主要查看下HOSTNAME信息，为下步操作做准备</p>
    <p># 在hostA上为每台机器打标签备用 </p>
    <p>docker node update --label-add me=node001 [ HOSTNAME-A ]</p>
    <p>docker node update --label-add me=node002 [ HOSTNAME-B ]</p>
    <p>docker node update --label-add me=node003 [ HOSTNAME-C ]</p>
    <p># 提升其他节点为manager角色</p>
    <p>#docker node promote [ HOSTNAME-B ]</p>
    <p>#docker node promote [ HOSTNAME-C ]           如果错以node身份加入，则需要提升</p>

    <h2>空机器拿到后，需要做哪些初始化，是否能迅速完成</h2>
    <p>机器初始化，主要包含</p>
    <p>1.机器初始化</p>
    <p> a.用来配置系统层的支持</p>
    <p> b.主要包含部署用户，系统内核参数等</p>
    <p>2.运行初始化</p>
    <p> a.主要用来将部署条件添加到系统中</p>
    <p> b.如创建容器挂载目录等</p>
    <p>3.bf2020初始化</p>
    <p> a.此过程在部署中自动完成</p>
    <p> b.主要用来将系统运行数据，写入到DB，minio等</p>
    <p>为快速完成初始化，部署脚本已经集成自动初始化，使用方式为</p>
    <p>sudo deploy.sh</p>
    <p>使用sudo ，或者root权限执行该脚本，将会自动完成初始化</p>

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
