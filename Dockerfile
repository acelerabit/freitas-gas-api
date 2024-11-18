FROM node:20.16.0

WORKDIR /app

COPY  package.json yarn.lock ./
COPY . .

RUN yarn

RUN yarn global add @nestjs/cli

RUN yarn build

EXPOSE 5000

CMD [ "node", "build/src/main" ]