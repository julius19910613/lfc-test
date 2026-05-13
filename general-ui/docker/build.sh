#!/bin/bash
# echo "npm run build start ==========!"
# npm run build
# echo "npm run build over ==========!"

GIT_HEAD=$(git rev-parse --short=8 HEAD)
GIT_DATE=$(git log HEAD -n1 --pretty='format:%cd' --date=format:'%Y%m%d-%H%M')

REPO=harbor.emotibot.com
PROJECT=bfop
CONTAINER=admin-ui
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

echo ${IMAGE_NAME}
