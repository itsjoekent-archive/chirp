start-dev-services:
	docker-compose -f services.compose.yml build
	docker-compose -f services.compose.yml up --detach 

stop-dev-services:
	docker-compose -f services.compose.yml down
