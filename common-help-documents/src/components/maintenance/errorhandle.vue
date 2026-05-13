<template>
<div class="doc-div">
  <div>
    <!-- 一级标题写在h1里面，二级标签写在h2里面，正文内容写在p里面， -->
    <h1>常见错误处理</h1>
    <h2>nginx做分流代理时，遇到请选择机器人或弹出未知身份的请求问题</h2>
    <p>解决办法：在最外层nginx中添加underscores_in_headers on</p>

    <h2>solr内存满新旧版本解决办法</h2>
    <p>新版本在</p>
    <p>vi /docker-entrypoint-initdb.d/set-heap.sh &更换SOLR_HEAP的大小</p>
    <p>旧版本在</p>
    <p>vi /opt/solr/bin/solr.in.sh &更换SOLR_HEAP的大小</p>
    <p>不管新版本还是旧版本，改好后都需要重启下solr docker restart solr</p>

    <h2>安装cuda时遇到nouveau没有被禁用的解决办法</h2>
    <p>解决办法：-----禁用nouveau方法</p>
    <p>Disable nouveau</p>
    <p>$ echo -e "blacklist nouveau\nblacklist
       lbm-nouveau\noptions nouveau modeset=0\nalias nouveau off\nalias
        lbm-nouveau off\n" | sudo tee /etc/modprobe.d/blacklist-nouveau.conf</p>
    <p>$ echo options nouveau modeset=0 | sudo tee -a /etc/modprobe.d/nouveau-kms.conf</p>
    <p>$ sudo update-initramfs -u</p>
    <p>------$ lsmod | grep nouveau 执行该命令后没有出现结果，说明nouveau已禁用</p>
    <p>$ sudo reboot</p>

    <h2>安装cuda9.0时遇到内核不兼容问题</h2>
    <p>目前cuda9.0只兼容ubuntu16.04中4.4.0.*的内核</p>

    <h2>外呼任务突然停止，页面显示任务进行中</h2>
    <p>目可能原因：当天线路呼叫数目到顶了，要修改下db的相关配置项</p>
    <p>use outbound;</p>
    <p>select * from callout_phone;</p>
    <p>update callout_phone set max_call=99999 where id=1;</p>

    <h2>api对接时，kg-dal日志，提示序列化失败，mysql表不存在</h2>
    <p>可能原因可能是序列化数据格式错误，导致报表不存在。</p>
    <p>如果端口通过haproxy代理，超时时间设置过短，则可能出现此问题</p>
    <p>timeout client 1d # 这个时间默认是50秒左右，数据传输过程达到这个值就会断开</p>
    <p>timeout server 1d # 导致传输数据中断，服务端收到了不完整的数据</p>


    <h2>a在mysqlmgr集群下，某节点脱离集群</h2>
    <p>每个mysql有自动加入重试机制，一般情况下，重启此mysql容器即可</p>


 <h2>在mysqlmgr集群下，全部节点脱离集群</h2>
    <p>如非数据脑裂场景时的修复</p>
    <p>找一台，注释mgrcheck.py 的main方法，使之不运行，并重启这个docker</p>
    <p>此时重启后，该容器的mgrcheck.py不会运行</p>
    <p>此时按照mgrinit.sh 创建mgr集群，此时自己是online状态</p>
    <p>在启动一个窗口，登录进容器，手动修改mgrcheck.py 将注释取消</p>
    <p>手动 运行一下check  python mgrcheck.py</p>
    <p> 此时，本机online   mgrcheck.py 被手动执行，并卡住不动，不能退出，不要操作他</p>
    <p> 第二台第三台重启，此时全部online</p>

   <h2>mysql产生binlog过多，如何清理</h2>
   <p> mysql binlog不能手动删除，以免引起故障，可以登录mysql，执行set global expire_logs_days=3;只保留三天</p>

    <h2>mdocker 无法拉取镜像，或无法导入，报空间已满，但是硬盘还有盈余</h2>
    <p>docker 某些版本的默认配置中，容器默认devicemapper空间107G ，pool空间10G，metadata数据2G，Base sise 10G 容器可占用大小</p>
    <p>容器默认数据目录/var/lib/docker 所有数据在这里存贮，需要考虑容器过大后的处理方式</p>
    <p>修改以上空间大小配置</p>
    <p>vim /lib/systemd/system/docker.service
       以下新增参数表示，数据目录为/data/dockerbfop 块空间大小300G metadata 20G 容器运行大小20G</p>
    <p>ExecStart=/usr/bin/dockerd --graph /data/dockerbfop
       --storage-opt dm.loopdatasize=300G --storage-opt
        dm.loopmetadatasize=20G --storage-opt dm.basesize=20G</p>
    <p>对于1.12版本 如果不生效的话，就手动使用以上参数启动一下</p>

    <h2>docker-compose启动时网络端点已存在</h2>
    <p># 报错提示如下</p>
    <p>ERROR： for msg-admin Cannot
       start service msg-admin: endpoint with name msg-admin already exists</p>
    <p># 原因解析，容器已经被删除，network没有删除，或者不能自动替换</p>
    <p>在这个yaml或者容器使用的网络中，删除报错容器的记录</p>
    <p>docker network disconnect --force docker-compose-base_default msg-admin</p>

    <h2>swarm怎么重启一个服务</h2>
    <p>docker service update --force --update-parallelism 1 --update-delay 30s 【服务名称】</p>
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
