FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=2222

EXPOSE 2222

CMD ["npm", "start"]