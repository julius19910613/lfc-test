<template>
<div class="doc-div">
    <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>日志查看</h1>
    <h2>程序的运行日志都搜集在哪儿</h2>
    <p>日志分为两种类型，对话日志与程序日志</p>
    <p>对话日志又有两种搜集存储类型，一种是由docker log driver搜集(默认)，一种是通过flunted搜集</p>

    <h2>如何查看对话日志</h2>
    <p>登录系统以后，选择自己的机器人，在机器人平台下，选择对话数据即可在线查看</p>

    <h2>如何查看log driver日志</h2>
    <p>单机版查看命令： docker logs -f --tail 200 【容器名称】</p>
    <p>集群版查看命令： docker service logs --tail 200 【服务名称】</p>
    <p>也可以通过脚本查看，命令为：./deploy.sh log  根据列表选择即可</p>
    <p>注：服务名称通过docker service ls 获取 </p>
    <p>       启动失败的服务，则会打印失败原因。非程序启动运行日志</p>

    <h2>如何查看flunted形式搜集的日志</h2>
    <p>该类型日志，搜集形式为，docker-->flunted-->elasticsearch–>kibna</p>
    <p>所以可以直接登录kibana查看，地址：ip:5062，kibana的使用不再赘述</p>
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
