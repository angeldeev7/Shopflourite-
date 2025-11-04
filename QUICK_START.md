# ShopFlourite Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
```bash
node --version  # Should be v14+
npm --version   # Should be 6+
mongod --version  # MongoDB should be installed
```

### Step 1: Clone & Navigate
```bash
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-
```

### Step 2: Backend Setup (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` - Minimum required:
```env
MONGODB_URI=mongodb://localhost:27017/shopflourite
JWT_SECRET=your_secret_key_here
```

Start backend:
```bash
npm run dev
# Backend running on http://localhost:5000
```

### Step 3: Frontend Setup (2 minutes)
Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

Start frontend:
```bash
npm start
# Frontend running on http://localhost:3000
```

### Step 4: Telegram Bot (Optional, 1 minute)
Open a new terminal:
```bash
cd telegram-bot
npm install
cp .env.example .env
```

Get bot token from [@BotFather](https://t.me/botfather), add to `.env`, then:
```bash
npm start
```

### Step 5: Test the System

1. **Open Browser**: http://localhost:3000
2. **Register**: Create a new account
3. **Browse**: Check out the catalog
4. **Shop**: Add products to cart (sample products need to be added via API or admin)
5. **Checkout**: Place an order

### 🎯 Creating Sample Data

#### Create Admin User
```bash
# Use MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@shopflourite.com" },
  { $set: { role: "admin" } }
)
```

#### Add Sample Products (via API)
```bash
# First, login as admin and get JWT token
# Then use curl or Postman:

curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "description": "This is a sample product",
    "price": 29.99,
    "category": "electronics",
    "stock": 100,
    "featured": true
  }'
```

### 🔍 Testing Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Products
```bash
curl http://localhost:5000/api/products
```

### 📱 Mobile Testing
Access from mobile on same network:
```
http://YOUR_LOCAL_IP:3000
```

### 🐛 Common Issues

**MongoDB not running:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Port already in use:**
```bash
# Change PORT in backend/.env
PORT=5001

# Or kill the process
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend won't connect to backend:**
- Check `REACT_APP_API_URL` in `frontend/.env`
- Should be `http://localhost:5000/api`
- Restart frontend after changing .env

### 📊 Monitoring

#### Backend Logs
```bash
cd backend
npm run dev
# Watch console for API requests
```

#### MongoDB
```bash
mongosh
use shopflourite
db.users.find()
db.products.find()
db.orders.find()
```

### 🎨 Customization Quick Tips

**Change Brand Name:**
- Edit `frontend/src/components/Header.js` - Logo text
- Edit `frontend/public/index.html` - Page title
- Edit `.env` files - SITE_NAME

**Change Colors:**
- Edit `frontend/src/styles/*.css`
- Primary: `#3498db` → Your color
- Success: `#27ae60` → Your color

**Add Logo Image:**
```javascript
// In frontend/src/components/Header.js
<img src="/logo.png" alt="ShopFlourite" />
```

### 🚢 Quick Deploy to VPS

```bash
# On VPS
npm install -g pm2
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-/backend
npm install
pm2 start src/server.js --name shopflourite-api

cd ../telegram-bot
npm install
pm2 start bot.js --name shopflourite-bot

pm2 save
pm2 startup

# Build frontend locally, upload to VPS
cd frontend
npm run build
# Upload 'build' folder to VPS and serve with Nginx
```

### 💡 Next Steps

1. ✅ Customize branding and colors
2. ✅ Add real product data
3. ✅ Configure payment gateway
4. ✅ Set up email notifications
5. ✅ Add SSL certificate (Let's Encrypt)
6. ✅ Configure domain name
7. ✅ Set up monitoring (PM2 monitoring)

### 📚 Documentation Links

- **Full README**: [README.md](README.md)
- **API Endpoints**: See README.md
- **Deployment Guide**: See README.md - VPS Deployment section
- **Implementation Summary**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

### 🆘 Need Help?

- Check the [README.md](README.md) for detailed instructions
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for feature list
- Create an issue on GitHub
- Check server logs for error messages

---

**Happy Coding! 🎉**

Your ShopFlourite e-commerce platform is ready to go!
