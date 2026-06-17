# API Documentation

Complete REST API documentation for EcoSphere AI Commerce.

## Base URL

```
http://localhost:5000
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Auth Endpoints

#### Sign Up
```
POST /api/auth/signup

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER" | "SELLER"
}

Response:
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```

#### Login
```
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me

Response:
{
  "id": "user-id",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Product Endpoints

#### List Products
```
GET /api/products?page=1&limit=12&category=electronics&search=laptop&sortBy=price

Query Parameters:
- page: number (default: 1)
- limit: number (default: 12)
- category: string (optional)
- search: string (optional)
- sortBy: 'createdAt' | 'price' | 'rating'

Response:
{
  "products": [
    {
      "id": "product-id",
      "title": "Laptop",
      "description": "...",
      "price": 50000,
      "category": "electronics",
      "images": ["url"],
      "carbonScore": 45.5,
      "ecoScore": 78.3,
      "averageRating": 4.5
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

#### Get Product Details
```
GET /api/products/:id

Response:
{
  "id": "product-id",
  "title": "Laptop",
  "description": "...",
  "price": 50000,
  "seller": {
    "id": "seller-id",
    "businessName": "Tech Store"
  },
  "reviews": [
    {
      "id": "review-id",
      "rating": 5,
      "comment": "Great product!",
      "user": {
        "name": "John Doe",
        "avatar": "url"
      },
      "sentimentScore": 0.92,
      "sentimentLabel": "positive"
    }
  ],
  "avgRating": 4.5
}
```

#### Create Product (Seller Only)
```
POST /api/products

Headers:
Authorization: Bearer <token>

Body:
{
  "title": "New Product",
  "description": "Product description",
  "category": "electronics",
  "price": 5000,
  "originalPrice": 6000,
  "stock": 100,
  "images": ["url1", "url2"],
  "carbonScore": 45.5,
  "ecoScore": 78.3
}

Response:
{
  "id": "new-product-id",
  "title": "New Product",
  ...
}
```

#### Update Product (Seller)
```
PUT /api/products/:id

Body:
{
  "price": 4500,
  "stock": 50,
  ...
}
```

#### Delete Product (Seller)
```
DELETE /api/products/:id
```

---

### Cart Endpoints

#### Get Cart
```
GET /api/cart

Response:
{
  "id": "cart-id",
  "items": [
    {
      "id": "item-id",
      "product": {
        "id": "product-id",
        "title": "Product",
        "price": 5000
      },
      "quantity": 2
    }
  ],
  "subtotal": 10000
}
```

#### Add to Cart
```
POST /api/cart/add

Body:
{
  "productId": "product-id",
  "quantity": 1
}
```

#### Update Cart Item
```
PUT /api/cart/:itemId

Body:
{
  "quantity": 5
}
```

#### Remove from Cart
```
DELETE /api/cart/:itemId
```

---

### Order Endpoints

#### Create Order
```
POST /api/orders

Body:
{
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "credit-card"
}

Response:
{
  "id": "order-id",
  "userId": "user-id",
  "totalAmount": 10000,
  "status": "PENDING",
  "items": [...]
}
```

#### Get User Orders
```
GET /api/orders

Response:
[
  {
    "id": "order-id",
    "totalAmount": 10000,
    "status": "DELIVERED",
    "createdAt": "2024-01-01T00:00:00Z",
    "items": [...]
  }
]
```

#### Get Order Details
```
GET /api/orders/:id
```

---

### Review Endpoints

#### Create Review
```
POST /api/reviews

Body:
{
  "productId": "product-id",
  "rating": 5,
  "title": "Excellent!",
  "comment": "This product is amazing!"
}
```

#### Get Product Reviews
```
GET /api/reviews/:productId

Response:
{
  "reviews": [
    {
      "id": "review-id",
      "rating": 5,
      "comment": "Great!",
      "user": { ... },
      "sentimentLabel": "positive"
    }
  ],
  "summary": {
    "total": 10,
    "positive": 80,
    "negative": 10,
    "neutral": 10,
    "avgRating": 4.5
  }
}
```

---

### Wishlist Endpoints

#### Get Wishlist
```
GET /api/wishlist

Response:
{
  "id": "wishlist-id",
  "items": [
    {
      "id": "item-id",
      "product": { ... }
    }
  ]
}
```

#### Add to Wishlist
```
POST /api/wishlist/add

Body:
{
  "productId": "product-id"
}
```

#### Remove from Wishlist
```
DELETE /api/wishlist/:itemId
```

---

### AI Features

#### Get Recommendations
```
GET /api/recommendations

Response:
[
  {
    "id": "recommendation-id",
    "product": { ... },
    "score": 0.92,
    "reason": "Based on your browsing history",
    "type": "collaborative"
  }
]
```

#### Chat with AI Assistant
```
POST /api/ai/chat

Body:
{
  "message": "Which laptop is best for AI?"
}

Response:
{
  "message": "Based on your requirements...",
  "reasoning": "Considered your browsing history and preferences"
}
```

---

### Analytics & Dashboards

#### Get Platform Analytics (Admin)
```
GET /api/analytics/platform

Response:
{
  "totalUsers": 1000,
  "totalSellers": 50,
  "totalOrders": 5000,
  "totalRevenue": 5000000
}
```

#### Get Seller Dashboard
```
GET /api/sellers/dashboard

Response:
{
  "seller": {
    "id": "seller-id",
    "businessName": "Store Name",
    "products": [...]
  },
  "orders": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
