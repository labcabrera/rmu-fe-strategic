#!/bin/bash

docker stop rmu-fe-strategic

docker rm rmu-fe-strategic

docker rmi labcabrera/rmu-fe-strategic:latest

docker build -t labcabrera/rmu-fe-strategic:latest .

docker run -d -p 8082:8082 \
  --network rmu-network \
  --name rmu-fe-strategic \
  -h rmu-fe-strategic \
  -e API_STRATEGIC_URL='http://rmu-api-strategic:3002/v1' \
  labcabrera/rmu-fe-strategic:latest

docker logs -f rmu-fe-strategic
