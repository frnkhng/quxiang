# Nginx configuration for qxy.oike.io
# PWA application with FastAPI backend

server {
    listen 80;
    listen [::]:80;
    server_name qxy.oike.io;
    
    # Redirect HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name qxy.oike.io;
    
    # SSL Certificates for qxy.oike.io
    ssl_certificate /etc/letsencrypt/live/qxy.oike.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/qxy.oike.io/privkey.pem;

    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Global timeouts for file uploads / API
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    client_max_body_size 50M;
    client_body_timeout 60s;
    
    # Security headers (global)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # ============================================
    # Vue PWA (quxiang frontend)
    # Serves all routes through Vue Router
    # ============================================
    location / {
        root /var/www/qxy.oike.io/pwa;
        try_files $uri $uri/ /index.html;
        
        # Disable caching for index.html and service worker
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        location = /sw.js {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        location = /manifest.webmanifest {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # ============================================
    # FastAPI backend reverse proxy
    # Serves: /auth/*, /profiles/*, /records/*, /ai/*, /uploads/*
    # ============================================
    location ~ ^/(auth|profiles|records|ai|uploads)/ {
        proxy_pass http://127.0.0.1:8010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # File upload support for profile images and records
        client_max_body_size 50M;
    }
    
    # ============================================
    # Gzip compression
    # ============================================
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # ============================================
    # Logs
    # ============================================
    access_log /var/log/nginx/qxy.oike.io.access.log;
    error_log /var/log/nginx/qxy.oike.io.error.log;
}

# ============================================
# Deployment Instructions
# ============================================
# 1. Copy this file to /etc/nginx/sites-available/qxy.oike.io
# 2. Create symlink: sudo ln -s /etc/nginx/sites-available/qxy.oike.io /etc/nginx/sites-enabled/
# 3. Obtain SSL certificate: sudo certbot --nginx -d qxy.oike.io
# 4. Deploy PWA build to: /var/www/qxy.oike.io/pwa
# 5. Test config: sudo nginx -t
# 6. Reload nginx: sudo systemctl reload nginx
#
# Backend should be running on port 8010:
# - Use systemd service or supervisor to manage FastAPI backend
# - Example: uvicorn app.main:app --host 127.0.0.1 --port 8010
