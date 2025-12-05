# Deployment Guide

Complete guide for deploying the WhatsApp Business Dashboard with separate frontend and backend.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────────┐
│  Next.js        │ ───→ │  FastAPI         │
│  Frontend       │      │  Backend         │
│  (Port 3000)    │ ←─── │  (Port 8000)     │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ↓
                         ┌──────────────────┐
                         │  MongoDB         │
                         │  Database        │
                         └──────────────────┘
```

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Development)

**Advantages:**
- All services in one command
- Isolated environments
- Easy to replicate
- Good for local development

**Steps:**

1. **Clone the repository**
```bash
git clone <your-repo>
cd whatsapp-business-dashboard
```

2. **Update environment variables**

Edit `docker-compose.yml` and change:
- MongoDB credentials
- JWT_SECRET
- NEXT_PUBLIC_JWT_TOKEN

3. **Build and run**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Separate Hosting (Recommended for Production)

**Advantages:**
- Better security
- Independent scaling
- Specialized hosting
- Cost-effective

#### Frontend Deployment (Vercel)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**
```bash
cd whatsapp-business-ui
npm install -g vercel
vercel
```

3. **Set environment variables in Vercel Dashboard**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_JWT_TOKEN=your_jwt_token
```

4. **Deploy**
```bash
vercel --prod
```

#### Backend Deployment (Railway/Heroku)

**Using Railway:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and initialize**
```bash
cd whatsapp-backend
railway login
railway init
```

3. **Add MongoDB**
```bash
railway add mongodb
```

4. **Set environment variables**
```bash
railway variables set JWT_SECRET=your_secret
railway variables set WHATSAPP_ACCESS_TOKEN=your_token
```

5. **Deploy**
```bash
railway up
```

**Using Heroku:**

1. **Install Heroku CLI**
```bash
brew install heroku/brew/heroku  # macOS
```

2. **Login and create app**
```bash
cd whatsapp-backend
heroku login
heroku create whatsapp-backend-api
```

3. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set WHATSAPP_ACCESS_TOKEN=your_token
```

5. **Deploy**
```bash
git push heroku main
```

### Option 3: VPS Deployment (DigitalOcean/AWS/GCP)

**For Ubuntu 22.04 Server:**

#### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo> whatsapp-app
cd whatsapp-app/whatsapp-backend

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
sudo nano .env
# Add your environment variables

# Start with PM2
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name whatsapp-backend
pm2 save
pm2 startup
```

#### 3. Deploy Frontend

```bash
cd /var/www/whatsapp-app/whatsapp-business-ui

# Install dependencies
npm install

# Create .env.local
sudo nano .env.local
# Add your environment variables

# Build
npm run build

# Start with PM2
pm2 start npm --name "whatsapp-frontend" -- start
pm2 save
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/whatsapp
```

Add configuration:
```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/whatsapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

## 🔒 Security Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Generate strong JWT secret: `openssl rand -hex 32`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Use environment variables (never commit .env)
- [ ] Enable MongoDB authentication
- [ ] Set up API key rotation
- [ ] Configure CSP headers
- [ ] Enable security headers in Nginx

## 📊 Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# View status
pm2 status
```

### Application Monitoring

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **DataDog** for infrastructure monitoring
- **Uptime Robot** for uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Testing Deployment

### Health Checks

```bash
# Backend health
curl http://your-backend-url.com/

# Frontend
curl http://your-frontend-url.com/

# API with auth
curl -H "Authorization: Bearer your_token" http://your-backend-url.com/users?login_user=test
```

## 🆘 Troubleshooting

### Common Issues

**Frontend can't connect to backend:**
- Check CORS settings in backend
- Verify NEXT_PUBLIC_API_URL is correct
- Ensure backend is running and accessible

**MongoDB connection failed:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in .env
- Check firewall rules

**JWT authentication failed:**
- Ensure JWT_SECRET matches on backend
- Verify NEXT_PUBLIC_JWT_TOKEN matches on frontend
- Check token format in Authorization header

**Port already in use:**
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8000

# Kill process
sudo kill -9 <PID>
```

## 📝 Post-Deployment

1. **Test all features**
   - Dashboard loads correctly
   - Contacts can be fetched
   - Messages can be sent
   - Campaigns work properly

2. **Monitor logs**
   - Check for errors
   - Monitor API response times
   - Watch database queries

3. **Set up backups**
   - Database backups
   - Code backups
   - Environment variable backups

4. **Document**
   - API endpoints
   - Environment variables
   - Deployment process
   - Rollback procedure

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Update backend
cd whatsapp-backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart whatsapp-backend

# Update frontend
cd ../whatsapp-business-ui
npm install
npm run build
pm2 restart whatsapp-frontend
```

### Database Backups

```bash
# Backup MongoDB
mongodump --out /backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore /backup/20240315
```

## 📞 Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Review documentation
3. Check GitHub issues
4. Contact support team
