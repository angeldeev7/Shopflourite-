const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;
const apiUrl = process.env.API_URL || 'http://localhost:5000/api';
const apiToken = process.env.API_ADMIN_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// API Helper
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${apiUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

// Check if user is admin
const isAdmin = (chatId) => {
  return chatId.toString() === adminChatId;
};

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied. This bot is for administrators only.');
    return;
  }

  const welcomeMessage = `
🛍️ *ShopFlourite Admin Panel*

Welcome! Use the following commands to manage your store:

📊 *Statistics*
/stats - View store statistics

📦 *Orders*
/orders - View recent orders
/pending - View pending orders
/order [ID] - View specific order details

👥 *Users*
/users - View recent users
/user [ID] - View user details

🛒 *Products*
/products - View products
/product [ID] - View product details

💬 *Support*
/tickets - View support tickets
/ticket [ID] - View ticket details

⚙️ *Actions*
/help - Show this help message
  `;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  bot.sendMessage(chatId, 'Use /start to see available commands.', { parse_mode: 'Markdown' });
});

// Stats command
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const [orders, users, products] = await Promise.all([
      apiRequest('/orders?limit=1000'),
      apiRequest('/users?limit=1000'),
      apiRequest('/products?limit=1000')
    ]);

    const pendingOrders = orders.orders?.filter(o => o.orderStatus === 'pending').length || 0;
    const totalRevenue = orders.orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;

    const statsMessage = `
📊 *Store Statistics*

👥 Total Users: ${users.totalUsers || 0}
🛒 Total Products: ${products.totalProducts || 0}
📦 Total Orders: ${orders.totalOrders || 0}
⏳ Pending Orders: ${pendingOrders}
💰 Total Revenue: $${totalRevenue.toFixed(2)}
    `;

    bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching statistics. Make sure the API is running and configured correctly.');
  }
});

// Orders command
bot.onText(/\/orders/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const data = await apiRequest('/orders?limit=5');
    
    if (!data.orders || data.orders.length === 0) {
      bot.sendMessage(chatId, '📦 No orders found.');
      return;
    }

    let message = '📦 *Recent Orders*\n\n';
    
    data.orders.forEach((order, index) => {
      message += `${index + 1}. Order #${order._id.substring(0, 8)}\n`;
      message += `   Status: ${order.orderStatus}\n`;
      message += `   Amount: $${order.totalAmount}\n`;
      message += `   Date: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching orders.');
  }
});

// Pending orders command
bot.onText(/\/pending/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const data = await apiRequest('/orders?status=pending&limit=10');
    
    if (!data.orders || data.orders.length === 0) {
      bot.sendMessage(chatId, '✅ No pending orders.');
      return;
    }

    let message = '⏳ *Pending Orders*\n\n';
    
    data.orders.forEach((order, index) => {
      message += `${index + 1}. Order #${order._id.substring(0, 8)}\n`;
      message += `   Amount: $${order.totalAmount}\n`;
      message += `   Payment: ${order.paymentStatus}\n`;
      message += `   Date: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching pending orders.');
  }
});

// Users command
bot.onText(/\/users/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const data = await apiRequest('/users?limit=5');
    
    if (!data.users || data.users.length === 0) {
      bot.sendMessage(chatId, '👥 No users found.');
      return;
    }

    let message = '👥 *Recent Users*\n\n';
    
    data.users.forEach((user, index) => {
      message += `${index + 1}. ${user.name}\n`;
      message += `   Email: ${user.email}\n`;
      message += `   Role: ${user.role}\n`;
      message += `   Active: ${user.isActive ? '✅' : '❌'}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching users.');
  }
});

// Products command
bot.onText(/\/products/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const data = await apiRequest('/products?limit=5');
    
    if (!data.products || data.products.length === 0) {
      bot.sendMessage(chatId, '🛒 No products found.');
      return;
    }

    let message = '🛒 *Recent Products*\n\n';
    
    data.products.forEach((product, index) => {
      message += `${index + 1}. ${product.name}\n`;
      message += `   Price: $${product.price}\n`;
      message += `   Stock: ${product.stock}\n`;
      message += `   Category: ${product.category}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching products.');
  }
});

// Support tickets command
bot.onText(/\/tickets/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const data = await apiRequest('/support?limit=5');
    
    if (!data.tickets || data.tickets.length === 0) {
      bot.sendMessage(chatId, '💬 No support tickets found.');
      return;
    }

    let message = '💬 *Recent Support Tickets*\n\n';
    
    data.tickets.forEach((ticket, index) => {
      message += `${index + 1}. ${ticket.subject}\n`;
      message += `   Status: ${ticket.status}\n`;
      message += `   Category: ${ticket.category}\n`;
      message += `   Priority: ${ticket.priority}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, '❌ Error fetching support tickets.');
  }
});

// Handle unknown commands
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) {
    return;
  }

  if (!isAdmin(chatId)) {
    return;
  }
});

console.log('✓ ShopFlourite Telegram Bot is running...');
console.log(`✓ Admin Chat ID: ${adminChatId || 'Not configured'}`);

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code);
});

process.on('SIGINT', () => {
  console.log('\n✓ Bot stopped');
  process.exit();
});
