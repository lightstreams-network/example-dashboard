# fanbase-server

## installation

```
cp .env.sample .env
npm install
npm start
```

## run with docker

```
docker run -it --rm \
    --name srv-server \
    -p 3000:3000 \
    -v "${PWD}/.env.sample:/opt/fanbase/app/.env" \
    -d atlas11/server
```
