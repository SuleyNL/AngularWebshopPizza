### STAGE 1: Build Angular app ###
FROM node:slim AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the Angular app
RUN npm run build


### STAGE 2: Serve with Nginx ###
FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy built app
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Startup command
CMD ["sh", "-c", "export ESCAPED_API_URL=$(echo $API_URL | sed 's/[\/&]/\\&/g'); sed \"s/http:\/\/API_URL_PLACEHOLDER/$ESCAPED_API_URL/g\" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]