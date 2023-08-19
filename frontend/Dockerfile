FROM node:18.17.1

RUN apt-get update && yarn global add @vue/cli

RUN mkdir -p /frontend
WORKDIR /frontend

COPY package*.json ./
RUN yarn install
COPY . .

CMD ["yarn", "run", "serve"]
