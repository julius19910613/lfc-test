#!/bin/bash
set -e

export NAMESERVER=`cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' '`

env
echo ${ADMIN_CONSUL_URL}

curl ${ADMIN_CONSUL_URL}/v1/agent/service/register -X PUT -i -H "Content-Type:application/json" -d '{"ID":"bf","Name":"bf","Tags":[],"Address":"admin","Port":81,"EnableTagOverride":false}'

supervisord -c /etc/supervisord.conf
