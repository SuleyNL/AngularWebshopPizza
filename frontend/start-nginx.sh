#!/bin/sh
set -e

# Validate and normalize API_URL
if [ -z "$API_URL" ]; then
  echo "WARNING: API_URL is not set. Using default http://localhost:8080"
  API_URL="http://localhost:8080"
fi

# Ensure API_URL ends with a trailing slash
if ! echo "$API_URL" | grep -q '/$'; then
  API_URL="${API_URL}/"
fi

# Ensure API_URL doesn't end with /api/
if echo "$API_URL" | grep -q '/api/$'; then
  # Remove /api/ from the end
  API_URL=$(echo "$API_URL" | sed 's|/api/$|/|')
elif echo "$API_URL" | grep -q '/api$'; then
  # Replace /api with /
  API_URL=$(echo "$API_URL" | sed 's|/api$|/|')
fi

echo "Using API_URL: $API_URL"
export API_URL

# Process the nginx template
envsubst '$$API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;' 