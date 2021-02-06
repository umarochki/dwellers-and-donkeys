FROM nginx:alpine
COPY conf/dev.conf /etc/nginx/conf.d/default.conf