# IMPORTANT: #
# Any change to this file should be also applied to Dockerfile.INT and Dockerfile.QA
# When update node ---> remember to update all .sh files
FROM node:12.16.2 As build
WORKDIR /app
COPY package.json yarn.lock ./

# Download dependencies
RUN yarn

# Copy source files
COPY . .

# Run tests and verify other requirements
RUN yarn verify

# Build project
RUN yarn build

# Host project in nginx
FROM nginx:1.17.10-alpine
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80 443
