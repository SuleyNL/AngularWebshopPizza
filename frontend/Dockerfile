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

# Copy built app
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/pizza-webshop-frontend /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tell NGINX to allow environment variables
RUN echo "env API_URL;" >> /etc/nginx/nginx.conf

# No need for sed/envsubst! Just start NGINX normally
CMD ["nginx", "-g", "daemon off;"]