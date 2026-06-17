# 🚀 EcoSphere AI Commerce - Quick Start Guide

## Fastest Way to Get Running

### Option 1: Docker (Recommended - 2 minutes)

```bash
# Clone and enter directory
git clone <repository>
cd ecosphere-ai-commerce

# Run entire stack
docker-compose up --build

# Access application
Frontend: http://localhost:3000
Backend: http://localhost:5000
Database: localhost:5432
```

**Login Credentials:**
- Customer: customer@example.com / password123
- Seller: seller@example.com / password123
- Admin: admin@example.com / password123

---

### Option 2: Local Development (5 minutes)

#### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Setup database (requires PostgreSQL running)
npx prisma db push
npx prisma db seed

# Start server
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Frontend Setup (new terminal)

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📁 Key Files to Explore

### Frontend Pages
- **Homepage**: `/frontend/app/page.tsx` - Hero, features, testimonials
- **Products**: `/frontend/app/products/page.tsx` - Listing with filters
- **AI Assistant**: `/frontend/app/ai-assistant/page.tsx` - ChatGPT-style interface
- **Cart**: `/frontend/app/cart/page.tsx` - Shopping cart
- **Checkout**: `/frontend/app/checkout/page.tsx` - Multi-step checkout
- **Dashboard**: `/frontend/app/dashboard/page.tsx` - User analytics

### Backend API
- **Main Server**: `/backend/server.js` - All 40+ endpoints
- **Database**: `/database/schema.prisma` - Complete schema
- **Seed Data**: `/backend/prisma/seed.js` - 100+ products

### DevOps
- **Docker Setup**: `/docker-compose.yml` - Full stack orchestration
- **CI/CD**: `/.github/workflows/ci-cd.yml` - Automated testing & deployment

---

## 🧪 Test the Application

### 1. Login as Customer
- Email: customer@example.com
- Password: password123

### 2. Browse Products
- Click "Products" in navigation
- Try filters and search
- View product details

### 3. Try AI Assistant
- Click "AI Assistant"
- Ask: "Which laptop is best for AI?"
- Ask: "Suggest eco-friendly products"

### 4. Shopping Flow
- Add items to cart
- View cart
- Proceed to checkout
- Place order

### 5. Dashboard
- View order history
- Check analytics
- See carbon savings

---

## 🔌 API Testing

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password123"}'
```

### Chat with AI
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"message":"Which products are eco-friendly?"}'
```

---

## 📊 Database

### Access PostgreSQL
```bash
psql postgresql://ecosphere:secure_password_123@localhost:5432/ecosphere_db

# View tables
\dt

# Check users
SELECT * FROM "User";

# Check products
SELECT * FROM "Product" LIMIT 5;
```

### Reset Database
```bash
cd backend
npx prisma db reset
npx prisma db seed
```

---

## 📚 Documentation

- **README.md** - Full project documentation
- **docs/API.md** - Complete API reference
- **docs/DEPLOYMENT.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - Detailed feature list

---

## 🛠️ Common Commands

### Frontend
```bash
cd frontend
npm run dev      # Start development
npm run build    # Build for production
npm run lint     # Check code quality
npm start        # Start production server
```

### Backend
```bash
cd backend
npm run dev      # Start with nodemon
npm start        # Start production
npx prisma studio  # Explore database UI
npx prisma db seed  # Reseed database
```

### Docker
```bash
docker-compose up              # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose ps              # View running containers
```

---

## 🎯 Next Steps

### 1. Explore Code
- Frontend pages in `/frontend/app`
- Backend API in `/backend/server.js`
- Database schema in `/database/schema.prisma`

### 2. Customize
- Modify product data
- Add new features
- Integrate with real APIs

### 3. Deploy
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway or AWS
- Database: Use Supabase or AWS RDS

### 4. Production
- Set environment variables
- Enable HTTPS
- Configure real payment processing
- Setup monitoring & logging

---

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://ecosphere:secure_password_123@postgres:5432/ecosphere_db
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9    # Frontend
lsof -ti:5000 | xargs kill -9    # Backend
lsof -ti:5432 | xargs kill -9    # Database
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or start PostgreSQL separately
docker run -d \
  --name postgres \
  -e POSTGRES_USER=ecosphere \
  -e POSTGRES_PASSWORD=secure_password_123 \
  -p 5432:5432 \
  postgres:16-alpine
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Read **docs/API.md** for API details
3. Review **PROJECT_SUMMARY.md** for feature overview
4. Check error messages in console/logs

---

## ✅ Quick Checklist

- [ ] Clone repository
- [ ] Run `docker-compose up` or manual setup
- [ ] Access frontend at http://localhost:3000
- [ ] Login with test credentials
- [ ] Browse products
- [ ] Try AI assistant
- [ ] Place test order
- [ ] Check dashboard
- [ ] Explore API endpoints
- [ ] Read full documentation

---

**Ready to build? Let's go! 🚀**

Questions? Check the full README or docs folder.
