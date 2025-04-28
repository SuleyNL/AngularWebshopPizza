# Deploying Pizza Deliziosa to Railway

This guide provides instructions for deploying the Pizza Deliziosa application (both frontend and backend) to [Railway](https://railway.app/).

## Prerequisites

1. A Railway account
2. Railway CLI installed (optional, but recommended)
3. Git

## Deployment Steps

### Step 1: Create a Railway Project

1. Log in to your Railway account
2. Create a new project from the Railway dashboard
3. Name it "pizza-deliziosa" or any name of your choice

### Step 2: Set up PostgreSQL on Railway

1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Wait for the PostgreSQL instance to be provisioned
3. Click on the PostgreSQL service to view connection details
4. Note the connection details (these will be automatically linked to your services)

### Step 3: Deploy the Backend

1. From your Railway project, click "New" → "GitHub Repo"
2. Connect to your GitHub repository or deploy from the local CLI
3. Select the repository containing the Pizza Deliziosa project
4. Specify the service name as "backend"
5. Set the root directory to `/backend`
6. Set the build command to: `./mvnw clean package -DskipTests`
7. Set the start command to: `java -jar target/*.jar`

#### Environment Variables for Backend

Railway will automatically connect the PostgreSQL variables, but you should set:

- `SPRING_PROFILES_ACTIVE=prod`
- `JWT_SECRET=your_secure_jwt_secret_here`
- `ALLOWED_ORIGINS=https://<your-frontend-url>.railway.app`

### Step 4: Deploy the Frontend

1. From your Railway project, click "New" → "GitHub Repo"
2. Connect to your GitHub repository again
3. Specify the service name as "frontend"
4. Set the root directory to `/frontend`
5. Railway will detect the Dockerfile and use it automatically

#### Environment Variables for Frontend

- `API_URL=https://<your-backend-url>.railway.app`

### Step 5: Configure Networking

1. In your Railway project, go to the backend service settings
2. Under "Settings" → "Networking", generate a public domain
3. Do the same for the frontend service
4. Update the `ALLOWED_ORIGINS` in the backend to include the frontend domain
5. Update the `API_URL` in the frontend to point to the backend domain

## Verification

1. Visit your frontend URL to ensure the application loads correctly
2. Check that the frontend can communicate with the backend by:
   - Attempting to log in with the seeded credentials
   - Browsing the product catalog

## Troubleshooting

If you encounter issues:

1. Check the logs for each service in the Railway dashboard
2. Verify environment variables are set correctly
3. Ensure the PostgreSQL connection is working
4. Check CORS settings if the frontend cannot communicate with the backend

## Scaling (Future)

Railway allows easy scaling of your application:

1. You can adjust resources for each service in the service settings
2. Set up auto-scaling in the "Settings" → "Resources" section

## Monitoring

Railway provides basic monitoring:

1. View logs in real-time from the service dashboard
2. Set up alerts by going to "Settings" → "Alerts" 