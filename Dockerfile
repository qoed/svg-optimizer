FROM node:lts-alpine AS builder
USER node
WORKDIR /home/node
COPY --chown=node:node ./package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
RUN ls -l

FROM node:lts-alpine
USER node
WORKDIR /home/node
RUN npm init -y
RUN npm install @iconify/tools
COPY --chown=node:node --from=builder /home/node/build ./build
RUN ls -l
RUN ls -l build
EXPOSE 3000
CMD ["node", "build/index.js"]