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

# Copy hardcoded NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (HTTP)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]