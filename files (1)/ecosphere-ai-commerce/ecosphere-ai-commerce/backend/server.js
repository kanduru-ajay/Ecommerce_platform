// backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ==================== AUTH MIDDLEWARE ====================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorizeRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// ==================== AUTH APIs ====================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'CUSTOMER' } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        cart: { create: {} },
        wishlist: { create: {} },
      },
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCTS APIs ====================
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, sortBy = 'createdAt' } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (category) where.category = category;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    
    const products = await prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: 'desc' },
      include: { seller: { select: { businessName: true } }, _count: { select: { reviews: true } } },
    });
    
    const total = await prisma.product.count({ where });
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        seller: true,
        reviews: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const avgRating = product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : 0;
    
    res.json({ ...product, avgRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', verifyToken, authorizeRole('SELLER', 'ADMIN'), async (req, res) => {
  try {
    const { title, description, category, price, originalPrice, stock, images, carbonScore, ecoScore } = req.body;
    
    const seller = await prisma.seller.findUnique({ where: { userId: req.userId } });
    if (!seller) return res.status(403).json({ error: 'Not a seller' });
    
    const sku = `SKU-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        price,
        originalPrice,
        stock,
        images: images || [],
        sku,
        sellerId: seller.id,
        carbonScore,
        ecoScore,
      },
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', verifyToken, authorizeRole('SELLER', 'ADMIN'), async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const seller = await prisma.seller.findUnique({ where: { userId: req.userId } });
    if (product.sellerId !== seller?.id && req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', verifyToken, authorizeRole('SELLER', 'ADMIN'), async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const seller = await prisma.seller.findUnique({ where: { userId: req.userId } });
    if (product.sellerId !== seller?.id && req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CART APIs ====================
app.get('/api/cart', verifyToken, async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
    });
    
    const subtotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
    res.json({ ...cart, subtotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return res.json(updated);
    }
    
    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cart/:itemId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity },
      include: { product: true },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:itemId', verifyToken, async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST APIs ====================
app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wishlist/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.userId } });
    
    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    
    if (existing) return res.status(400).json({ error: 'Already in wishlist' });
    
    const item = await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
      include: { product: true },
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/wishlist/:itemId', verifyToken, async (req, res) => {
  try {
    await prisma.wishlistItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS APIs ====================
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
    });
    
    if (!cart.items.length) return res.status(400).json({ error: 'Cart empty' });
    
    const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    
    // Create seller orders
    const sellers = new Set(cart.items.map(item => item.product.sellerId));
    for (const sellerId of sellers) {
      await prisma.sellerOrder.create({
        data: { orderId: order.id, sellerId },
      });
    }
    
    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });
    
    if (!order || order.userId !== req.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEWS APIs ====================
app.post('/api/reviews', verifyToken, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.userId, productId } },
    });
    
    if (existing) return res.status(400).json({ error: 'Already reviewed' });
    
    // Call sentiment analysis (mock)
    const sentimentScore = Math.random();
    const sentimentLabel = sentimentScore > 0.6 ? 'positive' : sentimentScore > 0.4 ? 'neutral' : 'negative';
    
    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.userId,
        rating,
        title,
        comment,
        sentimentScore,
        sentimentLabel,
      },
      include: { user: { select: { name: true, avatar: true } } },
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    
    const positive = reviews.filter(r => r.sentimentLabel === 'positive').length;
    const negative = reviews.filter(r => r.sentimentLabel === 'negative').length;
    const neutral = reviews.filter(r => r.sentimentLabel === 'neutral').length;
    
    res.json({
      reviews,
      summary: {
        total: reviews.length,
        positive: ((positive / reviews.length) * 100).toFixed(1) || 0,
        negative: ((negative / reviews.length) * 100).toFixed(1) || 0,
        neutral: ((neutral / reviews.length) * 100).toFixed(1) || 0,
        avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RECOMMENDATIONS ====================
app.get('/api/recommendations', verifyToken, async (req, res) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { userId: req.userId },
      include: { product: true },
      take: 10,
    });
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SELLER APIs ====================
app.post('/api/sellers', verifyToken, async (req, res) => {
  try {
    const { businessName, businessEmail, businessPhone, address } = req.body;
    
    const seller = await prisma.seller.create({
      data: {
        userId: req.userId,
        businessName,
        businessEmail,
        businessPhone,
        address,
      },
    });
    
    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sellers/dashboard', verifyToken, authorizeRole('SELLER'), async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.userId },
      include: {
        products: true,
        analytics: true,
      },
    });
    
    const orders = await prisma.sellerOrder.findMany({
      where: { sellerId: seller.id },
      include: { order: { include: { items: true } } },
    });
    
    res.json({ seller, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ====================
app.get('/api/analytics/platform', verifyToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.count();
    const sellers = await prisma.seller.count();
    const orders = await prisma.order.count();
    const revenue = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    
    const analytics = {
      totalUsers: users,
      totalSellers: sellers,
      totalOrders: orders,
      totalRevenue: revenue._sum.totalRevenue || 0,
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI CHATBOT ====================
app.post('/api/ai/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Mock AI response
    const aiResponses = {
      'best laptop': 'Our top-rated laptops are XPS 13 and MacBook Pro. Which one interests you?',
      'eco-friendly': 'Check our sustainability collection: Eco-bottles, bamboo products, and organic apparel.',
      'budget': 'Great options under ₹5000: Budget headphones, eco-bags, and reusable bottles.',
      'compare': 'I can compare any two products. Which ones would you like me to compare?',
    };
    
    const response = Object.keys(aiResponses).some(key => message.toLowerCase().includes(key))
      ? aiResponses[Object.keys(aiResponses).find(key => message.toLowerCase().includes(key))]
      : 'I can help you find products, compare items, suggest eco-friendly options, and more. What are you looking for?';
    
    res.json({ message: response, reasoning: 'Based on your query and product database' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Server Start ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
