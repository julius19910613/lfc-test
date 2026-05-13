#!/bin/bash

GIT_HEAD=$(git rev-parse --short=8 HEAD)
GIT_DATE=$(git log HEAD -n1 --pretty='format:%cd' --date=format:'%Y%m%d-%H%M')

# Use docker-reg for now, it will change to harbor after harbor usage is confirmed
REPO=harbor.emotibot.com
PROJECT=bfop
CONTAINER=general-node-base
TAG=${GIT_HEAD}-${GIT_DATE}

IMAGE_NAME="${REPO}/${PROJECT}/${CONTAINER}:${TAG}"
CONTAINER_NAME=${CONTAINER}

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_CONTEXT="${DIR}/.."

echo ${DIR}
echo ${BUILD_CONTEXT}

cmd="docker build -f Dockerfile -t ${IMAGE_NAME} ${BUILD_CONTEXT}"
echo ${cmd}
eval ${cmd}