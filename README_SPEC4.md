# ShopFlourite - Spec4 Implementation

Modern e-commerce platform with glass/neon design, built with HTML/CSS/JavaScript and Node.js.

## 🎨 Features

### Frontend (Pure HTML/CSS/JS)
- ✨ Glass morphism and neon design theme
- 📱 Fully responsive (mobile & desktop)
- 🎭 Smooth animations and transitions
- 🛒 Client-side shopping cart
- 🔐 JWT-based authentication
- 💾 localStorage for cart persistence

### Pages Included
- **index.html** - Home page with featured products
- **productos.html** - Product catalog with filters and search
- **producto-detalle.html** - Individual product details
- **checkout.html** - Shopping cart and checkout
- **login.html** - User login
- **registro.html** - User registration (Email, WhatsApp, Telegram)
- **perfil.html** - User profile management
- **mis-compras.html** - Order history
- **soporte.html** - Support center with FAQ
- **novedades.html** - News and updates
- **terminos.html** - Terms and conditions

### Backend (Node.js/Express)
- 🔒 Secure authentication with JWT
- 📦 Product management
- 🛍️ Order processing
- 💬 Support ticket system
- 📱 WhatsApp integration
- 💬 Telegram notifications for admins
- 📧 Email support

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Telegram Bot Token (optional, for admin notifications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopflourite
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:5000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_optional
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id_optional
```

3. **Start the Server**
```bash
npm run dev
```

The application will be available at **http://localhost:5000**

## 📁 Project Structure

```
Shopflourite-/
├── frontend/
│   ├── css/
│   │   └── main.css          # Glass/neon styles
│   ├── js/
│   │   ├── api.js            # API client
│   │   ├── auth.js           # Authentication
│   │   ├── cart.js           # Shopping cart
│   │   └── utils.js          # Utilities
│   ├── images/
│   │   └── products/         # Product images
│   ├── index.html            # Home page
│   ├── productos.html        # Product catalog
│   ├── producto-detalle.html # Product detail
│   ├── checkout.html         # Checkout
│   ├── login.html            # Login
│   ├── registro.html         # Registration
│   ├── perfil.html           # Profile
│   ├── mis-compras.html      # Orders
│   ├── soporte.html          # Support
│   ├── novedades.html        # News
│   └── terminos.html         # Terms
├── backend/
│   ├── src/
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation
│   │   ├── services/         # Telegram, etc.
│   │   └── server.js         # Main server
│   ├── uploads/              # User uploads
│   └── package.json
└── telegram-bot/
    └── bot.js                # Telegram admin bot
```

## 🎨 Design System

### Color Palette
- **Neon Green**: `#00ff88` - Primary actions
- **Neon Blue**: `#00d4ff` - Secondary elements
- **Neon Pink**: `#ff0080` - Accents and badges
- **Dark Background**: `#0a0a14` - Main background
- **Glass Effect**: `rgba(255, 255, 255, 0.1)` - Cards and overlays

### Typography
- Font Family: Inter, Segoe UI, sans-serif
- Responsive font sizes
- Smooth text rendering

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register (email, name, password, whatsapp, telegram)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders

### Support
- `POST /api/support` - Create support ticket
- `GET /api/support/my-tickets` - Get user's tickets

## 📱 User Registration Fields

The registration form collects:
- ✅ **Nombre** (Name) - Required
- ✅ **Email** - Required, validated
- ✅ **WhatsApp** - Required, format validated (+52 1234567890)
- ✅ **Telegram** - Optional, username validated (@usuario)
- ✅ **Contraseña** (Password) - Required, min 6 characters
- ✅ **Términos** - Must accept terms and conditions

## 💬 Telegram Integration

The backend sends notifications to admin for:
- 👤 New user registrations
- 🛍️ New orders
- 🎫 New support tickets
- 💳 Payment proof uploads
- 🔄 Order status changes

Notifications include user's WhatsApp and Telegram for easy contact.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation
- CORS protection
- Helmet security headers
- Environment variable configuration

## 📦 Deployment

### Using PM2
```bash
cd backend
pm2 start src/server.js --name shopflourite
pm2 save
pm2 startup
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Support

- 📧 Email: soporte@shopflourite.com
- 📱 WhatsApp: +52 123 456 7890
- 💬 Telegram: @shopflourite

---

**ShopFlourite Spec4** - Modern E-commerce with Glass/Neon Design 🛍️✨
