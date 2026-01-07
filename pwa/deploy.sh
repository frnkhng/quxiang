#!/bin/bash
set -e

echo "🚀 Deploying PWA Frontend to qxy.oike.io..."

# Build frontend
echo "📦 Building frontend..."
npm install
npm run build

# Deploy to server
echo "📤 Uploading to server..."
SERVER="frnkhng@oike.io"
REMOTE_PATH="/var/www/qxy.oike.io/pwa"

# Upload dist files
scp -r dist/* $SERVER:~/qxy-pwa-temp/

# Upload nginx config
scp qxy.oike.io $SERVER:~/qxy-pwa-temp/

# Execute remote commands
ssh $SERVER << 'ENDSSH'
  # Copy files to web root
  sudo rm -rf /var/www/qxy.oike.io/pwa/*
  sudo cp -r ~/qxy-pwa-temp/* /var/www/qxy.oike.io/pwa/
  
  # Update nginx config
  sudo cp ~/qxy-pwa-temp/qxy.oike.io /etc/nginx/sites-available/qxy.oike.io
  
  # Test and reload nginx
  sudo nginx -t && sudo systemctl reload nginx
  
  # Cleanup
  rm -rf ~/qxy-pwa-temp
  
  echo "✅ Frontend deployed successfully!"
ENDSSH

echo "🌐 Frontend live at: https://qxy.oike.io"
