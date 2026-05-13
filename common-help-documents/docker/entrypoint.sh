#!/bin/bash

cd /etc/nginx

rm nginx.conf

envsubst '
' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

nginx -g 'daemon off;'
