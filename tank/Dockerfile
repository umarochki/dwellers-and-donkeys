FROM node:12

WORKDIR /build

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn
COPY . .
EXPOSE 3000
CMD yarn run start

