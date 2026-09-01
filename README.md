# 🍽️ Campus Canteen — College Food Ordering System

A full-stack web application for college canteen management. Students can browse the menu, place orders, and receive invoices. Canteen staff can manage the menu and fulfill incoming orders in real-time.

---

## 🏗️ Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| **Frontend**   | React.js 18 + Tailwind CSS + Chart.js     |
| **Backend**    | Node.js + Express.js                      |
| **Database**   | MongoDB + Mongoose ODM                    |
| **Auth**       | JWT (JSON Web Tokens) + bcrypt            |
| **Build Tool** | Vite                                      |
| **PWA**        | Service Worker + Web App Manifest         |

---

## 📦 Features

### 🎓 Student Features
- ✅ **Browse Menu** — View all canteen food items with search, filter & sort
- ✅ **Shopping Cart** — Add/remove items, adjust quantities (persisted in localStorage)
- ✅ **Place Orders** — Order food with phone number and optional notes
- ✅ **Invoice System** — Each order gets a unique invoice number (e.g. `INV-20260328-0001`)
- ✅ **Order Tracking** — Real-time status updates: Pending → Preparing → Ready for Pickup → Picked Up
- ✅ **Order History** — View all past orders with invoice numbers

### 🏪 Canteen Staff (Admin) Features
- ✅ **Incoming Orders** — See all student orders with customer name, email, phone & invoice number
- ✅ **Order Management** — Update order status (Start Preparing → Ready for Pickup → Mark Picked Up)
- ✅ **Auto-Refresh** — Orders page refreshes every 15 seconds for new incoming orders
- ✅ **Menu Management** — Full CRUD (Create, Read, Update, Delete) for menu items
- ✅ **Analytics Dashboard** — Charts for popular dishes, order stats, revenue trends

### 🔐 Authentication & Roles
- ✅ **Separate Login/Register** — Tabs for Student and Canteen Staff
- ✅ **Role-Based Access** — Students see ordering UI, staff sees order management
- ✅ **Admin Registration** — Requires canteen name, phone number, and password
- ✅ **Route Protection** — Admin can't access ordering pages, students can't access admin pages

### 🔍 Search & Filter
- ✅ **Search** food items by name
- ✅ **Filter** by category (Veg, Non-Veg, Snacks, Desserts, Beverages, Main Course)
- ✅ **Filter** by price range (min/max)
- ✅ **Sort** by price (low→high, high→low), popularity, rating, or latest

### 📊 Analytics Dashboard (Admin)
- ✅ **Popular Dishes** — Bar chart showing most ordered items
- ✅ **Order Statistics** — Doughnut chart showing order status breakdown
- ✅ **Revenue Trends** — Line chart showing monthly revenue over time

### 📱 Progressive Web App (PWA)
- ✅ Installable on mobile devices via "Add to Home Screen"
- ✅ Offline-capable with Service Worker caching
- ✅ App-like splash screen and native feel

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **MongoDB** — [Download Community Edition](https://www.mongodb.com/try/download/community)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FSAD
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodie-express
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 4: Seed the Database

```bash
cd backend
node seed/seedData.js
```
This creates:
- **3 users** (1 canteen admin + 2 students)
- **25 menu items** across 6 categories
- **3 sample orders** with different statuses

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 6: Start the Application

**Terminal 1 — Backend:**
```powershell
cd backend; npm run dev
```
Server starts at `http://localhost:5000`

**Terminal 2 — Frontend:**
```powershell
cd frontend; npm run dev
```
App opens at `http://localhost:3000`

---

## 📋 Demo Login Credentials

| Role               | Email              | Password  |
| ------------------ | ------------------ | --------- |
| 🏪 **Canteen Staff** | admin@canteen.com  | admin123  |
| 🎓 Student 1        | john@example.com   | user123   |
| 🎓 Student 2        | jane@example.com   | user123   |

---

## 🧾 Invoice System

Every order generates a unique invoice number in the format:

```
INV-YYYYMMDD-NNNN
```

Example: `INV-20260328-0001`

- **Students** can see their invoice number on the order tracking page
- **Canteen Staff** sees the invoice number + student name/phone on the incoming orders page
- Students show the invoice number to canteen staff for food pickup

---

## 📡 REST API Documentation

### Authentication

| Method | Endpoint            | Description      | Auth     |
| ------ | ------------------- | ---------------- | -------- |
| POST   | `/api/auth/register`| Register new user| No       |
| POST   | `/api/auth/login`   | Login            | No       |
| GET    | `/api/auth/profile` | Get user profile | Required |

### Menu Items

| Method | Endpoint                    | Description              | Auth     |
| ------ | --------------------------- | ------------------------ | -------- |
| GET    | `/api/menu`                 | List items (paginated)   | No       |
| GET    | `/api/menu/:id`             | Get single item          | No       |
| GET    | `/api/menu/categories/list` | Get all categories       | No       |
| POST   | `/api/menu`                 | Create item              | Admin    |
| PUT    | `/api/menu/:id`             | Update item              | Admin    |
| DELETE | `/api/menu/:id`             | Delete item              | Admin    |

**Query Parameters for GET `/api/menu`:**
| Param      | Description                          | Example              |
| ---------- | ------------------------------------ | -------------------- |
| `search`   | Search items by name                 | `?search=chicken`    |
| `category` | Filter by category                   | `?category=veg`      |
| `minPrice` | Minimum price filter                 | `?minPrice=100`      |
| `maxPrice` | Maximum price filter                 | `?maxPrice=500`      |
| `sort`     | Sort order (price_asc, price_desc, popular, rating, latest) | `?sort=popular` |
| `page`     | Page number                          | `?page=2`            |
| `limit`    | Items per page                       | `?limit=12`          |

### Orders

| Method | Endpoint                   | Description           | Auth          |
| ------ | -------------------------- | --------------------- | ------------- |
| POST   | `/api/orders`              | Create order          | Student       |
| GET    | `/api/orders/my`           | Get my orders         | Student       |
| GET    | `/api/orders/:id`          | Get order details     | Owner / Admin |
| GET    | `/api/orders/:id/invoice`  | Get order invoice     | Owner / Admin |
| GET    | `/api/orders`              | Get all orders        | Admin         |
| PUT    | `/api/orders/:id/status`   | Update order status   | Admin         |
| PUT    | `/api/orders/:id/cancel`   | Cancel order          | Student       |

### Analytics

| Method | Endpoint                   | Description           | Auth     |
| ------ | -------------------------- | --------------------- | -------- |
| GET    | `/api/analytics/popular`   | Popular dishes        | No       |
| GET    | `/api/analytics/orders`    | Order statistics      | Admin    |
| GET    | `/api/analytics/revenue`   | Revenue summary       | Admin    |

---

## 📂 Project Structure

```
FSAD/
├── README.md
│
├── backend/                        # Node.js + Express API Server
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Login, register, profile
│   │   ├── menuController.js       # CRUD + search/filter/pagination
│   │   ├── orderController.js      # Order creation, invoice, status tracking
│   │   └── analyticsController.js  # Charts & statistics
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification + admin check
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt + canteenName for admin)
│   │   ├── MenuItem.js             # Menu item schema (text index)
│   │   └── Order.js                # Order schema (invoice number + status history)
│   ├── routes/
│   │   ├── auth.js                 # /api/auth routes
│   │   ├── menu.js                 # /api/menu routes
│   │   ├── orders.js               # /api/orders routes (+ invoice)
│   │   └── analytics.js            # /api/analytics routes
│   ├── seed/
│   │   └── seedData.js             # Database seeder (25 items + users)
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── server.js                   # Express entry point
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── sw.js                   # Service worker
│   │   └── icons/                  # App icons
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with JWT interceptor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state & JWT management
│   │   │   └── CartContext.jsx      # Shopping cart state (localStorage)
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Role-based navigation (Student vs Staff)
│   │   │   ├── Footer.jsx           # Footer with canteen info
│   │   │   ├── FoodCard.jsx         # Menu item card component
│   │   │   ├── Pagination.jsx       # Reusable pagination
│   │   │   ├── SearchFilter.jsx     # Search, category, price filters
│   │   │   └── ProtectedRoute.jsx   # Auth guard for routes
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Student landing page
│   │   │   ├── Menu.jsx             # Browse menu with filters
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Place order form (canteen pickup)
│   │   │   ├── Login.jsx            # Login with Student/Staff tabs
│   │   │   ├── Register.jsx         # Register with Student/Staff tabs
│   │   │   ├── MyOrders.jsx         # Order history with invoice numbers
│   │   │   ├── OrderTracking.jsx    # Order tracking + invoice display
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx    # Analytics charts
│   │   │       ├── ManageMenu.jsx   # CRUD menu items
│   │   │       └── ManageOrders.jsx # Incoming orders with student details
│   │   ├── App.jsx                  # Role-based routes configuration
│   │   ├── main.jsx                 # React entry + context providers
│   │   └── index.css                # Global styles + PWA optimizations
│   ├── index.html                   # HTML + PWA meta tags
│   ├── vite.config.js               # Vite + proxy configuration
│   ├── tailwind.config.js           # Tailwind theme (orange palette)
│   └── package.json
```

---

## 🎯 Order Status Flow

```
Pending → Preparing → Ready for Pickup → Picked Up (Delivered)
    ↓
  Cancelled
```

Each status change is recorded with a timestamp in the order's `statusHistory` array.

---

## 🛠️ Technical Highlights

### Backend
- **Password Security** — bcrypt hashing with salt rounds
- **JWT Authentication** — Token-based auth with middleware guards
- **Invoice Generation** — Auto-incrementing unique invoice numbers using MongoDB counter
- **MongoDB Aggregation** — Used for analytics (popular dishes, revenue)
- **Text Indexing** — MongoDB text index on menu item names for fast search
- **Input Validation** — Server-side validation on all endpoints
- **Error Handling** — Centralized error handler middleware

### Frontend
- **Role-Based UI** — Completely separate interfaces for students and canteen staff
- **React Context API** — For auth state and cart management
- **Axios Interceptors** — Auto-attach JWT token to API requests
- **Chart.js** — Interactive charts (Bar, Doughnut, Line) for analytics
- **Tailwind CSS** — Utility-first CSS with custom orange theme
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Toast Notifications** — User feedback via react-hot-toast
- **PWA Support** — Installable with offline caching
- **Auto-Refresh** — Admin orders page polls for new orders every 15 seconds

---

## 📝 License

MIT License — free to use for learning and development.
