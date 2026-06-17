// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const categories = ['electronics', 'clothing', 'home', 'eco-products', 'beauty'];

const products = [
  { title: 'Eco-Friendly Laptop Backpack', category: 'eco-products', price: 2499, carbonScore: 45, ecoScore: 85 },
  { title: 'Sustainable Bamboo Utensils Set', category: 'eco-products', price: 599, carbonScore: 20, ecoScore: 95 },
  { title: 'Organic Cotton T-Shirt', category: 'clothing', price: 899, carbonScore: 15, ecoScore: 90 },
  { title: 'Recycled Plastic Water Bottle', category: 'eco-products', price: 749, carbonScore: 10, ecoScore: 92 },
  { title: 'Solar Power Bank 20000mAh', category: 'electronics', price: 3499, carbonScore: 35, ecoScore: 88 },
  { title: 'Hemp Yoga Mat', category: 'home', price: 1999, carbonScore: 25, ecoScore: 87 },
  { title: 'Bamboo Desk Organizer', category: 'home', price: 1299, carbonScore: 18, ecoScore: 88 },
  { title: 'Natural Face Moisturizer', category: 'beauty', price: 599, carbonScore: 12, ecoScore: 85 },
  { title: 'Organic Coffee Beans 500g', category: 'eco-products', price: 799, carbonScore: 22, ecoScore: 83 },
  { title: 'Eco-Friendly Phone Case', category: 'electronics', price: 499, carbonScore: 8, ecoScore: 90 },
  { title: 'Sustainable Linen Bedsheet Set', category: 'home', price: 4499, carbonScore: 30, ecoScore: 89 },
  { title: 'Natural Soap Bar Pack (6)', category: 'beauty', price: 699, carbonScore: 5, ecoScore: 95 },
  { title: 'Recycled Glass Storage Containers', category: 'home', price: 1899, carbonScore: 15, ecoScore: 91 },
  { title: 'Wireless Eco Earbuds', category: 'electronics', price: 2999, carbonScore: 40, ecoScore: 80 },
  { title: 'Organic Face Mask Powder', category: 'beauty', price: 449, carbonScore: 8, ecoScore: 88 },
];

async function main() {
  console.log('Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'CUSTOMER',
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      name: 'Sarah Smith',
      email: 'seller@example.com',
      password: hashedPassword,
      role: 'SELLER',
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  console.log('Users created:', { customer: customer.id, seller: sellerUser.id, admin: adminUser.id });

  // Create sellers
  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      businessName: 'EcoSphere Store',
      businessEmail: 'store@ecosphere.com',
      businessPhone: '+91-9876543210',
      address: 'Mumbai, Maharashtra',
      verified: true,
    },
  });

  console.log('Seller created:', seller.id);

  // Create products
  let createdCount = 0;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      await prisma.product.create({
        data: {
          title: product.title,
          description: `High-quality ${product.category} product with sustainable practices.`,
          category: product.category,
          price: product.price,
          originalPrice: product.price * 1.2,
          stock: Math.floor(Math.random() * 100) + 10,
          sku: `SKU-${Date.now()}-${i}`,
          images: ['/product-placeholder.jpg'],
          sellerId: seller.id,
          carbonScore: product.carbonScore,
          ecoScore: product.ecoScore,
          sustainabilityBadge: 'CERTIFIED',
        },
      });
      createdCount++;
    } catch (error) {
      console.log(`Product "${product.title}" already exists or error:`, error.message);
    }
  }

  console.log(`${createdCount} products created`);

  // Create sample reviews
  const allProducts = await prisma.product.findMany({ take: 5 });
  for (const product of allProducts) {
    for (let i = 0; i < 3; i++) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          rating: Math.floor(Math.random() * 5) + 1,
          title: 'Great product!',
          comment: 'This product exceeded my expectations. Very satisfied!',
          sentimentScore: Math.random(),
          sentimentLabel: 'positive',
        },
      }).catch(() => {});
    }
  }

  console.log('Sample reviews created');

  // Create sample order
  const product = allProducts[0];
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: product.price * 2,
      status: 'DELIVERED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'credit-card',
      shippingAddress: '123 Main Street, Mumbai, MH 400001',
      items: {
        create: {
          productId: product.id,
          quantity: 2,
          price: product.price,
        },
      },
    },
  });

  console.log('Sample order created:', order.id);

  // Create analytics
  await prisma.userAnalytics.create({
    data: {
      userId: customer.id,
      totalSpent: order.totalAmount,
      orderCount: 1,
      carbonSaved: 50,
      engagement: 85,
    },
  }).catch(() => {});

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
