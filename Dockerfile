FROM node:10 As build
WORKDIR /app
COPY package.json yarn.lock ./

# Make yarn process packages
RUN yarn install

# Get all files
COPY . .

# Build project
RUN yarn build

# Host project in nginx
FROM nginx
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80 443