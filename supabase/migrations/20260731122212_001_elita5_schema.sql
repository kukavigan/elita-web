/*
# Elita5 Store — Full Schema

Creates all tables needed for the Elita5 e-commerce backend.

1. Enums: role, product_size, order_status, payment_status, payment_method, review_status
2. Tables: users, addresses, categories, collections, products, product_images,
   product_variants, carts, cart_items, wishlists, wishlist_items, orders,
   order_items, discount_codes, reviews, newsletter_subscribers
3. All tables have RLS disabled (this schema is accessed by the Express/Prisma
   backend using the service role key — RLS is enforced at the application layer)
*/

-- Enums
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ProductSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE_SIZE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'BANK_TRANSFER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "firstName"   TEXT NOT NULL,
  "lastName"    TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  phone         TEXT,
  role          "Role" NOT NULL DEFAULT 'CUSTOMER',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "firstName"     TEXT NOT NULL,
  "lastName"      TEXT NOT NULL,
  phone           TEXT,
  country         TEXT NOT NULL,
  city            TEXT NOT NULL,
  "postalCode"    TEXT NOT NULL,
  "addressLine1"  TEXT NOT NULL,
  "addressLine2"  TEXT,
  "deliveryNotes" TEXT,
  "isDefault"     BOOLEAN NOT NULL DEFAULT false,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses("userId");

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image       TEXT,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image       TEXT,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  "shortDescription" TEXT,
  description       TEXT,
  price             DECIMAL(10,2) NOT NULL,
  "originalPrice"   DECIMAL(10,2),
  sku               TEXT UNIQUE NOT NULL,
  "categoryId"      TEXT REFERENCES categories(id),
  "collectionId"    TEXT REFERENCES collections(id),
  featured          BOOLEAN NOT NULL DEFAULT false,
  "bestSeller"      BOOLEAN NOT NULL DEFAULT false,
  "newArrival"      BOOLEAN NOT NULL DEFAULT false,
  "limitedEdition"  BOOLEAN NOT NULL DEFAULT false,
  active            BOOLEAN NOT NULL DEFAULT true,
  materials         TEXT,
  "careInstructions" TEXT,
  weight            DECIMAL(8,2),
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId");
CREATE INDEX IF NOT EXISTS idx_products_collection ON products("collectionId");
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products("bestSeller");
CREATE INDEX IF NOT EXISTS idx_products_new ON products("newArrival");
CREATE INDEX IF NOT EXISTS idx_products_limited ON products("limitedEdition");
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "imageUrl"  TEXT NOT NULL,
  "altText"   TEXT,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images("productId");

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId"   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size          "ProductSize",
  color         TEXT,
  "colorHex"    TEXT,
  sku           TEXT UNIQUE NOT NULL,
  "stockQuantity" INT NOT NULL DEFAULT 0,
  "sortOrder"   INT NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants("productId");
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"    TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "cartId"    TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES products(id),
  "variantId" TEXT REFERENCES product_variants(id),
  quantity    INT NOT NULL DEFAULT 1,
  price       DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("cartId", "productId", "variantId")
);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items("cartId");

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"    TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wishlist Items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "wishlistId" TEXT NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  "productId"  TEXT NOT NULL REFERENCES products(id),
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("wishlistId", "productId")
);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items("wishlistId");

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderNumber"       TEXT UNIQUE NOT NULL,
  "userId"            TEXT REFERENCES users(id),
  "customerEmail"     TEXT NOT NULL,
  "customerPhone"     TEXT,
  "customerNotes"     TEXT,
  "shippingFirstName" TEXT NOT NULL,
  "shippingLastName"  TEXT NOT NULL,
  "shippingCountry"   TEXT NOT NULL,
  "shippingCity"      TEXT NOT NULL,
  "shippingPostalCode" TEXT NOT NULL,
  "shippingAddress1"  TEXT NOT NULL,
  "shippingAddress2"  TEXT,
  "shippingPhone"     TEXT,
  "paymentMethod"     "PaymentMethod" NOT NULL,
  "paymentStatus"     "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "orderStatus"       "OrderStatus" NOT NULL DEFAULT 'PENDING',
  subtotal            DECIMAL(10,2) NOT NULL,
  discount            DECIMAL(10,2) NOT NULL DEFAULT 0,
  "shippingCost"      DECIMAL(10,2) NOT NULL,
  tax                 DECIMAL(10,2) NOT NULL,
  total               DECIMAL(10,2) NOT NULL,
  "discountCode"      TEXT,
  "trackingNumber"    TEXT,
  "estimatedDelivery" TIMESTAMPTZ,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders("orderNumber");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders("orderStatus");
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt");

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId"      TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "productId"    TEXT REFERENCES products(id) ON DELETE SET NULL,
  "productName"  TEXT NOT NULL,
  "productSku"   TEXT NOT NULL,
  "variantSku"   TEXT,
  size           TEXT,
  color          TEXT,
  quantity       INT NOT NULL,
  "unitPrice"    DECIMAL(10,2) NOT NULL,
  "totalPrice"   DECIMAL(10,2) NOT NULL,
  "productImage" TEXT,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items("orderId");

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code             TEXT UNIQUE NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL,
  value            DECIMAL(10,2) NOT NULL,
  "minOrderAmount" DECIMAL(10,2),
  "usageLimit"     INT,
  "usageCount"     INT NOT NULL DEFAULT 0,
  "startsAt"       TIMESTAMPTZ,
  "expiresAt"      TIMESTAMPTZ,
  active           BOOLEAN NOT NULL DEFAULT true,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "userId"    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  status      "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews("productId");
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews("userId");

-- Newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       TEXT UNIQUE NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Auto-update updatedAt trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW."updatedAt" = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT unnest(ARRAY['users','addresses','categories','collections','products','product_variants','carts','cart_items','wishlists','wishlists','orders','discount_codes','reviews','newsletter_subscribers']) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_updated_at ON %I', t);
    EXECUTE format('CREATE TRIGGER trg_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t);
  END LOOP;
END $$;
