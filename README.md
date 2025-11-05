# ShopFlourite - E-commerce Platform

ShopFlourite es una plataforma de comercio electrónico moderna con diseño glass/neon profesional, frontend modular en HTML/CSS/JS y backend Express con MongoDB.

## 🌟 Características

### Frontend (HTML/CSS/JS)
- ✨ Diseño glass/neon moderno y profesional
- 📱 Totalmente responsive y optimizado para móviles
- 🎨 Interfaz de usuario atractiva con efectos visuales
- 🍔 Menú hamburguesa animado para navegación móvil
- 🛒 Carrito de compras con gestión local
- 📦 Catálogo de productos con filtros avanzados
- 💳 Proceso de checkout profesional
- 👤 Perfiles de usuario editables
- 📱 Login sencillo por WhatsApp
- ⭐ Sistema de reseñas de productos
- 🎫 Sistema de soporte al cliente
- 📰 Sección de novedades
- 📋 Términos y condiciones

### Backend (Node.js/Express)
- 🔐 Autenticación JWT
- 📱 Login con WhatsApp
- 🗄️ Base de datos MongoDB
- 📦 Gestión completa de productos
- 🛒 Sistema de pedidos
- ⭐ Sistema de reseñas
- 🎫 Sistema de tickets de soporte
- 📧 Notificaciones por email
- 🔒 Seguridad con Helmet y CORS

## 📋 Requisitos Previos

- Node.js v14 o superior
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopflourite
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
FRONTEND_URL=http://localhost:5000
```

### 3. Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 🌐 Estructura de Páginas

- **/** - Página de inicio con productos destacados
- **/productos.html** - Catálogo completo con filtros
- **/checkout.html** - Carrito y proceso de pago
- **/login.html** - Inicio de sesión (WhatsApp o email)
- **/perfil.html** - Perfil de usuario editable
- **/mis-compras.html** - Historial de pedidos
- **/soporte.html** - Centro de soporte y ayuda
- **/novedades.html** - Últimas novedades y ofertas
- **/terminos.html** - Términos y condiciones

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión con email
- `POST /api/auth/whatsapp-login` - Inicio de sesión con WhatsApp
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/my-orders` - Obtener mis pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `PUT /api/orders/:id/status` - Actualizar estado (admin)

### Reseñas
- `GET /api/reviews/product/:productId` - Obtener reseñas de producto
- `POST /api/reviews` - Crear reseña
- `PUT /api/reviews/:id` - Actualizar reseña
- `DELETE /api/reviews/:id` - Eliminar reseña

### Soporte
- `POST /api/support` - Crear ticket de soporte
- `GET /api/support/my-tickets` - Obtener mis tickets
- `GET /api/support/:id` - Obtener ticket específico
- `POST /api/support/:id/message` - Agregar mensaje a ticket

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `/public/css/styles.css`:

```css
:root {
  --primary: #00d9ff;      /* Color principal (cyan neon) */
  --secondary: #ff00ea;    /* Color secundario (magenta neon) */
  --accent: #7000ff;       /* Color de acento (púrpura) */
  --bg-dark: #0a0a0f;      /* Fondo oscuro */
  --success: #00ff88;      /* Color de éxito (verde neon) */
  --warning: #ffaa00;      /* Color de advertencia (naranja) */
  --error: #ff3366;        /* Color de error (rojo) */
}
```

### Cambiar Nombre de la Marca

1. Edita el logo en cada archivo HTML: busca `ShopFlourite` y reemplázalo
2. Actualiza el título en cada `<title>` tag
3. Modifica los meta tags según sea necesario

## 🚢 Despliegue en VPS

### Usando PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar backend
cd backend
pm2 start src/server.js --name "shopflourite-backend"

# Guardar configuración
pm2 save
pm2 startup
```

### Configurar Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Servir archivos estáticos
    location / {
        root /ruta/a/Shopflourite-/public;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos subidos
    location /uploads {
        alias /ruta/a/Shopflourite-/backend/uploads;
    }
}
```

## 🔒 Seguridad

- JWT para autenticación
- Contraseñas hasheadas con bcrypt
- Helmet para headers de seguridad
- CORS configurado
- Validación de entrada con express-validator
- Protección contra inyección SQL/NoSQL

## 📱 Características de WhatsApp Login

El sistema permite a los usuarios iniciar sesión simplemente con su número de WhatsApp:

1. Usuario ingresa su número de WhatsApp y nombre
2. Si es nuevo, se crea una cuenta automáticamente
3. Si ya existe, se inicia sesión directamente
4. No requiere contraseña para WhatsApp login
5. Opción de login tradicional con email/contraseña también disponible

## 🎯 Estado de Categorías de Productos

Categorías disponibles:
- Electronics (Electrónica)
- Clothing (Ropa)
- Home (Hogar)
- Beauty (Belleza)
- Sports (Deportes)
- Books (Libros)
- Toys (Juguetes)
- Other (Otros)

## 📊 Estados de Pedidos

- `pending` - Pendiente
- `processing` - Procesando
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

## 💳 Métodos de Pago

- Tarjeta de crédito/débito
- PayPal
- Transferencia bancaria
- Efectivo contra entrega

## 🆘 Soporte

Para soporte y consultas:
- 📧 Email: soporte@shopflourite.com
- 📱 WhatsApp: +34 XXX XXX XXX
- 💬 Sistema de tickets en la web

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Créditos

Desarrollado con:
- Node.js & Express
- MongoDB & Mongoose
- HTML5, CSS3, JavaScript
- JWT para autenticación
- Helmet para seguridad

---

**ShopFlourite** - Tu tienda online con estilo profesional 🛍️✨
