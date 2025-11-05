// Seed script to populate database with sample data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Smartphone Premium XZ',
    description: 'Último modelo con pantalla OLED, 256GB de almacenamiento y cámara de 108MP. Diseño elegante y potencia increíble.',
    price: 799.99,
    category: 'electronics',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
    featured: true,
    rating: 4.8,
    reviewCount: 156
  },
  {
    name: 'Laptop Pro 15"',
    description: 'Procesador Intel i7, 16GB RAM, SSD 512GB. Perfecta para trabajo y gaming.',
    price: 1299.99,
    category: 'electronics',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
    featured: true,
    rating: 4.9,
    reviewCount: 203
  },
  {
    name: 'Auriculares Bluetooth Pro',
    description: 'Cancelación de ruido activa, 30h de batería, sonido Hi-Fi premium.',
    price: 249.99,
    category: 'electronics',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    featured: false,
    rating: 4.7,
    reviewCount: 89
  },
  {
    name: 'Smartwatch Sport',
    description: 'Monitor de frecuencia cardíaca, GPS, resistente al agua, 7 días de batería.',
    price: 199.99,
    category: 'electronics',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    featured: true,
    rating: 4.6,
    reviewCount: 142
  },
  {
    name: 'Cámara Digital 4K',
    description: 'Cámara profesional con lente intercambiable, grabación 4K a 60fps.',
    price: 899.99,
    category: 'electronics',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    featured: false,
    rating: 4.9,
    reviewCount: 67
  },
  {
    name: 'Tablet Pro 12"',
    description: 'Pantalla 2K, procesador octa-core, 128GB, compatible con stylus.',
    price: 599.99,
    category: 'electronics',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'],
    featured: true,
    rating: 4.5,
    reviewCount: 178
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✓ Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✓ Cleared existing data');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@shopflourite.com',
      password: hashedPassword,
      phone: '+34600000000',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✓ Created admin user (email: admin@shopflourite.com, password: admin123)');
    
    // Create sample products
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    console.log(`✓ Created ${sampleProducts.length} sample products`);
    
    console.log('\n=== Seed completed successfully! ===\n');
    console.log('Admin credentials:');
    console.log('  Email: admin@shopflourite.com');
    console.log('  Password: admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
