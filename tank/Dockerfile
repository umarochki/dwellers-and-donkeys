FROM node:12

WORKDIR /build

COPY game-module ./game-module
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn

COPY . .
RUN rm -rf game-module

CMD yarn run start
