FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=2222

EXPOSE 2222

CMD ["npm", "run", "prod"]