
FROM node:18.19.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json .
RUN npm install
COPY src/ .
COPY . .
EXPOSE 3000
CMD [ "npm", "start"]