FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npx sequelize-cli db:migrate

EXPOSE 3000

CMD ["node", "dist/main"]