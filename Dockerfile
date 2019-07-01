FROM node:8-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . .

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["start"]
