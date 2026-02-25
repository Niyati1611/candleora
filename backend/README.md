# 🕯️ Candle Shop Backend - Complete Node.js Setup

## ✅ What's Included

- **Node.js Backend** - Express API server
- **MySQL Database** - with sample products and admin users
- **Admin Dashboard** - Full-featured admin panel for managing products and orders
- **Authentication** - JWT token-based admin authentication
- **API Routes** - Complete REST API for products, orders, and admin functions
- **Frontend Integration** - React frontend already connected

---

## 🚀 QUICK START (No More PHP!)

⚠️ **New dependency:** run `npm install multer` in the `backend` folder to enable image uploads.  The admin panel uses `/uploads/banners` for banner images.


### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up Database

Make sure **MySQL is running** in XAMPP, then:

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click **SQL** tab
3. Paste contents of `backend/database.sql` → Click **Go**

Or use command line:
```bash
mysql -u root -p candle_shop < database.sql
```
> After making schema updates (new features such as banner images) you can also re-run the helper script:
> ```bash
> node scripts/init_db.js
> ```
> It will `CREATE TABLE IF NOT EXISTS` for the new `banner_images` table.
### Step 3: Create Admin User

```bash
node CREATE_ADMIN.js
```

Follow the prompts:
```
Username: admin
Password: your_secure_password
Email: admin@candle.ora (optional)
```

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
🕯️  Candle Shop Backend running on http://localhost:5000
📊 Admin Panel: http://localhost:5000/admin
📚 API Docs: http://localhost:5000/api/health
```

### Step 5: Start Frontend

In a new terminal:
```bash
npm run dev
```

Open: `http://localhost:5173` (or your Vite port)

---

## 🧪 TEST EVERYTHING

### API Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Single Product
```bash
curl http://localhost:5000/api/products/1
```

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name":"John Doe",
    "customer_email":"john@example.com",
    "customer_phone":"1234567890",
    "customer_address":"123 Main St",
    "total_amount":99.99,
    "items":[{"product_id":1,"quantity":2,"price":24.99}]
  }'
```

### Image Uploads

Banner images are managed via a new set of endpoints. Make sure `multer` is installed as noted above. Images are stored in `public/uploads/banners`.

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

---

## 📊 ADMIN PANEL

Open in browser: **http://localhost:5000/admin**

**Features:**
- ✅ Login with admin credentials
- ✅ Dashboard with statistics
- ✅ Product management (add, edit, delete)
- ✅ Order management and status updates
- ✅ Real-time data sync
- ✅ Settings page

**Login credentials:** Use the ones you created in Step 3

---

## 📁 FILE STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          (MySQL connection)
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   └── middleware/
│       └── auth.js              (JWT authentication)
├── public/
│   └── admin/
│       └── index.html           (Admin dashboard UI)
├── server.js                     (Main server file)
├── package.json
├── .env                          (Configuration)
├── .gitignore
├── database.sql                  (DB schema + sample data)
├── CREATE_ADMIN.js              (Create admin user CLI)
└── README.md                     (This file)
```

---

## 🔗 API ENDPOINTS

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Get all products |
| GET | `/api/products/:id` | ❌ | Get product by ID |
| GET | `/api/products/category/:category` | ❌ | Get products by category |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ❌ | Create order |
| GET | `/api/orders` | ✅ | Get all orders |
| GET | `/api/orders/:id` | ✅ | Get order details |
| PUT | `/api/orders/:id` | ✅ | Update order status |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/login` | ❌ | Login & get JWT token |
| GET | `/api/admin/validate` | ✅ | Validate token |
| GET | `/api/admin/users` | ✅ | List registered users (supports `page` & `limit` query parameters) |
| GET | `/api/banner` | ❌ | Get banner images (ordered) |
| POST | `/api/banner` | ✅ | Upload a new banner image (form field `image`) |
| DELETE | `/api/banner/:id` | ✅ | Remove banner image by id |
| PUT | `/api/banner/reorder` | ✅ | Reorder images, body `{order: [ids...]}` |

---

## 🔐 AUTHENTICATION

All admin-protected routes require a JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Get a token by logging in:
```json
POST /api/admin/login
{
  "username": "admin",
  "password": "your_password"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@candle.ora"
  }
}
```

---

## 📝 CONFIGURATION

Edit `.env` to change settings:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=           # Change if you set MySQL password
DB_NAME=candle_shop
DB_PORT=3306

PORT=5000              # Backend server port
NODE_ENV=development

JWT_SECRET=your_jwt_secret_key_change_this    # Change for production!
SESSION_SECRET=your_session_secret_key_change_this
```

⚠️ **Important:** Change JWT_SECRET for production!

---

## 🛠️ TROUBLESHOOTING

### "Connection refused" error
- Make sure MySQL is running in XAMPP Control Panel
- Check DB_HOST and DB_PORT in `.env`
- Default: root user with no password

### "Database does not exist"
- Run the SQL in Step 2 via phpMyAdmin
- Or: `mysql -u root < backend/database.sql`

### Admin login fails
- Make sure you created an admin user with `node CREATE_ADMIN.js`
- Check credentials in admin login page
- Verify database has `admin_users` table with entries

### Products not showing in frontend
- Check that backend is running: `http://localhost:5000/api/health`
- Make sure products table has data in database
- Check browser console for CORS errors

### CORS errors
- Backend should auto-allow localhost in development
- If issues persist, check server.js CORS settings

---

## 🎯 NEXT STEPS

1. ✅ Backend fully working
2. ✅ Admin panel ready
3. ✅ Frontend integrated
4. Next: Add payment processing (Stripe/PayPal)
5. Next: Deploy to production (Heroku/Vercel)

---

## 📞 SUPPORT

All endpoints tested and working! If you encounter any issues:

1. Check `.env` database connection
2. Verify MySQL is running
3. Check browser console for error messages
4. Check server terminal output for logs

---

**Backend Ready! 🚀**
