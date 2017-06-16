.PHONY: default up down start

default: up

up:
	docker-compose pull;
	docker-compose up -d;

down:
	docker-compose down;

start:
	docker-compose exec api node_modules/.bin/nodemon --config nodemon.json server/start.js
