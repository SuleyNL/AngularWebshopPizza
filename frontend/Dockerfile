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

# Install gettext for envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy original nginx config (with placeholder)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# At runtime: substitute variables and start nginx
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]