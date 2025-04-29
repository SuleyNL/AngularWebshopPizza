# Configuring the Frontend for Railway Deployment

## API URL Configuration

The frontend application is designed to be configurable for different deployment environments. The key configuration needed is the backend API URL.

### Railway Environment Variables

In your Railway project for the frontend service, set the following environment variable:

```
API_URL=https://your-backend-service-url
```

For example:
```
API_URL=https://angularwebshoppizza-production.up.railway.app
```

Notes:
1. The application will automatically handle trailing slashes, so you don't need to include one.
2. Do NOT include `/api` at the end of the URL - the application handles this internally.
3. Include the port (like `:8080`) only if your backend service requires it.

### How It Works

Our configuration system:
1. Uses a relative `/api` path in the Angular application
2. Configures Nginx to proxy requests from `/api/*` to your backend
3. Automatically handles URL formatting to avoid common issues

### Validation on Startup

The container includes a startup script that:
1. Validates the API_URL format
2. Adds trailing slashes if needed
3. Removes redundant `/api` paths if accidentally included
4. Outputs the final URL configuration to the logs for verification

### Testing Your Configuration

After deployment, you can verify the configuration is working by:

1. Opening your browser's developer tools
2. Going to the Network tab
3. Loading your application
4. Confirming that API requests are being sent to the correct backend URL

### Troubleshooting

If API requests are failing:

1. Check container logs to see the actual API_URL being used
2. Verify that your backend service is running and accessible
3. Ensure your backend service's CORS settings allow requests from your frontend URL
4. Check that the URL format is correct (protocol, hostname, port if needed)

### Local Development

For local development, the application defaults to using `http://localhost:8080` as the API URL. You can change this in `src/environments/environment.ts`. 