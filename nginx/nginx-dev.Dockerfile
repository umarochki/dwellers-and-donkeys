FROM nginx:alpine
COPY conf/dev.conf /etc/nginx/conf.d/default.conf
COPY conf/redirect.conf /etc/nginx/conf.d/redirect.conf
