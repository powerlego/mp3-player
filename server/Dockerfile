FROM node:current-alpine
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
COPY . .
EXPOSE 8000
RUN npm run build
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]