# ShopFlourite Spec4 - Testing & Deployment Guide

## 🧪 Testing Checklist

### Frontend Testing

#### Desktop Testing (1920x1080)
- [ ] Home page loads correctly
- [ ] Products page displays grid layout
- [ ] Product detail page shows all information
- [ ] Shopping cart functions properly
- [ ] Login/Registration forms work
- [ ] Profile page loads and updates
- [ ] Order history displays correctly
- [ ] Support page is functional
- [ ] All navigation links work
- [ ] Animations are smooth

#### Mobile Testing (375x667)
- [ ] Navigation menu toggles correctly
- [ ] All pages are responsive
- [ ] Forms are easy to fill
- [ ] Buttons are touchable
- [ ] Images scale properly
- [ ] Text is readable
- [ ] Cart icon is visible
- [ ] Footer is organized

#### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Backend Testing

#### API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register user (with WhatsApp and Telegram)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "whatsapp": "+521234567890",
    "telegram": "@testuser"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# Get products
curl http://localhost:5000/api/products
```

### Validation Testing

#### Registration Form
- [ ] Email validation works
- [ ] WhatsApp format validation (+52 1234567890)
- [ ] Telegram username validation (@usuario)
- [ ] Password minimum length (6 characters)
- [ ] Password confirmation matches
- [ ] Terms acceptance required
- [ ] All fields properly labeled

#### Security Testing
- [ ] Passwords are hashed (not stored in plain text)
- [ ] JWT tokens expire correctly
- [ ] Protected routes require authentication
- [ ] CORS is configured properly
- [ ] Input sanitization works
- [ ] SQL/NoSQL injection protection

## 🚀 Deployment Guide

### Option 1: VPS Deployment (Ubuntu/Debian)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Deploy Application
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-

# Install dependencies
cd backend
npm install --production

# Create .env file
sudo nano .env
```

Add to `.env`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/shopflourite
JWT_SECRET=GENERATE_A_STRONG_SECRET_HERE
FRONTEND_URL=https://your-domain.com
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

#### 3. Start with PM2
```bash
pm2 start src/server.js --name shopflourite
pm2 save
pm2 startup
```

#### 4. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/shopflourite
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/shopflourite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: shopflourite-db
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=shopflourite

  backend:
    build: ./backend
    container_name: shopflourite-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/shopflourite
      - JWT_SECRET=${JWT_SECRET}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_ADMIN_CHAT_ID=${TELEGRAM_ADMIN_CHAT_ID}
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

#### 3. Deploy
```bash
docker-compose up -d
```

## 📊 Monitoring

### PM2 Monitoring
```bash
# View logs
pm2 logs shopflourite

# Monitor resources
pm2 monit

# Restart
pm2 restart shopflourite

# Check status
pm2 status
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Maintenance

### Update Application
```bash
cd /var/www/Shopflourite-
git pull origin main
cd backend
npm install --production
pm2 restart shopflourite
```

### Backup Database
```bash
mongodump --db shopflourite --out /backups/$(date +%Y%m%d)
```

### Restore Database
```bash
mongorestore --db shopflourite /backups/20241105/shopflourite
```

## 🔐 Security Recommendations

1. **Change default passwords**
2. **Use strong JWT secret** (min 32 characters)
3. **Enable firewall**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```
4. **Keep system updated**
```bash
sudo apt update && sudo apt upgrade -y
```
5. **Monitor logs regularly**
6. **Set up automated backups**
7. **Use environment variables** for secrets
8. **Enable HTTPS** (SSL/TLS)

## 📱 Telegram Bot Setup

1. **Create bot with BotFather**
   - Open Telegram and search for @BotFather
   - Send `/newbot` command
   - Follow instructions
   - Copy the bot token

2. **Get your Chat ID**
   - Search for @userinfobot
   - Send any message
   - Copy your chat ID

3. **Update .env file**
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
```

## ✅ Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] MongoDB is running and accessible
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain DNS configured
- [ ] Firewall configured
- [ ] PM2 configured for auto-restart
- [ ] Nginx configured and running
- [ ] Telegram notifications working
- [ ] Backup strategy in place
- [ ] All pages tested on mobile and desktop
- [ ] Payment methods configured
- [ ] Terms and conditions updated
- [ ] Contact information correct
- [ ] Email notifications working (if configured)

## 🆘 Troubleshooting

### Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### MongoDB connection issues
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Nginx not starting
```bash
sudo nginx -t
sudo systemctl status nginx
```

### PM2 not persisting after reboot
```bash
pm2 startup
pm2 save
```

## 📞 Support

For deployment assistance:
- 📧 Email: soporte@shopflourite.com
- 💬 Telegram: @shopflourite

---

**Good luck with your deployment!** 🚀
