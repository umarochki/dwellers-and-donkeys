FROM node:12 AS tank_builder

WORKDIR /app

COPY tank/package.json .
COPY tank/yarn.lock .
COPY tank/tsconfig.json .

RUN yarn

COPY tank/game-module ./game-module
RUN yarn add file:game-module

COPY tank/. .
RUN yarn build

FROM nginx:alpine
COPY conf/prod.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=tank_builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]