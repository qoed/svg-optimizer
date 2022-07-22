FROM node:lts-alpine
USER node
WORKDIR /home/node
COPY --chown=node:node ./package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build

FROM node:lts-alpine
USER node
WORKDIR /home/node
COPY --from=0 --chown=node:node /home/node/package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=0 --chown=node:node /home/node/build ./build
COPY --from=0 --chown=node:node /home/node/.env ./
EXPOSE 3000
CMD ["node", "build/index.js"]