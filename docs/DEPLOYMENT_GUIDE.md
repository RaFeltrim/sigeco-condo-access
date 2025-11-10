# SIGECO Production Deployment Guide

This guide provides step-by-step instructions for deploying the SIGECO application to production.

## Prerequisites

- Node.js 18+ installed on production server
- PostgreSQL 14+ database
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- nginx or Apache for reverse proxy
- PM2 or similar process manager

## Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│   nginx     │
│ (Reverse    │
│   Proxy)    │
└──────┬──────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│  Frontend   │       │  Backend    │
│   (Vite)    │       │  (Express)  │
│  Port 5173  │       │  Port 3001  │
└─────────────┘       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │ PostgreSQL  │
                       │  Database   │
                       └─────────────┘
```

## Part 1: Database Setup

### 1.1 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.2 Create Database and User

```bash
sudo -u postgres psql

-- In PostgreSQL shell:
CREATE DATABASE sigeco_db;
CREATE USER sigeco_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sigeco_db TO sigeco_user;
\q
```

### 1.3 Configure PostgreSQL

Edit `/etc/postgresql/14/main/pg_hba.conf`:

```
# Add this line for local connections
local   sigeco_db   sigeco_user   md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

## Part 2: Backend Deployment

### 2.1 Prepare Server

```bash
# Create application directory
sudo mkdir -p /var/www/sigeco
sudo chown $USER:$USER /var/www/sigeco
cd /var/www/sigeco

# Clone repository
git clone https://github.com/your-org/sigeco-condo-access.git
cd sigeco-condo-access/backend
```

### 2.2 Install Dependencies

```bash
npm install --production
```

### 2.3 Configure Environment

```bash
cp .env.example .env
nano .env
```

Production `.env`:

```env
# Database
DATABASE_URL="postgresql://sigeco_user:your_secure_password@localhost:5432/sigeco_db?schema=public"

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET="your-super-secure-jwt-secret-at-least-32-characters-long"
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.4 Run Database Migrations

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

### 2.5 Build Backend

```bash
npm run build
```

### 2.6 Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
pm2 start npm --name "sigeco-backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the command output
```

### 2.7 Verify Backend

```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check PM2 status
pm2 status

# View logs
pm2 logs sigeco-backend
```

## Part 3: Frontend Deployment

### 3.1 Configure Environment

```bash
cd /var/www/sigeco/sigeco-condo-access

# Create production .env
cat > .env << EOF
VITE_API_BASE_URL=https://yourdomain.com/api
EOF
```

### 3.2 Build Frontend

```bash
npm install
npm run build
```

This creates optimized files in `dist/` directory.

### 3.3 Deploy Frontend Files

```bash
# Create nginx web directory
sudo mkdir -p /var/www/sigeco/public

# Copy built files
sudo cp -r dist/* /var/www/sigeco/public/

# Set permissions
sudo chown -R www-data:www-data /var/www/sigeco/public
```

## Part 4: nginx Configuration

### 4.1 Install nginx

```bash
sudo apt install nginx
```

### 4.2 Create nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sigeco
```

Add this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve React app
    location / {
        root /var/www/sigeco/public;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to Express
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### 4.3 Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sigeco /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Part 5: SSL Certificate

### 5.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 5.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure nginx for HTTPS.

### 5.3 Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot adds automatic renewal via cron
```

## Part 6: Firewall Configuration

```bash
# Allow SSH (important!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Part 7: Monitoring and Logs

### 7.1 Backend Logs

```bash
# View backend logs
pm2 logs sigeco-backend

# View backend logs file
tail -f /var/www/sigeco/sigeco-condo-access/backend/logs/app.log
```

### 7.2 nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 7.3 PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 7.4 Setup Monitoring

Install monitoring tools:

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Part 8: Database Backups

### 8.1 Create Backup Script

```bash
sudo nano /usr/local/bin/backup-sigeco-db
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/sigeco"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/sigeco_db_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR
pg_dump -U sigeco_user sigeco_db | gzip > $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "sigeco_db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-sigeco-db
```

### 8.2 Schedule Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-sigeco-db
```

## Part 9: Updates and Maintenance

### 9.1 Update Application

```bash
cd /var/www/sigeco/sigeco-condo-access

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install --production
npm run build
npm run prisma:migrate
pm2 restart sigeco-backend

# Update frontend
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/sigeco/public/

# Clear nginx cache (if applicable)
sudo systemctl reload nginx
```

### 9.2 Rollback Strategy

```bash
# Tag current version before deploying
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0

# If needed, rollback:
git checkout v1.0.0
# Then repeat deployment steps
```

## Part 10: Security Checklist

- [ ] Database password is strong and secure
- [ ] JWT_SECRET is at least 32 characters and random
- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured and enabled
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Database backups automated
- [ ] Application logs monitored
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] PostgreSQL not exposed to internet
- [ ] Regular security updates applied

## Part 11: Performance Optimization

### 11.1 Enable Caching

```nginx
# Add to nginx location /
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 11.2 Database Connection Pooling

Already configured in Prisma. Monitor connections:

```sql
SELECT * FROM pg_stat_activity WHERE datname = 'sigeco_db';
```

### 11.3 PM2 Cluster Mode

For high traffic, use PM2 cluster mode:

```bash
pm2 delete sigeco-backend
pm2 start npm --name "sigeco-backend" -i max -- start
pm2 save
```

## Part 12: Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs sigeco-backend

# Check if port is in use
sudo lsof -i :3001

# Verify database connection
psql -U sigeco_user -d sigeco_db -h localhost
```

### Frontend Not Loading

```bash
# Check nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify files exist
ls -la /var/www/sigeco/public/
```

### Database Connection Issues

```bash
# Test database connection
psql -U sigeco_user -d sigeco_db -h localhost

# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL in backend/.env
```

### SSL Certificate Issues

```bash
# Check certificate expiration
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check nginx SSL configuration
sudo nginx -t
```

## Part 13: Monitoring Dashboard

Consider setting up monitoring tools:

- **PM2 Plus**: Process monitoring
- **Grafana**: Metrics visualization
- **Sentry**: Error tracking
- **UptimeRobot**: Uptime monitoring

## Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and tested
- [ ] All tests passing
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Backup current production data
- [ ] SSL certificate valid

### Deployment
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Build backend and frontend
- [ ] Deploy files
- [ ] Restart services
- [ ] Clear caches

### Post-Deployment
- [ ] Verify application is accessible
- [ ] Test critical workflows
- [ ] Monitor logs for errors
- [ ] Check database connections
- [ ] Verify SSL certificate
- [ ] Test API endpoints
- [ ] Monitor performance metrics

## Support

For deployment issues:
1. Check application logs
2. Verify all services are running
3. Review configuration files
4. Consult troubleshooting section
5. Contact development team

## Additional Resources

- [Backend Documentation](../backend/README.md)
- [API Testing Guide](../backend/TESTING.md)
- [Frontend Integration](./FRONTEND_INTEGRATION.md)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
