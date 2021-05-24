FROM node:12

WORKDIR /build

# Tank deps
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn

COPY gameboard ./gameboard
RUN cd gameboard && npm install && npm start && cd /build

# Game-module deps
RUN yarn add file:gameboard

COPY . .
RUN rm -rf gameboard

CMD yarn run start
