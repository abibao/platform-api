.PHONY: default up down tests

default: up

up:
	docker-compose pull;
	docker-compose up -d;

down:
	docker-compose down;

tests:
	yarn run test:standard;
	yarn run test:coverage;
