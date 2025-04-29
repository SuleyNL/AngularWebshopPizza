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

# Build the Angular app with production settings
RUN npm run build -- --configuration production


### STAGE 2: Serve with Nginx ###
FROM nginx:alpine

# Remove default NGINX files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy the startup script
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

# Environment variable for API URL (default for local testing)
ENV API_URL=http://localhost:8080

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Expose port 80 (HTTP)
EXPOSE 80

# Start NGINX using the startup script
CMD ["/start-nginx.sh"]