FROM node:24-alpine

#https://github.com/nodejs/docker-node/issues/2175
RUN apk add --no-cache openssl

RUN npm install -g pm2@5.2.0

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8000

CMD ["pm2-runtime", "npm", "--", "run", "migrate-start:prod"]
