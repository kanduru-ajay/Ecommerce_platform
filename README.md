EcoSphere AI Commerce Platform
An AI-powered, sustainable e-commerce platform designed as a production-ready capstone project.

Status Node React License

🎯 Project Overview
EcoSphere AI Commerce is a full-stack e-commerce platform that combines cutting-edge AI/ML technology with sustainable shopping. It demonstrates senior-level software engineering across multiple domains: frontend development, backend systems, cloud architecture, DevOps, and data science.

Core Features
✅ AI-Powered Shopping Assistant - ChatGPT-style interface for product recommendations ✅ Sustainability Intelligence - Carbon scores, eco-ratings, and green alternatives ✅ Smart Recommendations - Collaborative filtering + content-based algorithms ✅ Demand Forecasting - ML-based inventory and demand predictions ✅ Multi-role System - Customer, Seller, and Admin dashboards ✅ Real-time Analytics - Revenue, user growth, sustainability impact ✅ Modern UI/UX - Glassmorphism, animations, dark/light modes ✅ Production-Ready Deployment - Docker, GitHub Actions, Kubernetes-ready

🏗️ Architecture
Tech Stack
Frontend:

Next.js 15 + React 19 + TypeScript
Tailwind CSS + Framer Motion
Client-side state management
Backend:

Node.js + Express.js
FastAPI for AI services
PostgreSQL + Prisma ORM
JWT Authentication
DevOps & Infrastructure:

Docker + Docker Compose
GitHub Actions CI/CD
Vercel (Frontend deployment)
Railway/Supabase (Backend hosting)
Nginx reverse proxy
AI/ML Services:

Anthropic Claude API for chat
Sentiment analysis
Collaborative filtering
Demand forecasting
System Design
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │◄───────►│   Backend API    │
│  (Next.js 15)   │         │  (Express.js)    │
└─────────────────┘         └──────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                 ┌──▼──┐          ┌───▼────┐      ┌────▼────┐
                 │ DB  │          │ Redis  │      │ AI API   │
                 │ PG  │          │ Cache  │      │ Claude   │
                 └─────┘          └────────┘      └──────────┘
📁 Project Structure
ecosphere-ai-commerce/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── page.tsx            # Homepage
│   │   ├── login/              # Authentication
│   │   ├── products/           # Product listing & details
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Order checkout
│   │   ├── dashboard/          # Customer dashboard
│   │   ├── ai-assistant/       # AI chat interface
│   │   └── globals.css         # Global styles
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
│
├── backend/                     # Express.js API
│   ├── server.js               # Main server file
│   ├── prisma/
│   │   └── schema.prisma       # Database models
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── ai-services/                # Python FastAPI
│   ├── main.py                 # AI service endpoints
│   └── requirements.txt
│
├── database/                    # Database setup
│   └── schema.prisma           # Complete schema
│
├── docs/                        # Documentation
│   ├── API.md                  # API documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── ARCHITECTURE.md         # Architecture details
│
├── docker-compose.yml          # Multi-container setup
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions pipeline
│
└── README.md                   # This file
🚀 Quick Start
Prerequisites
Node.js 20+
PostgreSQL 16+
Docker & Docker Compose (for containerized setup)
Git
Local Development Setup
1. Clone Repository
git clone https://github.com/yourusername/ecosphere-ai-commerce.git
cd ecosphere-ai-commerce
2. Backend Setup
cd backend
cp .env.example .env

# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma db seed

# Start server
npm run dev
# Server runs on http://localhost:5000
3. Frontend Setup
cd frontend
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:3000
4. Access Application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Docs: http://localhost:5000/api/docs
🐳 Docker Deployment
Quick Docker Start
# Build and run everything
docker-compose up --build

# Access services
Frontend: http://localhost:3000
Backend: http://localhost:5000
Database: localhost:5432
Docker Compose Services
postgres - PostgreSQL database
backend - Express.js API
frontend - Next.js application
redis - Cache layer
📊 Database Schema
Core Models
User
├── id, name, email, password
├── role (CUSTOMER | SELLER | ADMIN)
├── orders, reviews, cart
└── wishlist, analytics

Product
├── id, title, description, category
├── price, stock, images
├── carbonScore, ecoScore
├── reviews, seller
└── recommendations

Order
├── id, userId, items
├── totalAmount, status
├── shippingAddress, paymentMethod
└── sellerOrders

Review
├── id, rating, comment
├── sentimentScore, sentimentLabel
├── product, user
└── timestamp
🔌 API Endpoints
Authentication
POST   /api/auth/signup         # Register user
POST   /api/auth/login          # Login user
GET    /api/auth/me             # Get current user
Products
GET    /api/products            # List products (paginated, filtered)
GET    /api/products/:id        # Product details
POST   /api/products            # Create product (SELLER)
PUT    /api/products/:id        # Update product (SELLER)
DELETE /api/products/:id        # Delete product (SELLER)
Cart & Orders
GET    /api/cart                # Get cart
POST   /api/cart/add            # Add to cart
PUT    /api/cart/:itemId        # Update quantity
DELETE /api/cart/:itemId        # Remove item

POST   /api/orders              # Create order
GET    /api/orders              # List user orders
GET    /api/orders/:id          # Order details
Reviews
POST   /api/reviews             # Create review
GET    /api/reviews/:productId  # Product reviews + sentiment
AI Features
GET    /api/recommendations     # Get recommendations
POST   /api/ai/chat             # Chat with AI assistant
GET    /api/ai/sentiment/:productId  # Review sentiment analysis
Analytics & Dashboards
GET    /api/analytics/platform  # Platform analytics (ADMIN)
GET    /api/sellers/dashboard   # Seller dashboard (SELLER)
🤖 AI Features
1. Shopping Assistant
Natural language queries
Product recommendations
Comparison insights
Sustainability guidance
Example Prompts:

"Which laptop is best for AI?"
"Suggest eco-friendly products"
"Recommend products under ₹5000"
"Compare these two products"
2. Smart Recommendations
Collaborative Filtering - Based on user behavior
Content-Based - Similar products
Trending Products - Popular items
Recently Viewed - User history
3. Sentiment Analysis
Review classification
Positive/Negative/Neutral scores
Customer satisfaction metrics
4. Demand Forecasting
Inventory predictions
Seasonal trends
Stock optimization
🌱 Sustainability Features
Each product includes:

Carbon Score (0-100) - Lifecycle carbon footprint
Eco Score (0-100) - Overall sustainability rating
Sustainability Badge - Certification level
Green Alternatives - Eco-friendly substitutes
User Impact Tracking:

Carbon saved (kg CO₂ equivalent)
Trees planted (calculated)
Sustainable choices made
🔐 Security Features
✅ JWT authentication with secure tokens ✅ Password hashing with bcrypt ✅ Role-based access control (RBAC) ✅ CORS protection ✅ SQL injection prevention (Prisma ORM) ✅ Rate limiting (ready for implementation) ✅ HTTPS-ready deployment

📈 Analytics & Monitoring
Platform Analytics
Total users, sellers, revenue
Order metrics & trends
Conversion & retention rates
Sustainability impact
User Analytics
Spending patterns
Order history
Carbon savings
Engagement metrics
Seller Analytics
Revenue & trends
Inventory insights
Sales predictions
Rating metrics
🧪 Testing
Run Tests
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
Test Coverage
Unit tests for utilities & helpers
Integration tests for APIs
Component tests for UI
E2E tests for critical flows
📦 Sample Data
Pre-seeded Data
100+ Products across 6 categories
20 Sellers with business details
500+ Reviews with sentiment analysis
Demand Forecasts for trending items
Seed Database
cd backend
npx prisma db seed
Test Credentials
Customer:

Email: customer@example.com
Password: password123
Seller:

Email: seller@example.com
Password: password123
Admin:

Email: admin@example.com
Password: password123
🚢 Deployment
Local Docker Deployment
docker-compose up --build
Production Deployment
Frontend (Vercel)
vercel deploy --prod
Backend (Railway/Supabase)
railway up
Environment Variables (Production)
Backend (.env)

DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret-key
NODE_ENV=production
ANTHROPIC_API_KEY=your-key
REDIS_URL=redis://...
Frontend (.env.local)

NEXT_PUBLIC_API_URL=https://api.example.com
GitHub Actions CI/CD
Automatic deployment on push to main:

Run tests
Build Docker images
Push to registry
Deploy to server
🛠️ Environment Setup
Create Environment Files
# Backend
cd backend
cp .env.example .env
# Update with your values

# Frontend
cd frontend
cp .env.example .env.local
# Update with your API URL
📚 API Documentation
Full API documentation available at:

Swagger UI: /api/docs
Postman Collection: docs/postman-collection.json
🎓 Learning Outcomes
This project demonstrates:

✅ Full-Stack Development - Frontend, Backend, DevOps integration ✅ System Design - Scalable architecture with microservices readiness ✅ Database Design - Normalized schema with proper relationships ✅ API Design - RESTful APIs with proper error handling ✅ AI/ML Integration - LLM APIs, sentiment analysis, recommendations ✅ Cloud Architecture - Docker, CI/CD, containerized deployment ✅ UI/UX Design - Modern, accessible, responsive design ✅ Authentication & Security - JWT, RBAC, secure practices ✅ Data Science - Demand forecasting, sentiment analysis ✅ DevOps - Automated testing, CI/CD pipelines, monitoring

📋 Checklist
Development:

 Database schema with Prisma
 Backend API with Express
 Frontend pages with Next.js
 Authentication system
 Product management
 Shopping cart & checkout
 AI chat assistant
 Recommendations engine
 Analytics dashboards
 Sustainability tracking
Deployment:

 Docker containerization
 Docker Compose setup
 GitHub Actions CI/CD
 Environment configuration
 Database migrations
 Health checks
🤝 Contributing
Contributions welcome! Please:

Fork the repository
Create feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing-feature)
Open Pull Request
📄 License
This project is licensed under MIT License - see LICENSE file for details.

👨‍💼 About
EcoSphere AI Commerce is built as a final-year B.Tech capstone project with a focus on:

Production-grade code quality
Recruiter-friendly portfolio showcase
Real-world software engineering practices
Sustainable technology impact
📞 Support
Need help?

📖 Check docs/ directory
🐛 Open an issue on GitHub
💬 Discussions available
🙏 Acknowledgments
Built with modern technologies:

Next.js & React team
Prisma ORM
Anthropic Claude API
TailwindCSS community
Built with ❤️ for sustainable e-commerce 🌱
