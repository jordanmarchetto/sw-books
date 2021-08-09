#!/bin/bash
cd ./server/;
npm install;
npm run docker;
docker-compose up &;

cd ../frontend;
npm install;
npm start;


