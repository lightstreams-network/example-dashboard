FROM node:alpine

RUN apk update && apk upgrade && apk add bash && apk add git && apk add openssh-client

WORKDIR /opt/fanbase/app

COPY package.json ./

RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python && \
    npm install --quiet node-gyp -g &&\
    npm install --quiet && \
    apk del native-deps

# Bundle app source
COPY . .

ENV user=node NODE_PATH=.

RUN chown $user:$user --recursive .

USER $user

EXPOSE 3000

CMD node ./bin/www
