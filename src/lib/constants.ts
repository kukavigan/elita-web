export const SITE_NAME = 'Elita5';
export const SITE_TAGLINE = 'Dyqani Zyrtar i Elita5';
export const CURRENCY = 'EUR';
export const CURRENCY_SYMBOL = '€';
export const FREE_SHIPPING_THRESHOLD = 60;
export const TAX_RATE = 0.18;

export const COLORS = {
  bg: '#0B0B0B',
  bgSecondary: '#161616',
  surface: '#202020',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  accent: '#B71C1C',
  accentSecondary: '#E53935',
  border: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(0,0,0,0.55)',
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  vinyl: 'Vinyl',
  cd: 'CD',
  tshirts: 'Bluza',
  hoodies: 'Kapuçe',
  sweatshirts: 'Sweatshirt',
  caps: 'Kësulë',
  accessories: 'Aksesore',
  posters: 'Postera',
  signed: 'Të Nënshkruara',
  limited: 'Edicion i Kufizuar',
  bundles: 'Paketa',
};

export const SIZE_LABELS: Record<string, string> = {
  XS: 'XS', S: 'S', M: 'M', L: 'L', XL: 'XL', XXL: 'XXL', ONE_SIZE: 'Një Madhësi',
};

export const BADGE_LABELS: Record<string, string> = {
  new: 'I Ri',
  bestseller: 'Më i Shitur',
  limited: 'I Kufizuar',
  sale: 'Shitje',
  soldout: 'I Shitur',
  exclusive: 'Ekskluziv',
};

export const SORT_LABELS: Record<string, string> = {
  featured: 'Të Zgjedhura',
  newest: 'Më të Reja',
  bestselling: 'Më të Shitura',
  price_asc: 'Çmimi: Ulët - Lartë',
  price_desc: 'Çmimi: Lartë - Ulët',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Në Pritje',
  confirmed: 'Konfirmuar',
  processing: 'Në Procesim',
  shipped: 'Dërguar',
  delivered: 'Dorëzuar',
  cancelled: 'Anuluar',
  refunded: 'Rimbursuar',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Kartë Krediti / Debiti',
  paypal: 'PayPal',
  bank_transfer: 'Transfer Bankar',
  cash_on_delivery: 'Para në Dorëzim',
};

export const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Dërgesë Standarde', description: 'Dërgim 3-5 ditë pune', price: 3.5, estimatedDays: '3-5 ditë' },
  { id: 'express', name: 'Dërgesë Shpejt', description: 'Dërgim 1-2 ditë pune', price: 7.5, estimatedDays: '1-2 ditë' },
  { id: 'overnight', name: 'Dërgesë Overnight', description: 'Dërgim ditën tjetër', price: 15, estimatedDays: '1 ditë' },
];

export const COUNTRIES = [
  { code: 'XK', name: 'Kosovë' },
  { code: 'AL', name: 'Shqipëri' },
  { code: 'MK', name: 'Maqedoni e Veriut' },
  { code: 'CH', name: 'Zvicër' },
  { code: 'DE', name: 'Gjermani' },
  { code: 'AT', name: 'Austri' },
  { code: 'IT', name: 'Itali' },
  { code: 'HR', name: 'Kroaci' },
  { code: 'BA', name: 'Bosnjë dhe Hercegovinë' },
  { code: 'FR', name: 'Francë' },
  { code: 'GB', name: 'Mbretëri e Bashkuar' },
  { code: 'US', name: 'Shtetet e Bashkuara' },
];

export const NAV_LINKS = [
  { label: 'Ballina', href: '/' },
  { label: 'Dyqani', href: '/dyqani' },
  { label: 'Koleksionet', href: '/koleksionet' },
  { label: 'Muzika', href: '/muzika' },
  { label: 'Koncertet', href: '/koncertet' },
  { label: 'Rreth Nesh', href: '/rreth-nesh' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/elita5official',
  instagram: 'https://instagram.com/elita5official',
  youtube: 'https://youtube.com/@elita5official',
  spotify: 'https://open.spotify.com/artist/elita5',
  tiktok: 'https://tiktok.com/@elita5official',
};
