import { PrismaClient, ProductSize } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@elita5.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@Elita5#2025';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Elita5',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // Demo customer
  const demoHash = await bcrypt.hash('elita5fan', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'fan@elita5.com' },
    update: {},
    create: {
      firstName: 'Fan',
      lastName: 'Shqiptar',
      email: 'fan@elita5.com',
      passwordHash: demoHash,
      role: 'CUSTOMER',
    },
  });
  console.log(`✅ Demo customer: ${demo.email}`);

  // ── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'vinyl' },       update: {}, create: { name: 'Vinyl',                    slug: 'vinyl',       description: 'Pllaka vinyl Elita5',              image: 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'cd' },          update: {}, create: { name: 'CD',                       slug: 'cd',          description: 'CD-të zyrtare Elita5',             image: 'https://images.pexels.com/photos/18735733/pexels-photo-18735733.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'tshirts' },     update: {}, create: { name: 'Bluza',                    slug: 'tshirts',     description: 'Bluza zyrtare Elita5',             image: 'https://images.pexels.com/photos/13794572/pexels-photo-13794572.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'hoodies' },     update: {}, create: { name: 'Kapuçe',                   slug: 'hoodies',     description: 'Kapuçe dhe xhaketa Elita5',        image: 'https://images.pexels.com/photos/14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'caps' },        update: {}, create: { name: 'Kapela',                   slug: 'caps',        description: 'Kapela dhe kësulë Elita5',         image: 'https://images.pexels.com/photos/9853880/pexels-photo-9853880.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Aksesorë',                 slug: 'accessories', description: 'Aksesore zyrtare Elita5',          image: 'https://images.pexels.com/photos/10457904/pexels-photo-10457904.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'posters' },     update: {}, create: { name: 'Postera',                  slug: 'posters',     description: 'Postera dhe printe Elita5',        image: 'https://images.pexels.com/photos/632305/pexels-photo-632305.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'signed' },      update: {}, create: { name: 'Produkte të Nënshkruara', slug: 'signed',      description: 'Produkte me nënshkrim origjinal', image: 'https://images.pexels.com/photos/15067553/pexels-photo-15067553.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'limited' },     update: {}, create: { name: 'Edicion i Limituar',       slug: 'limited',     description: 'Produkte të edicionit të limituar', image: 'https://images.pexels.com/photos/20993079/pexels-photo-20993079.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
    prisma.category.upsert({ where: { slug: 'bundles' },     update: {}, create: { name: 'Pako',                     slug: 'bundles',     description: 'Pako dhe sete speciale Elita5',    image: 'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' } }),
  ]);
  console.log(`✅ ${categories.length} categories`);

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  // ── Collections ──────────────────────────────────────────────────────────
  const collections = await Promise.all([
    prisma.collection.upsert({ where: { slug: 'koleksioni-klasik' },   update: {}, create: { name: 'Koleksioni Klasik',      slug: 'koleksioni-klasik',   description: 'Dizajnet klasike të Elita5' } }),
    prisma.collection.upsert({ where: { slug: 'turneu-elita5' },       update: {}, create: { name: 'Turneu Elita5 2025',     slug: 'turneu-elita5',       description: 'Koleksioni i turneut 2025' } }),
    prisma.collection.upsert({ where: { slug: 'edicion-i-limituar' },  update: {}, create: { name: 'Edicion i Limituar',     slug: 'edicion-i-limituar',  description: 'Produkte eksluzive me numër të kufizuar' } }),
    prisma.collection.upsert({ where: { slug: 'greatest-hits' },       update: {}, create: { name: 'Greatest Hits',          slug: 'greatest-hits',       description: 'Koleksioni Greatest Hits' } }),
    prisma.collection.upsert({ where: { slug: 'trashegimia-elita5' }, update: {}, create: { name: 'Trashëgimia Elita5',      slug: 'trashegimia-elita5',  description: 'Koleksioni i trashëgimisë rok shqiptare' } }),
  ]);
  console.log(`✅ ${collections.length} collections`);

  const colMap = Object.fromEntries(collections.map(c => [c.slug, c.id]));

  // ── Discount code ────────────────────────────────────────────────────────
  await prisma.discountCode.upsert({
    where: { code: 'ELITA5' },
    update: {},
    create: {
      code: 'ELITA5',
      description: '10% zbritje për fansat e Elita5',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 20,
      active: true,
    },
  });
  await prisma.discountCode.upsert({
    where: { code: 'ROCK20' },
    update: {},
    create: {
      code: 'ROCK20',
      description: '20% zbritje — Ofertë speciale',
      type: 'PERCENTAGE',
      value: 20,
      minOrderAmount: 50,
      usageLimit: 100,
      active: true,
    },
  });
  console.log('✅ Discount codes: ELITA5, ROCK20');

  // ── Products ─────────────────────────────────────────────────────────────
  type ProductSeed = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    originalPrice?: number;
    sku: string;
    categorySlug: string;
    collectionSlug?: string;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    limitedEdition: boolean;
    materials?: string;
    careInstructions?: string;
    images: { url: string; alt: string }[];
    variants: { size?: ProductSize; color?: string; colorHex?: string; sku: string; stock: number }[];
  };

  const PRODUCTS: ProductSeed[] = [
    {
      name: 'Bluza Klasike e Zezë Elita5',
      slug: 'bluza-klasike-e-zeze',
      shortDescription: 'Bluza ikonike e zezë me logo Elita5',
      description: 'Bluza standarde e koleksionit klasik me logo Elita5 të stampuar. 100% pambuk organik me qepje të dyfishtë dhe ngjyrë që nuk zbeh. E disponueshme në të gjitha madhësitë.',
      price: 25, originalPrice: 35,
      sku: 'E5-BLZ-001',
      categorySlug: 'tshirts', collectionSlug: 'koleksioni-klasik',
      featured: true, bestSeller: true, newArrival: false, limitedEdition: false,
      materials: '100% pambuk organik, 200g/m²',
      careInstructions: 'Lani me ujë të ftohtë (30°C). Mos vendoseni në tharëse.',
      images: [
        { url: 'https://images.pexels.com/photos/13794572/pexels-photo-13794572.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Bluza Klasike e Zezë Elita5 — pamja e parë' },
        { url: 'https://images.pexels.com/photos/14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Bluza Klasike e Zezë Elita5 — pamja e pasme' },
      ],
      variants: [
        { size: 'XS', sku: 'E5-BLZ-001-XS', stock: 8 },
        { size: 'S',  sku: 'E5-BLZ-001-S',  stock: 12 },
        { size: 'M',  sku: 'E5-BLZ-001-M',  stock: 15 },
        { size: 'L',  sku: 'E5-BLZ-001-L',  stock: 10 },
        { size: 'XL', sku: 'E5-BLZ-001-XL', stock: 3 },
      ],
    },
    {
      name: 'Bluza Logo Vintage Elita5',
      slug: 'bluza-logo-vintage',
      shortDescription: 'Bluza me logo vintage dhe ngjyrë të zbehtë',
      description: 'Bluza me efekt vintage me logo të vjetërsuar Elita5. Printed me metodën acid-wash për pamje autentike retro. Perfekte për fansat e muzikës rok shqiptare.',
      price: 30,
      sku: 'E5-BLZ-002',
      categorySlug: 'tshirts', collectionSlug: 'koleksioni-klasik',
      featured: true, bestSeller: false, newArrival: true, limitedEdition: false,
      materials: '100% pambuk, 180g/m², acid-wash',
      careInstructions: 'Lani nga brenda jashtë me ujë të ftohtë.',
      images: [
        { url: 'https://images.pexels.com/photos/9853880/pexels-photo-9853880.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Bluza Logo Vintage Elita5' },
      ],
      variants: [
        { size: 'S',   sku: 'E5-BLZ-002-S',   stock: 8 },
        { size: 'M',   sku: 'E5-BLZ-002-M',   stock: 12 },
        { size: 'L',   sku: 'E5-BLZ-002-L',   stock: 7 },
        { size: 'XL',  sku: 'E5-BLZ-002-XL',  stock: 3 },
        { size: 'XXL', sku: 'E5-BLZ-002-XXL', stock: 0 },
      ],
    },
    {
      name: 'Kapuçe Premium Elita5',
      slug: 'kapuce-premium-elita5',
      shortDescription: 'Kapuçe premium me logo Elita5 të qëndisur',
      description: 'Kapuçe e rëndë prej 320g/m² me logo Elita5 të qëndisur me fije metalike. Kapuç i rregllueshëm, xhepa anësorë dhe mbajtëse të bërthamës. Trajtim special hidrofobik.',
      price: 55, originalPrice: 70,
      sku: 'E5-KAP-001',
      categorySlug: 'hoodies', collectionSlug: 'koleksioni-klasik',
      featured: true, bestSeller: true, newArrival: false, limitedEdition: false,
      materials: '80% pambuk, 20% poliester, 320g/m²',
      careInstructions: 'Lani me ujë të ftohtë. Mos hekurosni mbi logo.',
      images: [
        { url: 'https://images.pexels.com/photos/14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Kapuçe Premium Elita5' },
      ],
      variants: [
        { size: 'S',  sku: 'E5-KAP-001-S',  stock: 5 },
        { size: 'M',  sku: 'E5-KAP-001-M',  stock: 8 },
        { size: 'L',  sku: 'E5-KAP-001-L',  stock: 6 },
        { size: 'XL', sku: 'E5-KAP-001-XL', stock: 3 },
      ],
    },
    {
      name: 'Kapuçe Turneu 2025',
      slug: 'kapuce-turneu-2025',
      shortDescription: 'Kapuçe zyrtare e turneut Elita5 2025',
      description: 'Kapuçe ekskluzive e turneut "Trashëgimia Jetë 2025". Printime me të gjitha datat e koncerteve në anën e pasme. Prodhuar vetëm 500 copë — secila e numëruar.',
      price: 60,
      sku: 'E5-KAP-002',
      categorySlug: 'hoodies', collectionSlug: 'turneu-elita5',
      featured: true, bestSeller: false, newArrival: true, limitedEdition: true,
      materials: '80% pambuk, 20% poliester, 340g/m²',
      images: [
        { url: 'https://images.pexels.com/photos/20993079/pexels-photo-20993079.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Kapuçe Turneu Elita5 2025' },
      ],
      variants: [
        { size: 'S',  sku: 'E5-KAP-002-S',  stock: 4 },
        { size: 'M',  sku: 'E5-KAP-002-M',  stock: 6 },
        { size: 'L',  sku: 'E5-KAP-002-L',  stock: 3 },
        { size: 'XL', sku: 'E5-KAP-002-XL', stock: 2 },
      ],
    },
    {
      name: 'Vinyl — Edicion i Kufizuar',
      slug: 'vinyl-edicion-i-kufizuar',
      shortDescription: 'Vinyl 180g me ngjyrë të kuqe transparente',
      description: 'Vinyl 180g me ngjyrë të kuqe transparente — edicion i kufizuar vetëm 300 kopje. Përfshin 22 hitet kryesore të Elita5, remastered nga Abbey Road Studios. Vjen me certifikatë autenticiteti dhe poster A2.',
      price: 40, originalPrice: 55,
      sku: 'E5-VNL-001',
      categorySlug: 'vinyl', collectionSlug: 'edicion-i-limituar',
      featured: true, bestSeller: false, newArrival: false, limitedEdition: true,
      materials: 'Vinyl 180g, ngjyrë e kuqe transparente',
      images: [
        { url: 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Vinyl Elita5 — Edicion i Kufizuar i Kuq' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-VNL-001-OS', stock: 8 },
      ],
    },
    {
      name: 'Vinyl — Hitet më të Mira',
      slug: 'vinyl-hitet-me-te-mira',
      shortDescription: 'Koleksioni i plotë i hiteve Elita5 në vinyl',
      description: '2LP vinyl standard i zi me mbledhjen e plotë të hiteve të Elita5. Mastering i kujdesshëm me tingull analog. Rekomandohet për koleksionistët dhe çdo fansit serioz të rokit shqiptar.',
      price: 45,
      sku: 'E5-VNL-002',
      categorySlug: 'vinyl', collectionSlug: 'greatest-hits',
      featured: true, bestSeller: true, newArrival: false, limitedEdition: false,
      materials: 'Vinyl 180g standard, 2LP',
      images: [
        { url: 'https://images.pexels.com/photos/18735733/pexels-photo-18735733.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Vinyl Elita5 — Hitet më të Mira' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-VNL-002-OS', stock: 35 },
      ],
    },
    {
      name: 'CD — Hitet më të Mira',
      slug: 'cd-hitet-me-te-mira',
      shortDescription: 'CD me 22 hite të zgjedhura Elita5',
      description: 'CD i paketimit special me librezë 28 faqe me tekste dhe fotografi nga karriera e Elita5. Audio HD 24-bit. Paketim i kujdesshëm i rezistueshëm ndaj scratches.',
      price: 15,
      sku: 'E5-CD-001',
      categorySlug: 'cd', collectionSlug: 'greatest-hits',
      featured: false, bestSeller: true, newArrival: false, limitedEdition: false,
      images: [
        { url: 'https://images.pexels.com/photos/3122799/pexels-photo-3122799.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'CD Elita5 — Hitet më të Mira' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-CD-001-OS', stock: 67 },
      ],
    },
    {
      name: 'Kësulë Logo Elita5',
      slug: 'kesule-logo-elita5',
      shortDescription: 'Kësulë e leshit me logo Elita5 të qëndisur',
      description: 'Kësulë e butë leshi me logo Elita5 të qëndisur me saktësi. Ngjyrë e zezë standarde me detaje të kuqe. E disponueshme në madhësi universale — regjustohet me stretch.',
      price: 22,
      sku: 'E5-KSL-001',
      categorySlug: 'caps', collectionSlug: 'koleksioni-klasik',
      featured: false, bestSeller: false, newArrival: true, limitedEdition: false,
      materials: '100% lesh natyral',
      images: [
        { url: 'https://images.pexels.com/photos/9853880/pexels-photo-9853880.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Kësulë Logo Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-KSL-001-OS', stock: 41 },
      ],
    },
    {
      name: 'Set Plek Gitarre Elita5',
      slug: 'set-plek-gitarre',
      shortDescription: '6 plek guitarre me dizajn unik Elita5',
      description: 'Set me 6 plek guitarre të ndryshme trashësiesh (0.46, 0.60, 0.73, 0.88, 1.00, 1.14mm). Secili me logo Elita5 dhe dizajn të veçantë. Të shkëlqyeshëm si dhuratë për muzikantë.',
      price: 10,
      sku: 'E5-AKS-001',
      categorySlug: 'accessories', collectionSlug: 'koleksioni-klasik',
      featured: false, bestSeller: false, newArrival: true, limitedEdition: false,
      images: [
        { url: 'https://images.pexels.com/photos/10457904/pexels-photo-10457904.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Set Plek Gitarre Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-AKS-001-OS', stock: 120 },
      ],
    },
    {
      name: 'Gotë Turneu Elita5 2025',
      slug: 'gote-turneu-elita5-2025',
      shortDescription: 'Gotë qeramike me printime turneu 2025',
      description: 'Gotë qeramike premium 350ml me printime full-color të postit të turneut "Trashëgimia Jetë 2025". Printim i qëndrueshëm dhe i paprekshëm nga larja në pjatalarëse.',
      price: 18,
      sku: 'E5-AKS-002',
      categorySlug: 'accessories', collectionSlug: 'turneu-elita5',
      featured: false, bestSeller: false, newArrival: false, limitedEdition: false,
      images: [
        { url: 'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Gotë Turneu Elita5 2025' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-AKS-002-OS', stock: 55 },
      ],
    },
    {
      name: 'Poster i Nënshkruar nga Elita5',
      slug: 'poster-i-nenshkruar',
      shortDescription: 'Poster A2 me nënshkrime origjinale të të gjithë anëtarëve',
      description: 'Poster A2 (42×59 cm) me foto profesionale nga turneu 2024, me nënshkrime origjinale të të gjithë anëtarëve të Elita5. Printime me ngjyrë UV-resistant. Vjen me certifikatë autenticiteti dhe tub mbrojtës.',
      price: 35,
      sku: 'E5-PST-001',
      categorySlug: 'signed', collectionSlug: 'edicion-i-limituar',
      featured: false, bestSeller: false, newArrival: false, limitedEdition: true,
      images: [
        { url: 'https://images.pexels.com/photos/632305/pexels-photo-632305.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Poster i Nënshkruar Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-PST-001-OS', stock: 18 },
      ],
    },
    {
      name: 'Paketë Stikerësh Elita5',
      slug: 'pakete-stikeresh',
      shortDescription: 'Set me 12 stiker vinyl të papërmbyshëm',
      description: '12 stiker vinyl premium të papërmbyshëm nga uji dhe UV. Përfshijnë logo Elita5, citate ikonike dhe dizajne nga posteri i turneut. Punojnë mbi laptop, makinë, instrument muzikor dhe çdo sipërfaqe të lëmuar.',
      price: 8,
      sku: 'E5-AKS-003',
      categorySlug: 'accessories', collectionSlug: 'koleksioni-klasik',
      featured: false, bestSeller: false, newArrival: false, limitedEdition: false,
      images: [
        { url: 'https://images.pexels.com/photos/15067553/pexels-photo-15067553.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Paketë Stikerësh Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-AKS-003-OS', stock: 200 },
      ],
    },
    {
      name: 'Çantë Tote Elita5',
      slug: 'cante-tote-elita5',
      shortDescription: 'Çantë kanvasi organik me logo Elita5',
      description: 'Çantë tote nga kanvasi organik me logo Elita5 të stampuar me ngjyrë ekologjike. 40×35 cm me rrip të gjatë 60 cm. Mban deri 15kg. E qëndrueshme dhe me ngjyrë standarde të zezë.',
      price: 20,
      sku: 'E5-AKS-004',
      categorySlug: 'accessories', collectionSlug: 'koleksioni-klasik',
      featured: false, bestSeller: false, newArrival: true, limitedEdition: false,
      materials: '100% kanvas organik, 280g/m²',
      images: [
        { url: 'https://images.pexels.com/photos/18671362/pexels-photo-18671362.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Çantë Tote Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-AKS-004-OS', stock: 75 },
      ],
    },
    {
      name: 'Paketë Koleksionuese Elita5',
      slug: 'pakete-koleksionuese',
      shortDescription: 'Pako premium: Vinyl + CD + Bluza + Poster i Nënshkruar',
      description: 'Pako e plotë koleksionuese Elita5: Vinyl 180g + CD Greatest Hits + Bluza Klasike + Poster A2 i Nënshkruar + Stiker Set. Vlera totale €113 — kurseni €18. Pakuar me kujdes në kuti premium.',
      price: 95, originalPrice: 130,
      sku: 'E5-PKO-001',
      categorySlug: 'bundles', collectionSlug: 'edicion-i-limituar',
      featured: false, bestSeller: false, newArrival: false, limitedEdition: true,
      images: [
        { url: 'https://images.pexels.com/photos/20993079/pexels-photo-20993079.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Paketë Koleksionuese Elita5' },
        { url: 'https://images.pexels.com/photos/12858793/pexels-photo-12858793.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Paketë Koleksionuese — Vinyl' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-PKO-001-OS', stock: 12 },
      ],
    },
    {
      name: 'Vinyl Koleksionues i Nënshkruar',
      slug: 'vinyl-koleksionues-i-nenshkruar',
      shortDescription: 'Vinyl i nënshkruar nga të gjithë anëtarët — vetëm 50 copë',
      description: 'Vinyl 180g transparent i nënshkruar nga të gjithë 5 anëtarët e Elita5 direkt mbi kopertinë. Numërim unik (1-50) me shenjë autenticiteti. Vjen në kuti mbrojtëse akriliku dhe certifikatë noterie. Koleksion ultimate.',
      price: 120,
      sku: 'E5-VNL-003',
      categorySlug: 'signed', collectionSlug: 'edicion-i-limituar',
      featured: false, bestSeller: false, newArrival: false, limitedEdition: true,
      images: [
        { url: 'https://images.pexels.com/photos/18004195/pexels-photo-18004195.jpeg?auto=compress&cs=tinysrgb&h=800&w=700', alt: 'Vinyl Koleksionues i Nënshkruar Elita5' },
      ],
      variants: [
        { size: 'ONE_SIZE', sku: 'E5-VNL-003-OS', stock: 5 },
      ],
    },
  ];

  let created = 0;
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        sku: p.sku,
        categoryId: catMap[p.categorySlug],
        collectionId: p.collectionSlug ? colMap[p.collectionSlug] : null,
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        limitedEdition: p.limitedEdition,
        active: true,
        materials: p.materials,
        careInstructions: p.careInstructions,
        images: {
          create: p.images.map((img, i) => ({
            imageUrl: img.url,
            altText: img.alt,
            sortOrder: i,
          })),
        },
        variants: {
          create: p.variants.map(v => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            sku: v.sku,
            stockQuantity: v.stock,
            active: true,
          })),
        },
      },
    });
    created++;
  }
  console.log(`✅ ${created} products created (skipped existing)`);

  console.log('\n🎸 Seed completed successfully!');
  console.log('\n📋 Credentials:');
  console.log(`   Admin:    ${adminEmail} / ${adminPassword}`);
  console.log('   Customer: fan@elita5.com / elita5fan');
  console.log('\n🎟️  Discount codes: ELITA5 (10%), ROCK20 (20%)');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
