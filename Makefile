start-dev-resources:
	docker-compose -f resources.compose.yml build
	docker-compose -f resources.compose.yml up --detach 

stop-dev-resources:
	docker-compose -f resources.compose.yml down
