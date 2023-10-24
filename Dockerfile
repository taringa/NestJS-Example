FROM node:16-slim as build

ARG COMMIT_SHA=<not-specified>

WORKDIR /build-dir

COPY .npmrc .
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN rm -f .npmrc

RUN npm run build

RUN echo "nestjs-example: $COMMIT_SHA" >> ./commit.sha

########################################################################################################################

FROM node:16-slim

LABEL maintainer="facundo.gonzalez@taringa.net" \
      name="nestjs-example" \
      description="NestJS Example with scaffold to start coding using NestJS" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.1.0"

ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV SERVICE_PREFIX=/
ENV HTTP_PORT=3000

WORKDIR /home/node/app

COPY --from=build /build-dir ./

RUN ls /home/node/app/dist
RUN ls /home/node/app

USER node

CMD ["npm", "run", "start:prod"]
