const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.baseURL = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId, text, options = {}) {
    if (!this.botToken) {
      console.log('Telegram bot token not configured');
      return null;
    }

    try {
      const response = await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: chatId || this.adminChatId,
        text,
        parse_mode: 'HTML',
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Telegram sendMessage error:', error.message);
      return null;
    }
  }

  async notifyNewOrder(order) {
    const message = `
🛍️ <b>Nueva Orden Recibida</b>

📦 Orden ID: #${order._id.toString().slice(-6)}
👤 Cliente: ${order.user.name}
📧 Email: ${order.user.email}
💰 Total: $${order.totalAmount.toFixed(2)}
📱 WhatsApp: ${order.user.whatsapp || 'N/A'}
💬 Telegram: ${order.user.telegram || 'N/A'}

📍 Dirección de Envío:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state}
${order.shippingAddress.zipCode}

🛒 Productos: ${order.items.length} item(s)
${order.items.map(item => {
  const productName = item.product && item.product.name ? item.product.name : 'Producto desconocido';
  return `  • ${productName} x${item.quantity} - $${item.price}`;
}).join('\n')}

⏰ ${new Date(order.createdAt).toLocaleString('es-MX')}
    `.trim();

    return this.sendMessage(this.adminChatId, message);
  }

  async notifyNewUser(user) {
    const message = `
👤 <b>Nuevo Usuario Registrado</b>

Nombre: ${user.name}
Email: ${user.email}
WhatsApp: ${user.whatsapp || 'N/A'}
Telegram: ${user.telegram || 'N/A'}

⏰ ${new Date(user.createdAt).toLocaleString('es-MX')}
    `.trim();

    return this.sendMessage(this.adminChatId, message);
  }

  async notifyNewSupportTicket(ticket) {
    const message = `
🎫 <b>Nuevo Ticket de Soporte</b>

Ticket ID: #${ticket._id.toString().slice(-6)}
Usuario: ${ticket.user.name}
Email: ${ticket.user.email}
WhatsApp: ${ticket.user.whatsapp || 'N/A'}

Asunto: ${ticket.subject}
Categoría: ${ticket.category}
Prioridad: ${ticket.priority}

Mensaje:
${ticket.messages[0].message}

⏰ ${new Date(ticket.createdAt).toLocaleString('es-MX')}
    `.trim();

    return this.sendMessage(this.adminChatId, message);
  }

  async notifyPaymentProofUploaded(order) {
    const message = `
💳 <b>Comprobante de Pago Subido</b>

📦 Orden ID: #${order._id.toString().slice(-6)}
👤 Cliente: ${order.user.name}
📧 Email: ${order.user.email}
💰 Total: $${order.totalAmount.toFixed(2)}

Por favor, verifica el comprobante de pago.

⏰ ${new Date().toLocaleString('es-MX')}
    `.trim();

    return this.sendMessage(this.adminChatId, message);
  }

  async notifyOrderStatusChange(order, newStatus) {
    // Notify customer if they have telegram
    if (order.user.telegram) {
      const customerMessage = `
🔔 <b>Actualización de tu Orden</b>

Tu orden #${order._id.toString().slice(-6)} ha sido actualizada.

Estado: <b>${newStatus}</b>
Total: $${order.totalAmount.toFixed(2)}

⏰ ${new Date().toLocaleString('es-MX')}
      `.trim();

      // Try to send to customer's telegram username (would need proper chat_id mapping)
      // For now, just notify admin
    }

    // Notify admin
    const adminMessage = `
🔄 <b>Estado de Orden Actualizado</b>

Orden ID: #${order._id.toString().slice(-6)}
Cliente: ${order.user.name}
Nuevo Estado: <b>${newStatus}</b>

⏰ ${new Date().toLocaleString('es-MX')}
    `.trim();

    return this.sendMessage(this.adminChatId, adminMessage);
  }
}

module.exports = new TelegramService();
