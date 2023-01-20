FROM node:current-alpine as builder
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN ls -la
RUN npm run build

FROM nginx:mainline-alpine
RUN mkdir /www
RUN adduser -D -g 'www' www
# RUN chown -R www:www 
RUN chown -R www:www /www
COPY --from=builder /app/dist /www
COPY --from=builder /app/.env /www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]