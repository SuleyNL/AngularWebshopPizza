# Pizza Deliziosa Backend

This is the backend service for the Pizza Deliziosa web application, built with Spring Boot.

## Running with Docker Compose

The easiest way to run the backend service is using Docker Compose, which will start both the Spring Boot application and a PostgreSQL database in containers.

### Prerequisites

- Docker and Docker Compose installed on your system
- Port 8080 available for the backend API
- Port 5431 available for PostgreSQL (mapped from internal 5432)

### Quick Start

#### Windows
Simply run the provided batch script:
```
run-docker.bat
```

#### Linux/macOS
Make the script executable and run it:
```
chmod +x run-docker.sh
./run-docker.sh
```

### Manual Steps

1. Navigate to the backend directory:
   ```
   cd /path/to/AngularWebshopPizza/backend
   ```

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. The services will be available at:
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5431 (username: postgres, password: postgres)

4. View logs:
   ```
   docker-compose logs -f
   ```

5. Stop the services:
   ```
   docker-compose down
   ```

### Configuration

The PostgreSQL database is configured with:
- Database name: pizza_deliziosa
- Username: postgres
- Password: postgres
- External port: 5431 (mapped to internal 5432)

The Spring Boot application automatically connects to PostgreSQL using the docker profile settings.

### Persistence

The PostgreSQL data is persisted in a Docker volume called `postgres_data`. This ensures your data remains intact even when containers are removed.

To reset the database and start fresh:
```
docker-compose down -v
```

### Troubleshooting

If you encounter any issues:

1. Check that no other services are running on ports 8080 or 5431
2. Ensure Docker service is running
3. View container logs for detailed error messages:
   ```
   docker-compose logs backend
   docker-compose logs postgres
   ```

## Development Without Docker

If you prefer to run the application without Docker:

1. Install PostgreSQL on your local machine and create a database called `pizza_deliziosa`
2. Update `src/main/resources/application.properties` if your PostgreSQL is not running on the default port
3. Run the application using:
   ```
   ./mvnw spring-boot:run
   ``` 