# Electronics & Stationery E-Commerce Platform

A complete e-commerce platform consisting of:
- Django REST API backend (MySQL, JWT)
- Next.js web frontend (Tailwind CSS)
- React Native (Expo) mobile app
- POS panel to manage book locations in a grid

## Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+
- Git (optional)

---

## 1) Backend: Django REST API
Path: `ecommerce_backend/`

### Setup
1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r ecommerce_backend/requirements.txt
   ```
2. Create a MySQL database and user (example):
   ```sql
   CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'ecom_user'@'localhost' IDENTIFIED BY 'strongpassword';
   GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecom_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Copy environment example and fill values:
   - Copy `ecommerce_backend/.env.example` to `ecommerce_backend/.env`
   - Set `DB_NAME`, `DB_USER`, `DB_PASSWORD` accordingly
4. Run migrations and create superuser:
   ```bash
   cd ecommerce_backend
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. (Optional) Seed sample data (electronics & stationery):
   ```bash
   python manage.py seed_sample_data
   ```
6. Start the server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### API Highlights
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/users/profile`
- Products: `GET/POST /api/products/`, `PUT/DELETE /api/products/<id>/`, `GET /api/categories/`
- Orders: `GET/POST /api/orders/`, `GET/PUT /api/orders/<id>/`
- Stock: `GET/POST /api/stock/`
- POS: `GET /api/pos/books/`, `POST /api/pos/books/`, `PUT /api/pos/books/<id>/`

Auth uses JWT (access/refresh). Admin-only endpoints require a user with `is_admin=true`.

---

## 2) Web Frontend: Next.js
Path: `ecommerce_frontend/`

### Setup
1. Install dependencies:
   ```bash
   cd ecommerce_frontend
   npm install
   ```
2. Create `.env.local` (optional):
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

Features:
- Home page to browse products and simple cart/checkout
- Auth pages (login/register)
- Dashboard pages (profile, orders)
- Admin pages (products CRUD, stock movements, POS grid)

---

## 3) Mobile App: React Native (Expo)
Path: `ecommerce_mobile/`

### Setup
1. Install dependencies:
   ```bash
   cd ecommerce_mobile
   npm install
   ```
2. Configure API URL in `ecommerce_mobile/services/api.js` if needed.
3. Start the app:
   ```bash
   npx expo start
   ```

Features:
- Login/Register
- Browse products, view details, add to cart, checkout
- View order history
- Manage profile

---

## Notes
- Make sure the Django server is running before using the web or mobile apps.
- If you host the backend elsewhere, set `NEXT_PUBLIC_API_URL` (web) and update `API_URL` in `ecommerce_mobile/services/api.js` (mobile).
- Media upload support is included for product images; for demo, products are seeded without images.

## Troubleshooting
- If login fails from frontend, ensure CORS is enabled for `http://localhost:3000` and tokens are being attached in the `Authorization` header.
- For MySQL connection issues, verify credentials in `ecommerce_backend/.env` and that MySQL is running.
