#!/bin/bash
cd ./server/;
echo "installing modules";
npm install;
echo "building docker image";
npm run docker;
echo "launching backend";
docker-compose up &

cd ../frontend;
echo "installing frontend modules";
npm install;
echo "starting frontend";
npm start;


