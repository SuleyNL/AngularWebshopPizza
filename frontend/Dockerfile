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

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from build stage
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create variable for API URL that can be set at runtime
ENV API_URL=http://backend:8080

# Expose port 80
EXPOSE 80

# When the container starts, replace API_URL in the JS files with the value from environment variable
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]