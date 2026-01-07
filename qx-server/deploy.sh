#!/bin/bash
set -e

echo "🚀 Deploying Backend to qxy.oike.io..."

# Deploy to server
echo "📤 Uploading backend files..."
SERVER="frnkhng@oike.io"
REMOTE_PATH="~/quxiang/qx-server"

# Create systemd service file
cat > qxy-backend.service << 'EOF'
[Unit]
Description=Quxiang FastAPI Backend
After=network.target mysql.service

[Service]
Type=simple
User=frnkhng
WorkingDirectory=/home/frnkhng/quxiang/qx-server
Environment="PATH=/home/frnkhng/quxiang/qx-server/venv/bin"
ExecStart=/home/frnkhng/quxiang/qx-server/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8010
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

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
  cd ~/quxiang/qx-server
  
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
echo "📊 Check logs: ssh $SERVER 'sudo journalctl -u qxy-backend -f'"
