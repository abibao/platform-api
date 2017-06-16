.PHONY: default up down test start

default: up

up:
	docker-compose pull;
	docker-compose up -d;

down:
	docker-compose down;

test:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;

start:
	docker-compose exec api node_modules/.bin/nodemon --config nodemon.json server/start.js
