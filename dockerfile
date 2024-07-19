FROM node:20.13-alpine AS BaseImage

WORKDIR /app/

#args from command line
ARG http_proxy
ARG https_proxy

#set env proxy
ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}

RUN apk add --no-cache libc6-compat bash
COPY package.json ./
COPY dist ./dist/
RUN npm i --global serve npm-run-all

#clear proxy not included to image
ENV http_proxy=
ENV https_proxy=

EXPOSE 4210


CMD ["npm","run","start:prod"]
