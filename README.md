# Elita5 Store — Full-Stack Application

Official merchandise store for Elita5 — Albanian rock band. Built with React + TypeScript (frontend) and Node.js + Express + Prisma + PostgreSQL (backend).

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TanStack Query, Framer Motion, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcrypt |
| Validation | Zod (frontend + backend) |
| Forms | React Hook Form |

---

## Project Structure

```
/
├── src/                    # Frontend (Vite + React)
│   ├── components/         # Shared UI components
│   ├── contexts/           # React contexts (Auth, Cart, Wishlist, Search)
│   ├── lib/                # apiClient, routes, constants
│   ├── pages/              # All page components
│   ├── services/           # API service layer
│   └── types/              # TypeScript types
│
└── server/                 # Backend (Express + Prisma)
    ├── prisma/
    │   ├── schema.prisma   # Database schema
    │   └── seed.ts         # Database seed script
    └── src/
        ├── config/         # Prisma client, environment config
        ├── controllers/    # Route handlers
        ├── middleware/     # Auth, error handling, validation
        ├── routes/         # Express routers
        ├── schemas/        # Zod validation schemas
        ├── services/       # Business logic
        └── utils/          # Helper functions
```

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase project)

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Frontend Environment

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Configure Backend Environment

Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
ADMIN_EMAIL=admin@elita5.com
ADMIN_PASSWORD=YourStrongAdminPassword
```

> **Security:** Change `JWT_SECRET` and `ADMIN_PASSWORD` before deploying to production. Never commit `.env` files.

### 5. Run Prisma Migration

```bash
cd server
npx prisma generate
npx prisma db push
```

Or apply the included migration:

```bash
npx prisma migrate deploy
```

### 6. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@elita5.com` / `Admin@Elita5#2025` *(change before production)*
- Demo customer: `fan@elita5.com` / `elita5fan`
- 10 product categories
- 5 collections
- 15 Elita5 products with images and variants
- Discount codes: `ELITA5` (10%), `ROCK20` (20%)

> **Important:** Change the admin password immediately after deployment.

### 7. Start Backend

```bash
cd server
npm run dev
```

Server runs at `http://localhost:3001`

### 8. Start Frontend

```bash
# In project root
npm run dev
```

Frontend runs at `http://localhost:5173`

### 9. Production Build

```bash
# Frontend
npm run build

# Backend
cd server
npm run build
npm start
```

---

## API Routes

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Get current user | JWT |
| PUT | `/api/auth/me` | Update profile | JWT |
| PUT | `/api/auth/me/password` | Change password | JWT |
| GET | `/api/auth/me/addresses` | Get addresses | JWT |
| POST | `/api/auth/newsletter` | Subscribe to newsletter | — |
| GET | `/api/products` | Get products (with filters) | — |
| GET | `/api/products/featured` | Featured products | — |
| GET | `/api/products/:slug` | Product by slug | — |
| GET | `/api/products/categories` | All categories | — |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| GET | `/api/cart` | Get cart | JWT |
| POST | `/api/cart/items` | Add to cart | JWT |
| PUT | `/api/cart/items/:id` | Update cart item | JWT |
| DELETE | `/api/cart/items/:id` | Remove from cart | JWT |
| POST | `/api/cart/sync` | Sync guest cart | JWT |
| GET | `/api/wishlist` | Get wishlist | JWT |
| POST | `/api/wishlist/items` | Add to wishlist | JWT |
| DELETE | `/api/wishlist/items/:id` | Remove from wishlist | JWT |
| POST | `/api/orders` | Create order | Optional JWT |
| GET | `/api/orders/my` | User orders | JWT |
| GET | `/api/orders/:id` | Get order | Optional JWT |
| POST | `/api/orders/discount/validate` | Validate discount | — |
| GET | `/api/orders/admin/all` | All orders | Admin |
| GET | `/api/orders/admin/stats` | Dashboard stats | Admin |
| PUT | `/api/orders/admin/:id` | Update order status | Admin |

---

## Features

### Implemented

- JWT authentication with bcrypt password hashing
- Product catalog with filtering, sorting, pagination
- Real-time cart (DB for auth users, localStorage for guests)
- Cart sync after login
- Wishlist (DB for auth users, localStorage for guests)
- Server-side checkout with inventory validation
- Server-side price calculation (never trusts frontend prices)
- Discount codes (percentage + fixed, with limits and expiry)
- Order creation with atomic inventory reduction
- User account (profile, addresses, order history)
- Admin dashboard (stats, product management, order management)
- Newsletter subscription
- Product reviews structure (pending admin approval)
- Rate limiting on auth endpoints
- Helmet security headers
- CORS configuration
- Centralized Albanian error messages

### Payment Methods

- Cash on Delivery
- Bank Transfer

> Stripe card payments will be added in a separate step.

---

## Discount Codes

| Code | Discount | Minimum Order |
|---|---|---|
| `ELITA5` | 10% | €20 |
| `ROCK20` | 20% | €50 |

---

## Shipping Rules

| Condition | Cost |
|---|---|
| Order below €60 | €3.00 |
| Order €60 or above | Free |

---

## Security Notes

Before deploying to production:

1. Change `JWT_SECRET` to a cryptographically random 64+ char string
2. Change `ADMIN_PASSWORD` to a strong unique password
3. Set `NODE_ENV=production`
4. Configure CORS `CLIENT_URL` to your production domain
5. Enable SSL/TLS on the database connection
6. Rotate all credentials
