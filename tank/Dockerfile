FROM node:12

WORKDIR /build

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY game-module ./

RUN yarn

COPY . .
RUN rm -rf game-module

EXPOSE 3000
CMD yarn run start

