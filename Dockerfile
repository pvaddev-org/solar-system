FROM node:20.19.5-alpine3.21 AS builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci --production

COPY . .

# Stage 2: production image

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /usr/app

ENV NODE_ENV=production \
    MONGO_URI=""

COPY --from=builder /usr/app ./

USER nonroot

EXPOSE 3000

CMD [ "app.js" ]