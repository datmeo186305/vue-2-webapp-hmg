##############################
#           BUILD
##############################
FROM node:12-alpine as BUILD

COPY src /usr/src/app/src
COPY public /usr/src/app/public
COPY package.json /usr/src/app/
COPY babel.config.js /usr/src/app/
COPY .eslintrc.js /usr/src/app/
WORKDIR /usr/src/app/
RUN yarn install
RUN yarn build

##############################
#           PRODUCTION
##############################
FROM nginx:1.20.0-alpine

RUN apk add --update coreutils

# Add a user how will have the rights to change the files in code
RUN addgroup -g 1500 nginxusers
RUN adduser --disabled-password -u 1501 nginxuser nginxusers

# Configure ngnix server
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /code
COPY --from=BUILD /usr/src/app/dist .

# Configure web-app for environment variable usage
WORKDIR /
COPY docker_entrypoint.sh .
COPY generate_env-config.sh .
RUN chown nginxuser:nginxusers docker_entrypoint.sh
RUN chown nginxuser:nginxusers generate_env-config.sh
RUN chmod 777 docker_entrypoint.sh generate_env-config.sh
RUN chown -R nginxuser:nginxusers /code
RUN chown -R nginxuser:nginxusers /etc/nginx
RUN chown -R nginxuser:nginxusers /tmp
RUN chown -R nginxuser:nginxusers /var
RUN chmod 777 /code
RUN chmod 777 /tmp
RUN chmod 777 /etc/nginx
RUN chmod 777 /var

USER nginxuser

EXPOSE 8080:8080
CMD ["/bin/sh","docker_entrypoint.sh"]
