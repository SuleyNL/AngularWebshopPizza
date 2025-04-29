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

# Remove default NGINX files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Environment variable for API URL
ENV API_URL=http://localhost:8080

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Expose port 80 (HTTP)
EXPOSE 80

# Start NGINX with environment variable substitution
CMD ["/bin/sh", "-c", "envsubst '$$API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && sed -i \"s|/api|${API_URL}/api|g\" /usr/share/nginx/html/main*.js && nginx -g 'daemon off;'"]