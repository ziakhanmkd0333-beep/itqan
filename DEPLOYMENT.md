# Hostinger VPS Deployment Guide

## Prerequisites

1. Hostinger VPS with Ubuntu 20.04+ or CentOS 8+
2. Node.js 18+ installed
3. MySQL/MariaDB installed
4. PM2 installed globally (`npm install -g pm2`)
5. Nginx installed

## Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### 4. Create Database
```bash
sudo mysql -u root -p

CREATE DATABASE alitqan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'alitqan_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON alitqan_db.* TO 'alitqan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Application Deployment

### 1. Upload Files
Upload the backend folder to `/var/www/al-itqan-backend` on your server.

### 2. Install Dependencies
```bash
cd /var/www/al-itqan-backend
npm install --production
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your production values:
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_NAME=alitqan_db
DB_USER=alitqan_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_random_secure_string
```

### 4. Run Migrations and Seeders
```bash
npm run migrate
```

### 5. Start with PM2
```bash
pm2 start server.js --name "al-itqan-api"
pm2 save
pm2 startup
```

### 6. Configure Nginx
Create `/etc/nginx/sites-available/al-itqan`:

```nginx
server {
    listen 80;
    server_name itqaninstitute.com www.itqaninstitute.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/al-itqan-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/al-itqan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d itqaninstitute.com -d www.itqaninstitute.com
```

## Monitoring

Check application status:
```bash
pm2 status
pm2 logs al-itqan-api
```

Restart application:
```bash
pm2 restart al-itqan-api
```

## Backup

Create a backup script `/var/www/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u alitqan_user -p'your_password' alitqan_db > /var/backups/alitqan_${DATE}.sql
```

## Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Disable root SSH login
- [ ] Enable automatic security updates
- [ ] Set up fail2ban
- [ ] Regular database backups
