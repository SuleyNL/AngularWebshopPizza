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

# Install envsubst (for replacing ${API_URL})
RUN apk add --no-cache gettext

# Copy built app
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx config (with ${API_URL} placeholder)
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Replace ${API_URL} at runtime and start NGINX
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]