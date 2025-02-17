FROM node:22.11.0

WORKDIR /frontend-react

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
