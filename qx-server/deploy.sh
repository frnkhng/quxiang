#!/bin/bash
set -e

echo "🚀 Deploying Backend to qxy.oike.io..."

# Deploy to server
echo "📤 Uploading backend files..."
SERVER="frnkhng@oike.io"
REMOTE_PATH="/var/www/qxy.oike.io/qx-server"

# Create systemd service file
cat > qxy-backend.service << 'EOF'
[Unit]
Description=Quxiang FastAPI Backend
After=network.target mysql.service

[Service]
Type=simple
User=frnkhng
WorkingDirectory=/var/www/qxy.oike.io/qx-server
Environment="PATH=/var/www/qxy.oike.io/qx-server/venv/bin"
ExecStart=/var/www/qxy.oike.io/qx-server/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8010
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create remote directory if it doesn't exist
ssh $SERVER "mkdir -p $REMOTE_PATH"

# Upload backend files (exclude venv, __pycache__, .env)
rsync -avz --exclude 'venv' \
           --exclude '__pycache__' \
           --exclude '*.pyc' \
           --exclude '.env' \
           --exclude 'alembic/versions/*.pyc' \
           ./ $SERVER:$REMOTE_PATH/

# Upload service file
scp qxy-backend.service $SERVER:~/

# Execute remote commands
ssh $SERVER << 'ENDSSH'
  cd /var/www/qxy.oike.io/qx-server
  
  # Check if .env exists
  if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create .env file with:"
    echo "  DATABASE_URL=mysql+pymysql://user:pass@localhost/quxiang"
    echo "  SECRET_KEY=your-secret-key"
    echo "  ALGORITHM=HS256"
    exit 1
  fi
  
  # Create venv if it doesn't exist
  if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    # Try python3.12, fallback to python3.11, then python3
    if command -v python3.12 &> /dev/null; then
      python3.12 -m venv venv
    elif command -v python3.11 &> /dev/null; then
      python3.11 -m venv venv
    else
      python3 -m venv venv
    fi
  fi
  
  # Activate venv and install dependencies
  source venv/bin/activate
  pip install -r requirements.txt
  
  # Run migrations
  alembic upgrade head
  
  # Update systemd service
  sudo cp ~/qxy-backend.service /etc/systemd/system/qxy-backend.service
  sudo systemctl daemon-reload
  
  # Restart backend
  sudo systemctl restart qxy-backend
  
  # Show status
  echo "✅ Backend deployed successfully!"
  sudo systemctl status qxy-backend --no-pager -l
  
  # Cleanup
  rm ~/qxy-backend.service
ENDSSH

# Cleanup local service file
rm qxy-backend.service

echo "🔧 Backend service restarted!"
echo "📊 Check logs: ssh $SERVER 'sudo journalctl -u qxy-backend -n 100'"
