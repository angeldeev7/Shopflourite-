# ShopFlourite - Guía de Configuración Completa

Esta guía te ayudará a configurar ShopFlourite desde cero.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v14 o superior ([Descargar aquí](https://nodejs.org/))
- **MongoDB** ([Descargar aquí](https://www.mongodb.com/try/download/community))
- **Git** (opcional, para clonar el repositorio)
- **Editor de código** (recomendado: VS Code)

### Verificar Instalación

```bash
node --version    # Debe mostrar v14.x.x o superior
npm --version     # Debe mostrar 6.x.x o superior
mongod --version  # Debe mostrar la versión de MongoDB
```

## 🚀 Instalación Paso a Paso

### Paso 1: Obtener el Código

#### Opción A: Clonar con Git
```bash
git clone https://github.com/angeldeev7/Shopflourite-.git
cd Shopflourite-
```

#### Opción B: Descargar ZIP
1. Ve a https://github.com/angeldeev7/Shopflourite-
2. Click en "Code" → "Download ZIP"
3. Extrae el ZIP y navega a la carpeta

### Paso 2: Iniciar MongoDB

#### En Windows:
```bash
# Abrir CMD como administrador
net start MongoDB
```

#### En macOS:
```bash
brew services start mongodb-community
```

#### En Linux:
```bash
sudo systemctl start mongod
```

### Paso 3: Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
# En la carpeta backend/
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Puerto del servidor
PORT=5000

# Entorno (development/production)
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shopflourite

# JWT Secret (¡IMPORTANTE! Cambia esto por algo seguro)
JWT_SECRET=tu_clave_super_secreta_aqui_cambiar_en_produccion

# URL del Frontend (para CORS)
FRONTEND_URL=http://localhost:5000
```

**⚠️ IMPORTANTE:** En producción, usa una clave JWT fuerte y única. Ejemplo:
```bash
# Generar una clave segura (Linux/Mac):
openssl rand -base64 32
```

### Paso 5: Poblar la Base de Datos (Opcional pero Recomendado)

Ejecuta el script de semilla para crear datos de ejemplo:

```bash
# Desde la carpeta backend/
npm run seed
```

Esto creará:
- ✅ Usuario administrador (email: `admin@shopflourite.com`, password: `admin123`)
- ✅ 6 productos de ejemplo
- ✅ Categorías configuradas

### Paso 6: Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Environment: development
✓ Frontend URL: http://localhost:5000
```

### Paso 7: Acceder a la Aplicación

Abre tu navegador y ve a:
```
http://localhost:5000
```

¡Ya está! 🎉

## 🧪 Probar la Aplicación

### 1. Página Principal
- Abre `http://localhost:5000`
- Deberías ver la página de inicio con productos destacados

### 2. Iniciar Sesión como Admin
- Ve a `http://localhost:5000/login.html`
- Email: `admin@shopflourite.com`
- Password: `admin123`

### 3. Login con WhatsApp (Modo Demo)
- Ve a `http://localhost:5000/login.html`
- Ingresa un número de WhatsApp (formato: +34XXXXXXXXX)
- Ingresa tu nombre
- Click en "Continuar con WhatsApp"

### 4. Explorar Productos
- Ve a `http://localhost:5000/productos.html`
- Prueba los filtros
- Agrega productos al carrito

### 5. Proceso de Compra
- Agrega productos al carrito
- Ve a `http://localhost:5000/checkout.html`
- Completa el formulario de envío
- Selecciona método de pago

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `public/css/styles.css`:

```css
:root {
  --primary: #00d9ff;      /* Azul neon (cambia este) */
  --secondary: #ff00ea;    /* Rosa neon (cambia este) */
  --accent: #7000ff;       /* Púrpura (cambia este) */
  /* ... otros colores ... */
}
```

### Cambiar Nombre de la Tienda

Busca y reemplaza "ShopFlourite" en todos los archivos HTML.

### Agregar Logo

1. Coloca tu logo en `public/images/logo.png`
2. En cada HTML, busca la clase `.logo` y agrega:
```html
<a href="/index.html" class="logo">
  <img src="/images/logo.png" alt="Tu Tienda" style="height: 40px;">
</a>
```

## 📱 Configurar WhatsApp Real

Para producción, necesitarás:

1. **API de WhatsApp Business** (opcional, para verificación real)
2. Por ahora el sistema crea cuentas automáticamente con número de WhatsApp

## 🚢 Despliegue en Producción

### Preparación

1. **Actualiza .env**:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://tu-usuario:password@cluster.mongodb.net/shopflourite
JWT_SECRET=clave_super_segura_generada_con_openssl
FRONTEND_URL=https://tu-dominio.com
```

2. **Usa MongoDB Atlas** (base de datos en la nube):
   - Crea cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crea un cluster gratuito
   - Obtén tu connection string
   - Actualiza MONGODB_URI en .env

### Opción 1: VPS con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicación
cd backend
pm2 start src/server.js --name "shopflourite"

# Auto-inicio en reinicio del servidor
pm2 startup
pm2 save
```

### Opción 2: Heroku

```bash
# Instalar Heroku CLI
# Visita: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Crear app
heroku create tu-shopflourite

# Agregar MongoDB
heroku addons:create mongolab

# Configurar variables
heroku config:set JWT_SECRET=tu_clave_secreta
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Opción 3: Vercel/Netlify (Frontend) + MongoDB Atlas (Backend)

**Backend en Vercel:**
1. Importa el repositorio en Vercel
2. Configura root directory a `backend`
3. Agrega variables de entorno
4. Deploy

## 🔧 Solución de Problemas

### MongoDB no se conecta
```bash
# Verificar si MongoDB está corriendo
# Windows:
net start MongoDB

# Mac:
brew services list

# Linux:
sudo systemctl status mongod
```

### Puerto 5000 en uso
```bash
# Cambiar PORT en .env a otro puerto (ej: 5001)
PORT=5001
```

### Error "Cannot find module"
```bash
# Reinstalar dependencias
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Verifica que FRONTEND_URL en .env coincida con tu URL
- Para desarrollo local, usa `*` o tu dominio exacto

## 📞 Soporte

¿Problemas? Contacta:
- 📧 Email: soporte@shopflourite.com
- 🐛 Issues: https://github.com/angeldeev7/Shopflourite-/issues

## 📚 Recursos Adicionales

- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [API Documentation](./API_DOCUMENTATION.md)

---

**¡Feliz venta! 🛍️**
