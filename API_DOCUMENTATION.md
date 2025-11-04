# ShopFlourite API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "..."
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "user": { ... }
}
```

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

---

## 🛍️ Product Endpoints

### Get All Products
**GET** `/products`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `search` - Search in name/description
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sort` - Sort field (e.g., `-createdAt`, `price`, `-rating`)
- `featured` - Filter featured products (`true`/`false`)

**Example:**
```
GET /products?category=electronics&sort=-rating&page=1&limit=12
```

**Response:**
```json
{
  "products": [ ... ],
  "totalPages": 5,
  "currentPage": 1,
  "totalProducts": 58
}
```

### Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "product": {
    "_id": "...",
    "name": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "category": "electronics",
    "images": ["url1", "url2"],
    "stock": 100,
    "rating": 4.5,
    "reviewCount": 10,
    "featured": true
  }
}
```

### Create Product (Admin Only)
**POST** `/products`

**Headers:** 
- `Authorization: Bearer {admin_token}`
- `Content-Type: multipart/form-data`

**Body (FormData):**
```
name: Product Name
description: Product description
price: 29.99
category: electronics
stock: 100
featured: true
images: [file1, file2]
tags: ["tag1", "tag2"]
```

### Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "name": "Updated Name",
  "price": 39.99,
  "stock": 50
}
```

### Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:** `Authorization: Bearer {admin_token}`

---

## 🛒 Cart Endpoints

### Get Cart
**GET** `/cart`

**Headers:** `Authorization: Bearer {token}`

### Add to Cart
**POST** `/cart/add`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

### Update Cart Item
**PUT** `/cart/update`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 3
}
```

### Remove from Cart
**DELETE** `/cart/remove/:productId`

**Headers:** `Authorization: Bearer {token}`

---

## 📦 Order Endpoints

### Create Order
**POST** `/orders`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver after 5 PM"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "...",
    "user": "...",
    "items": [...],
    "totalAmount": 89.97,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "createdAt": "..."
  }
}
```

### Get User's Orders
**GET** `/orders/my-orders`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

### Get All Orders (Admin Only)
**GET** `/orders`

**Headers:** `Authorization: Bearer {admin_token}`

**Query Parameters:**
- `page`, `limit`
- `status` - Filter by order status
- `paymentStatus` - Filter by payment status

### Get Single Order
**GET** `/orders/:id`

**Headers:** `Authorization: Bearer {token}`

### Update Order Status (Admin Only)
**PUT** `/orders/:id/status`

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRACK123456"
}
```

### Upload Payment Proof
**POST** `/orders/:id/payment-proof`

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body (FormData):**
```
proof: [file]
```

### Cancel Order
**PUT** `/orders/:id/cancel`

**Headers:** `Authorization: Bearer {token}`

---

## ⭐ Review Endpoints

### Get Product Reviews
**GET** `/reviews/product/:productId`

**Query Parameters:**
- `page`, `limit`
- `sort` - Sort order (e.g., `-createdAt`, `rating`)

### Create Review
**POST** `/reviews`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "productId": "product_id_here",
  "rating": 5,
  "comment": "Great product! Highly recommend."
}
```

### Update Review
**PUT** `/reviews/:id`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

### Delete Review
**DELETE** `/reviews/:id`

**Headers:** `Authorization: Bearer {token}`

### Mark Review as Helpful
**POST** `/reviews/:id/helpful`

**Headers:** `Authorization: Bearer {token}`

---

## 🎫 Support Endpoints

### Get User's Tickets
**GET** `/support/my-tickets`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`, `limit`
- `status` - Filter by status

### Get All Tickets (Admin Only)
**GET** `/support`

**Headers:** `Authorization: Bearer {admin_token}`

**Query Parameters:**
- `page`, `limit`
- `status`, `priority`, `category`

### Get Single Ticket
**GET** `/support/:id`

**Headers:** `Authorization: Bearer {token}`

### Create Support Ticket
**POST** `/support`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "subject": "Issue with order",
  "category": "order",
  "priority": "high",
  "message": "I have an issue with my recent order...",
  "relatedOrder": "order_id_here"
}
```

### Add Message to Ticket
**POST** `/support/:id/message`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "message": "Thank you for the update..."
}
```

### Update Ticket Status (Admin Only)
**PUT** `/support/:id/status`

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "status": "in_progress",
  "priority": "urgent"
}
```

---

## 👥 User Management (Admin Only)

### Get All Users
**GET** `/users`

**Headers:** `Authorization: Bearer {admin_token}`

**Query Parameters:**
- `page`, `limit`
- `role` - Filter by role
- `isActive` - Filter by active status

### Get Single User
**GET** `/users/:id`

**Headers:** `Authorization: Bearer {admin_token}`

### Update User
**PUT** `/users/:id`

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "name": "Updated Name",
  "role": "admin",
  "isActive": true
}
```

---

## 💳 Payment Endpoints

### Process Payment
**POST** `/payments/process`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "orderId": "order_id_here",
  "paymentMethod": "credit_card",
  "paymentDetails": { ... }
}
```

### Get Payment Methods
**GET** `/payments/methods`

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Error Response Format

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

---

## Categories

Available product categories:
- `electronics`
- `clothing`
- `home`
- `beauty`
- `sports`
- `books`
- `toys`
- `other`

## Order Statuses

- `pending` - Order placed, awaiting processing
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## Payment Statuses

- `pending` - Payment pending
- `paid` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

## Support Ticket Statuses

- `open` - Newly created
- `in_progress` - Being handled
- `resolved` - Issue resolved
- `closed` - Ticket closed

---

**Need help?** Check the [README.md](README.md) or create an issue on GitHub.
