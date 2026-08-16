# ViewGram Deployment Guide

## Prerequisites
- Ubuntu 22.04.5 LTS
- Node.js 18+ installed
- PM2 installed globally
- Nginx installed and running
- Certbot installed

## Step 1: Prepare Directory Structure

```bash
# Create project directory
sudo mkdir -p /var/www/ViewGram
sudo chown -R $USER:$USER /var/www/ViewGram

# Create logs directory
mkdir -p /var/www/ViewGram/logs
```

## Step 2: Upload Project Files

Upload all project files to `/var/www/ViewGram` (you can use git, scp, or rsync):

```bash
# If using git:
cd /var/www/ViewGram
git clone <your-repo-url> .

# Or upload via scp/rsync from your local machine
```

## Step 3: Install Dependencies

```bash
cd /var/www/ViewGram
npm install --production=false
```

## Step 4: Create Environment File

```bash
cd /var/www/ViewGram
echo "NODE_ENV=production
PORT=3004" > .env
```

## Step 5: Build the Application

```bash
cd /var/www/ViewGram
npm run build
```

## Step 6: Set Up PM2

```bash
# Copy ecosystem config to server (if not already there)
# The ecosystem.config.js should be in /var/www/ViewGram

# Start the application with PM2
cd /var/www/ViewGram
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the command it outputs (usually: sudo env PATH=... pm2 startup systemd -u $USER --hp /home/$USER)
```

## Step 7: Configure Nginx

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/viewgram
```

Add the following configuration (replace `viewgram.yivani.dev` with your domain):

```nginx
server {
    listen 80;
    server_name viewgram.yivani.dev www.viewgram.yivani.dev;

    # Redirect HTTP to HTTPS (will be enabled after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For initial setup, proxy to PM2 (remove after SSL setup)
    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/viewgram /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 8: Set Up SSL with Certbot

```bash
# Install certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d viewgram.yivani.dev -d www.viewgram.yivani.dev

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically update your Nginx configuration with SSL settings.

## Step 9: Update Nginx Config for SSL (if needed)

After Certbot runs, your Nginx config should look like this:

```nginx
server {
    listen 80;
    server_name viewgram.yivani.dev www.viewgram.yivani.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name viewgram.yivani.dev www.viewgram.yivani.dev;

    ssl_certificate /etc/letsencrypt/live/viewgram.yivani.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viewgram.yivani.dev/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 10: Verify Everything Works

```bash
# Check PM2 status
pm2 status
pm2 logs viewgram

# Check Nginx status
sudo systemctl status nginx

# Test the application
curl http://localhost:3004
```

## Step 11: Set Up Auto-Renewal for SSL

Certbot should have set up auto-renewal automatically. Verify:

```bash
sudo certbot renew --dry-run
```

## Useful Commands

### PM2 Management
```bash
pm2 list                    # List all PM2 processes
pm2 logs viewgram           # View logs
pm2 restart viewgram        # Restart the app
pm2 stop viewgram           # Stop the app
pm2 delete viewgram         # Remove from PM2
pm2 monit                   # Monitor resources
```

### Nginx Management
```bash
sudo nginx -t                # Test configuration
sudo systemctl reload nginx  # Reload configuration
sudo systemctl restart nginx # Restart Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Application Updates
```bash
cd /var/www/ViewGram
git pull                    # If using git
npm install                 # Install new dependencies
npm run build              # Rebuild the app
pm2 restart viewgram       # Restart with new code
```

### SSL Certificate Renewal
```bash
sudo certbot renew          # Manual renewal
sudo certbot certificates   # List certificates
```

## Troubleshooting

### PM2 app not starting
```bash
pm2 logs viewgram --lines 50
cd /var/www/ViewGram
npm run build
pm2 restart viewgram
```

### Nginx 502 Bad Gateway
- Check if PM2 app is running: `pm2 status`
- Check if port 3004 is correct in ecosystem.config.js
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Environment Variables Not Loading
- Ensure `.env.local` exists in `/var/www/ViewGram`
- Restart PM2: `pm2 restart viewgram`
- Check PM2 env: `pm2 describe viewgram`

## Notes

- Replace `viewgram.yivani.dev` with your actual domain
- Port 3004 is used to avoid conflicts with other services
- Logs are stored in `/var/www/ViewGram/logs/`
- Environment variables are loaded from `.env.local` in production

