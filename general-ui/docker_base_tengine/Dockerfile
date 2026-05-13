FROM harbor.emotibot.com/bfop/centos:base

COPY CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo

WORKDIR /

RUN export TENGINE_VER=tengine-2.3.2 \
    && yum makecache && yum -y update \
    && mkdir /var/log/nginx \
    && yum -y install gcc pcre-devel openssl openssl-devel wget tar \
    && wget http://tengine.taobao.org/download/${TENGINE_VER}.tar.gz \
    && tar zxvf ${TENGINE_VER}.tar.gz \
    && cd /${TENGINE_VER} \
    && ./configure  --http-log-path=/var/log/nginx/access.log \
        --error-log-path=/var/log/nginx/error.log \
        --user=root --group=root \
        --conf-path=/etc/nginx/nginx.conf  \
        --prefix=/etc/nginx \
        --add-module=modules/ngx_http_upstream_dynamic_module \
        --add-module=modules/ngx_http_upstream_check_module \
        --with-http_ssl_module \
        --without-http_memcached_module \
        --with-http_realip_module \
        --with-http_gzip_static_module \
    && make && make install \
    && cd / \
    && rm -rf tengine-* \
    && yum clean all
