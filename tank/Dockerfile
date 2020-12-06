FROM node:12

WORKDIR /build

# Tank deps
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn

# Game-module deps
COPY game-module ./game-module
RUN yarn add file:game-module

COPY . .
RUN rm -rf game-module

CMD yarn run start
