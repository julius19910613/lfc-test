# Step 1
FROM harbor.emotibot.com/bfop/general-node-base:d3289be1-20200115-0735 AS build-env

# Build Context should be repo's top level
# ADD . build

ADD build build/build
ADD config build/config
ADD static build/static
ADD src build/src
ADD .babelrc .postcssrc.js .eslintrc.js .eslintignore login.html index.html version.html package.json build/
ADD docker/health_check.sh build/health_check.sh
RUN cd build && npm install --production && npm run build
#ADD dist build/dist

# Step 2

FROM harbor.emotibot.com/bfop/base_tengine:fb186ee7-20200103-0349
RUN yum makecache --disableplugin=fastestmirror \
    && yum install --disableplugin=fastestmirror -y epel-release \
    && yum install --disableplugin=fastestmirror -y cronie gettext supervisor\
    && yum clean all \
    && rm -rf /var/cache/yum

# CentOS has build-in envsubst
# RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.0.0/envsubst-`uname -s`-`uname -m` -o envsubst \
#     && chmod +x envsubst \
#     && mv envsubst /usr/bin

COPY /docker/conf/supervisord.conf /etc/supervisord.conf
COPY /docker/conf/nginx.conf.template /etc/nginx/nginx.conf.template

WORKDIR /build/dist

COPY --from=build-env /build/dist/index.html /build/dist/
COPY --from=build-env /build/dist/login.html /build/dist/
COPY --from=build-env /build/dist/static /build/dist/static

COPY /docker/entrypoint.sh entrypoint.sh
COPY /docker/run_nginx.sh run_nginx.sh
COPY /docker/kill-supervisor.sh kill-supervisor.sh

# ARG ARG_build_env
# RUN echo "${ARG_build_env}" > /build/dist/uiversion.html

HEALTHCHECK CMD curl -f http://localhost:81/ || exit 1
ENTRYPOINT ["./entrypoint.sh"]
