#get node image, comes with yarn preinstalled

FROM node:10 As build
WORKDIR /app
COPY package.json yarn.lock ./

#make yarn process packages
RUN yarn install

#get all files
COPY . .

#Build project
RUN yarn build

#host project in nginx
FROM nginx
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80 443