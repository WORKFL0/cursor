#!/bin/bash

# Configuration
SERVER_IP="192.168.11.103"
SERVER_USER="root"
# Note: Password will be prompted if ssh-copy-id is not set up
APP_DIR="/var/www/workflo-site"
REPO_URL="https://github.com/WORKFL0/cursor.git"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Migration to Vercel Server ($SERVER_IP) ===${NC}"

# Check for SSH connection
echo -e "\n${BLUE}[1/5] Checking SSH Connection...${NC}"
echo "You may be asked for the root password (Workflo2025!)"
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP exit
if [ $? -ne 0 ]; then
    echo "SSH key not set up. Attempting to copy ID..."
    ssh-copy-id $SERVER_USER@$SERVER_IP
fi

# Prepare Server Script
echo -e "\n${BLUE}[2/5] Preparing Remote Server Script...${NC}"
cat << 'EOF' > ./server-setup.sh
#!/bin/bash
set -e

# Update System
echo "Updating system..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git build-essential

# Install Node.js 20 (LTS)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Setup Directory
echo "Setting up /var/www..."
mkdir -p /var/www
cd /var/www

# Check if repo exists
if [ -d "workflo-site" ]; then
    echo "Repo already exists, pulling updates..."
    cd workflo-site
    git pull
else
    echo "Cloning repository..."
    # Note: If private repo, this might fail without credentials.
    # We will assume public or ask user to provide token later.
    git clone https://github.com/WORKFL0/cursor.git workflo-site
    cd workflo-site
fi

# Setup Env
# (The local script will upload the .env file later)

# Install Dependencies
echo "Installing dependencies..."
npm install

# Build
echo "Building Project..."
npm run build

# Start with PM2
echo "Starting Application..."
pm2 delete workflo-app || true
pm2 start npm --name "workflo-app" -- start
pm2 save
pm2 startup | tail -n 1 | bash || true

EOF

# Execute Setup on Remote
echo -e "\n${BLUE}[3/5] configuring server...${NC}"
CACHE_BUST=$(date +%s)
scp ./server-setup.sh $SERVER_USER@$SERVER_IP:/tmp/server-setup-$CACHE_BUST.sh
ssh $SERVER_USER@$SERVER_IP "bash /tmp/server-setup-$CACHE_BUST.sh && rm /tmp/server-setup-$CACHE_BUST.sh"

# Upload Environment Variables
echo -e "\n${BLUE}[4/5] Uploading Environment Configuration...${NC}"
if [ -f ".env.local" ]; then
    # We don't overwrite .env if it exists on server to avoid breaking manual changes, 
    # unless we really want to sync. For first setup, we copy.
    scp .env.local $SERVER_USER@$SERVER_IP:$APP_DIR/.env
    echo "Copied .env.local to remote .env"
else
    echo -e "${RED}Warning: .env.local not found! You will need to configure .env on the server manually.${NC}"
fi

# Final Check
echo -e "\n${BLUE}[5/5] Verifying Deployment...${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3000)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}SUCCESS! Site is running at http://$SERVER_IP:3000${NC}"
else
    echo -e "${RED}Site might not be running correctly (Status: $STATUS). Check server logs with 'pm2 logs'.${NC}"
fi

# Cleanup
rm ./server-setup.sh

echo -e "\n${GREEN}Migration Complete!${NC}"
echo -e "Next Steps for GitHub Integration:"
echo -e "1. Go to your GitHub Repo -> Settings -> Secrets and variables -> Actions"
echo -e "2. Add the following repository secrets:"
echo -e "   - PROD_HOST: $SERVER_IP"
echo -e "   - PROD_USERNAME: root"
echo -e "   - PROD_PASSWORD: (The password you provided)"
echo -e "   OR set up SSH keys and use PROD_SSH_KEY"
