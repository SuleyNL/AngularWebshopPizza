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

Note: Do not include a trailing slash in the API_URL value.

### How It Works

1. When the Docker container starts, it:
   - Substitutes the API_URL value into the Nginx configuration
   - Updates the compiled JavaScript files to use the correct API endpoint
   - Starts Nginx with the updated configuration

2. API requests are proxied through Nginx to avoid CORS issues, using the format:
   - Frontend makes requests to `/api/*`
   - Nginx proxies these to `${API_URL}/api/*`

### Testing Your Configuration

After deployment, you can verify the configuration is working by:

1. Opening your browser's developer tools
2. Going to the Network tab
3. Loading your application
4. Confirming that API requests are being sent to the correct backend URL

### Troubleshooting

If API requests are failing:

1. Check that the API_URL environment variable is set correctly in Railway
2. Verify that your backend service is running
3. Check that your backend service's CORS settings allow requests from your frontend URL
4. Inspect the network requests in your browser's developer tools to see exact request URLs and error messages

### Local Development

For local development, the application defaults to using `http://localhost:8080` as the API URL. You can change this in `src/environments/environment.ts`. 