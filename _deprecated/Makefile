NAME   := fanbase/server
TAG    := $$(git log -1 --pretty=%h)
IMG    := ${NAME}:${TAG}
IMG_LATEST := ${NAME}:latest

REGISTRY=eu.gcr.io
PROJECT_ID=fanbase-server-206110

all: docker-build tag tag-registry

publish: all push

docker-build:
	docker build -t ${NAME} .

tag:
	docker tag ${NAME} ${IMG}

tag-registry:
	docker tag ${NAME} ${REGISTRY}/${PROJECT_ID}/${NAME}

push:
	docker push ${REGISTRY}/${PROJECT_ID}/${NAME}
