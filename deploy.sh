#!/bin/bash

# ViewGram Deployment Script
# Run this script on your server after uploading the project files

set -e

echo "🚀 Starting ViewGram deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root (should not)
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root. Run as your user account.${NC}"
   exit 1
fi

# Variables
PROJECT_DIR="/var/www/ViewGram"
DOMAIN="viewgram.yivani.dev"  # Change this to your domain
PORT=3004

echo -e "${YELLOW}Step 1: Creating directory structure...${NC}"
sudo mkdir -p $PROJECT_DIR
sudo mkdir -p $PROJECT_DIR/logs
sudo chown -R $USER:$USER $PROJECT_DIR

echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
cd $PROJECT_DIR
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please upload project files first.${NC}"
    exit 1
fi

npm install --production=false

echo -e "${YELLOW}Step 3: Creating environment file...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env...${NC}"
    cat > .env << EOF
NODE_ENV=production
PORT=$PORT
EOF
fi

echo -e "${YELLOW}Step 4: Building application...${NC}"
npm run build

echo -e "${YELLOW}Step 5: Setting up PM2...${NC}"
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ PM2 started${NC}"
else
    echo -e "${RED}Error: ecosystem.config.js not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 6: Configuring Nginx...${NC}"
sudo cp nginx-viewgram.conf /etc/nginx/sites-available/viewgram
sudo sed -i "s/viewgram.yivani.dev/$DOMAIN/g" /etc/nginx/sites-available/viewgram
sudo sed -i "s/www.viewgram.yivani.dev/www.$DOMAIN/g" /etc/nginx/sites-available/viewgram

if [ ! -L /etc/nginx/sites-enabled/viewgram ]; then
    sudo ln -s /etc/nginx/sites-available/viewgram /etc/nginx/sites-enabled/
fi

sudo nginx -t
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "${YELLOW}Step 7: Setting up SSL with Certbot...${NC}"
echo -e "${YELLOW}This will prompt you for email and domain confirmation...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN

echo -e "${GREEN}✓ SSL certificate installed${NC}"

echo -e "${YELLOW}Step 8: Finalizing...${NC}"
pm2 startup
echo -e "${YELLOW}⚠️  Run the command shown above to enable PM2 on boot${NC}"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}Your app should be available at: https://$DOMAIN${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 logs viewgram     # View logs"
echo "  pm2 restart viewgram  # Restart app"
echo "  pm2 status            # Check status"

