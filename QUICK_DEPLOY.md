# Quick Deployment Commands

## All-in-One Commands (Copy & Paste)

### 1. Prepare Directory & Upload Files
```bash
# Create directory
sudo mkdir -p /var/www/ViewGram/logs
sudo chown -R $USER:$USER /var/www/ViewGram

# Upload your project files to /var/www/ViewGram
# (Use git, scp, rsync, or SFTP)
```

### 2. Install Dependencies & Build
```bash
cd /var/www/ViewGram
npm install
npm run build
```

### 3. Create Environment File
```bash
cd /var/www/ViewGram
echo "NODE_ENV=production
PORT=3004" > .env
```

### 4. Start with PM2
```bash
cd /var/www/ViewGram
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command it outputs
```

### 5. Configure Nginx
```bash
# Copy config (adjust domain if needed)
sudo cp /var/www/ViewGram/nginx-viewgram.conf /etc/nginx/sites-available/viewgram
sudo sed -i 's/viewgram.yivani.dev/YOUR_DOMAIN_HERE/g' /etc/nginx/sites-available/viewgram
sudo sed -i 's/www.viewgram.yivani.dev/www.YOUR_DOMAIN_HERE/g' /etc/nginx/sites-available/viewgram

# Enable site
sudo ln -s /etc/nginx/sites-available/viewgram /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL with Certbot
```bash
sudo certbot --nginx -d YOUR_DOMAIN_HERE -d www.YOUR_DOMAIN_HERE
```

### 7. Verify
```bash
pm2 status
pm2 logs viewgram
curl http://localhost:3004
```

---

## Or Use the Automated Script

```bash
# Make script executable
chmod +x deploy.sh

# Edit domain in deploy.sh (line 15)
nano deploy.sh

# Run deployment
./deploy.sh
```

---

## Manual Step-by-Step (If Script Fails)

See `DEPLOYMENT.md` for detailed instructions.

