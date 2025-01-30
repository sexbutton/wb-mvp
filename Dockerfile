FROM node:16

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install --include=dev
RUN npm install -g knex

RUN npx tsc

EXPOSE 3000

CMD ["sh", "-c", "knex migrate:latest && node dist/index.js"]