# FROM node:alpine as builder

# ARG WEB_HOST
# ARG WEB_PORT
# ARG WEB_PATH

# COPY ./web /app/web
# COPY ./shared /app/shared
# COPY ./tsconfig.json /app/

# RUN cd /app/shared && npm i && npx -p typescript tsc && \
#     cd /app/web && printenv | grep "WEB" > .env && npm i && npm run build && mv ./dist /

# ==============================================================================

FROM nginx:alpine

RUN adduser -D -g 'www' www && mkdir -p /www /var/lib/nginx && \
    chown -R www:www /var/lib/nginx /var/log/nginx /www

# https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration

COPY client.conf /etc/nginx/nginx.conf
COPY client /www

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
