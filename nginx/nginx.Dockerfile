FROM node:12 AS tank_builder

WORKDIR /app

COPY tank/package.json .
COPY tank/yarn.lock .
COPY tank/tsconfig.json .

RUN yarn

COPY tank/gameboard ./gameboard
RUN cd gameboard && npm install && npm run build && cd /app

RUN yarn add file:gameboard

COPY tank/. .
RUN yarn build

FROM nginx:alpine
COPY conf/prod.conf /etc/nginx/conf.d/default.conf
COPY conf/redirect.conf /etc/nginx/conf.d/redirect.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=tank_builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]