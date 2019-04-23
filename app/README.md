# Lightstreams Front End Web Client

## Local Development Setup

### Requirements

- Docker

- node v6.9.1
- npm 3.10.8
or
- nvm v6.9.1

### Initialise

```
$ npm install
```

### Back-End Client

First get the Backend Client running:

```
$ docker run -d --name device-1 -p 3001:3001 -e LOCALHOST="0.0.0.0:3001" autocontracts/lightstreams-client:v1
$ docker exec -it device-1 lightstreams-client run --logs=true --log_level=info
```

### Running

```
$ npm run server:local
```

With 'Hot Module Replace':

```
$ npm run server:local:hmr
```

### Redux Tools

In Chrome browser install the extension "Redux DevTools"

See: https://github.com/zalmoxisus/redux-devtools-extension