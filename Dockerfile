FROM node:14.0.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm run build

COPY . .

CMD [ "node", "dist/index.js" ]