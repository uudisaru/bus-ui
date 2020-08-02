#### Build image

FROM node:12-alpine AS BUILD_IMAGE

# couchbase sdk requirements
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY . .

# install dependencies
RUN npm install

# Set API URL from build-time argument
ARG API_URL=http://bus-location-stream

# build application
RUN npm run build


#### Runtime

FROM nginx:1.19.1-alpine

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/public/ /usr/share/nginx/html

EXPOSE 80