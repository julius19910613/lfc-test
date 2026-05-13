#!/bin/bash

REPO=harbor.emotibot.com
PROJECT=bfop
CONTAINER=base_tengine
DATE=$(git log HEAD -n1 --pretty='format:%cd' --date=format:'%Y%m%d-%H%M')
ARG_GIT_TAG=$(git rev-parse --short=8 HEAD)
TAG="$ARG_GIT_TAG-$DATE"
export IMAGE_NAME="$REPO/$PROJECT/$CONTAINER:$TAG"
export BUILD_ROOT=$(git rev-parse --show-toplevel)

docker build -f ./Dockerfile -t ${IMAGE_NAME} .
