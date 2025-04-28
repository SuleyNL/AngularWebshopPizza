@echo off
echo Starting Pizza Deliziosa Backend with PostgreSQL...
echo.

REM Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker is not running! Please start Docker Desktop and try again.
    exit /b 1
)

REM Build and start containers
docker-compose up -d

echo.
if %ERRORLEVEL% neq 0 (
    echo Failed to start containers. Please check the error message above.
) else (
    echo Services started successfully!
    echo.
    echo Backend API: http://localhost:8080
    echo PostgreSQL: localhost:5431 (user: postgres, password: postgres)
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop services: docker-compose down
)

exit /b 0 