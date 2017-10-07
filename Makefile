.PHONY: default up down

default: up

up:
	docker-compose pull;
	docker-compose up -d;

down:
	docker-compose down;
