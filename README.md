# ShopFlourite - Full-Stack E-commerce Platform

ShopFlourite is a complete e-commerce solution with a professional React frontend, Node.js/Express backend, and integrated Telegram bot for admin management.

## 🚀 Features

### Frontend (React)
- Professional, responsive UI design
- Product catalog with advanced filtering
- Product details with dynamic reviews
- Shopping cart management
- Secure checkout process
- User authentication (login/register)
- User profile management
- Order tracking and history
- Support ticket system
- Payment proof upload

### Backend (Node.js/Express)
- RESTful API architecture
- MongoDB database integration
- JWT-based authentication
- Product management (CRUD operations)
- Order processing system
- Payment integration ready
- Review and rating system
- Support ticket management
- File upload handling (images, payment proofs)
- Admin and user role management

### Telegram Bot
- Admin panel via Telegram
- Real-time notifications
- View orders, users, products
- Check support tickets
- Monitor store statistics

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**
- **Telegram Bot Token** (for admin bot)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopflourite
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=ShopFlourite
```

### 4. Telegram Bot Setup

```bash
cd ../telegram-bot
npm install
```

Create a `.env` file in the `telegram-bot` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_chat_id
API_URL=http://localhost:5000/api
API_ADMIN_TOKEN=your_admin_jwt_token
```

**Getting Telegram Bot Token:**
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow instructions
3. Copy the token provided

**Getting Admin Chat ID:**
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Copy your chat ID

## 🚀 Running the Application

### Development Mode

Open **three terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - Telegram Bot:**
```bash
cd telegram-bot
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api/health

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with a web server (nginx, apache, etc.)
```

**Telegram Bot:**
```bash
cd telegram-bot
npm start
```

## 🖥️ VPS Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name "shopflourite-backend"

# Start telegram bot
cd ../telegram-bot
pm2 start bot.js --name "shopflourite-bot"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /path/to/backend/uploads;
    }
}
```

## 📁 Project Structure

```
Shopflourite-/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, upload, etc.
│   │   └── server.js        # Main server file
│   ├── uploads/             # Uploaded files
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── utils/           # Context, helpers
│   │   └── styles/          # CSS files
│   ├── package.json
│   └── .env.example
├── telegram-bot/
│   ├── bot.js               # Telegram bot
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/:id/payment-proof` - Upload payment proof

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Support
- `GET /api/support/my-tickets` - Get user tickets
- `POST /api/support` - Create support ticket
- `GET /api/support/:id` - Get single ticket
- `POST /api/support/:id/message` - Add message to ticket

## 🤖 Telegram Bot Commands

- `/start` - Start bot and show welcome message
- `/stats` - View store statistics
- `/orders` - View recent orders
- `/pending` - View pending orders
- `/users` - View recent users
- `/products` - View products
- `/tickets` - View support tickets

## 👥 Default Admin Setup

To create an admin user, you can:

1. Register normally through the frontend
2. Manually update the user in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@shopflourite.com" },
  { $set: { role: "admin" } }
)
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- File upload validation
- Role-based access control
- Input validation

## 🎨 Customization

### Changing Brand Colors

Edit `frontend/src/styles/*.css` files to change:
- Primary color: `#3498db`
- Success color: `#27ae60`
- Danger color: `#e74c3c`

### Adding Payment Gateway

Implement payment processing in `backend/src/routes/payments.js`:

```javascript
// Example: Stripe integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For support and questions:
- Create an issue on GitHub
- Email: support@shopflourite.com

## 🙏 Acknowledgments

Built with:
- React
- Node.js & Express
- MongoDB & Mongoose
- Telegram Bot API
- React Router
- Axios
- React Icons

---

**ShopFlourite** - Your complete e-commerce solution 🛍️