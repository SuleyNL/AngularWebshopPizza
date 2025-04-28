#!/bin/bash

echo "Starting Pizza Deliziosa Backend with PostgreSQL..."
echo

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running! Please start Docker and try again."
    exit 1
fi

# Build and start containers
docker-compose up -d

echo
if [ $? -ne 0 ]; then
    echo "Failed to start containers. Please check the error message above."
else
    echo "Services started successfully!"
    echo
    echo "Backend API: http://localhost:8080"
    echo "PostgreSQL: localhost:5431 (user: postgres, password: postgres)"
    echo
    echo "To view logs: docker-compose logs -f"
    echo "To stop services: docker-compose down"
fi 