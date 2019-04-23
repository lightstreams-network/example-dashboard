GOPATH = ~/dev-go

run-server:
	npm run app-server:dev:debug

run-dev:
	npm run server:dev:hmr

run-local:
	npm run server:local:hmr

run-remote:
	npm run server:remote:hmr

build-debug:
	npm run build:prod_node:debug

local-deploy:
	rm -rf ~/.coral/dist
	cp -rf dist ~/.coral

docker-deploy:
	rm -rf $(GOPATH)/src/github.com/mikesmo/coral-config/dist
	cp -rf dist $(GOPATH)/src/github.com/mikesmo/coral-config/slave

heroku-deploy:
	git push heroku master

heroku-logs:
	heroku logs --tail

heroku-open:
	heroku open
