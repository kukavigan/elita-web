import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  Menu, X, TrendingUp, AlertTriangle, Loader2, RefreshCw, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { adminOrdersApi, adminProductsApi, ApiOrder, ApiProduct } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ApiError } from '@/lib/apiClient';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Në Pritje', CONFIRMED: 'Konfirmuar', PROCESSING: 'Procesim',
  SHIPPED: 'Nisur', DELIVERED: 'Dorëzuar', CANCELLED: 'Anuluar',
};
const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10', CONFIRMED: 'text-blue-400 bg-blue-400/10',
  PROCESSING: 'text-blue-400 bg-blue-400/10', SHIPPED: 'text-purple-400 bg-purple-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10', CANCELLED: 'text-red-400 bg-red-400/10',
};

type Section = 'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings';

export function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(() => {
    if (location.pathname.includes('produktet')) return 'products';
    if (location.pathname.includes('porosi')) return 'orders';
    if (location.pathname.includes('klient')) return 'customers';
    if (location.pathname.includes('analitika')) return 'analytics';
    if (location.pathname.includes('cilesimet')) return 'settings';
    return 'dashboard';
  });

  const NAV = [
    { id: 'dashboard' as Section, label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'products' as Section, label: 'Produktet', Icon: Package },
    { id: 'orders' as Section, label: 'Porositë', Icon: ShoppingCart },
    { id: 'customers' as Section, label: 'Klientët', Icon: Users },
    { id: 'analytics' as Section, label: 'Analitika', Icon: BarChart3 },
    { id: 'settings' as Section, label: 'Cilësimet', Icon: Settings },
  ];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-white/30" /></div>;
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wider mb-3">QASJE E NDALUAR</h1>
          <p className="text-white/40 text-sm mb-6">Keni nevojë për të drejta administratori.</p>
          <button onClick={() => navigate(ROUTES.HOME)} className="btn-outline text-xs">Kthehu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0B0B0B]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0D0D0D] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/[0.06]">
          <span className="font-display text-2xl text-white tracking-wider">ELITA<span className="text-[#B71C1C]">5</span></span>
          <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
                activeSection === id
                  ? 'border-l-2 border-[#B71C1C] bg-white/[0.05] text-white pl-[10px]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent'
              }`}
            >
              <Icon size={15} aria-hidden />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={() => navigate(ROUTES.HOME)} className="w-full text-left px-3 py-2 text-white/30 hover:text-white text-xs transition-colors">
            ← Kthehu në Site
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden text-white/50 hover:text-white">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-white/40 text-sm hidden sm:block">{user.firstName} {user.lastName}</span>
            <div className="w-8 h-8 rounded-full bg-[#B71C1C]/20 border border-[#B71C1C]/40 flex items-center justify-center">
              <span className="text-[#E53935] text-xs font-bold">{user.firstName[0]}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'customers' && <div className="text-white/40 text-center py-16">Seksioni Klientët — duke ardhur.</div>}
          {activeSection === 'analytics' && <div className="text-white/40 text-center py-16">Analitika — duke ardhur.</div>}
          {activeSection === 'settings' && <div className="text-white/40 text-center py-16">Cilësimet — duke ardhur.</div>}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard Section ─────────────────────────────────────────────────────────

function DashboardSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminOrdersApi.getStats,
  });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-white/30" /></div>;

  const STAT_CARDS = [
    { label: 'Të Ardhura Totale', value: `${CURRENCY_SYMBOL}${stats?.totalRevenue?.toFixed(2) ?? '0.00'}`, Icon: TrendingUp, color: 'text-green-400' },
    { label: 'Porosi Totale', value: String(stats?.totalOrders ?? 0), Icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'Klientë Totale', value: String(stats?.totalCustomers ?? 0), Icon: Users, color: 'text-purple-400' },
    { label: 'Porosi Në Pritje', value: String(stats?.pendingOrders ?? 0), Icon: AlertTriangle, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-white tracking-wider">DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => {
          const Icon = card.Icon;
          return (
            <div key={card.label} className="bg-[#161616] border border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon size={16} className={card.color} />
              </div>
              <p className="font-display text-3xl text-white">{card.value}</p>
              <p className="text-white/30 text-xs mt-1 tracking-wide">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="font-display text-2xl text-white tracking-wider mb-4">POROSITË E FUNDIT</h2>
        <div className="space-y-2">
          {stats?.recentOrders?.map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-[#161616] border border-white/[0.06] text-sm">
              <span className="text-white font-mono">{order.orderNumber}</span>
              <span className="text-white/50 hidden sm:block">{order.customerEmail}</span>
              <span className={`text-xs px-2 py-0.5 ${ORDER_STATUS_COLORS[order.orderStatus] ?? 'text-white/40'}`}>
                {ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
              </span>
              <span className="text-white font-semibold">{CURRENCY_SYMBOL}{parseFloat(order.total).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low stock */}
      {stats?.lowStockVariants && stats.lowStockVariants.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-white tracking-wider mb-4">STOK I ULËT</h2>
          <div className="space-y-2">
            {stats.lowStockVariants.map(v => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-[#161616] border border-yellow-500/20">
                <div>
                  <p className="text-white text-sm">{v.product.name}</p>
                  <p className="text-white/40 text-xs">{v.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{v.stockQuantity} mbetur</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Products Section ──────────────────────────────────────────────────────────

function ProductsSection() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminProducts', page, search],
    queryFn: () => adminProductsApi.getAll({ page: String(page), search, limit: '20' }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      adminProductsApi.update(id, { active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Produkti u përditësua.');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Gabim.'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-white tracking-wider">PRODUKTET</h1>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-e5 text-sm"
            placeholder="Kërko produkte..."
          />
          <button onClick={() => refetch()} className="w-10 h-[46px] border border-white/[0.08] bg-[#161616] flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>
      ) : (
        <>
          <div className="space-y-2">
            {data?.products?.map(product => (
              <ProductRow
                key={product.id}
                product={product}
                onToggle={() => toggleActiveMutation.mutate({ id: product.id, active: !product.active })}
              />
            ))}
          </div>
          {data?.pagination && (
            <div className="flex items-center justify-between text-sm text-white/40">
              <span>Gjithsej: {data.pagination.total} produkte</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Prapa
                </button>
                <button disabled={!data?.products?.length || data.products.length < 20} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Para
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductRow({ product, onToggle }: { product: ApiProduct; onToggle: () => void }) {
  const img = product.images[0]?.imageUrl;
  const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);

  return (
    <div className="flex items-center gap-4 p-4 bg-[#161616] border border-white/[0.06] hover:border-white/15 transition-colors">
      {img && <img src={img} alt={product.name} className="w-12 h-12 object-cover flex-shrink-0 bg-[#202020]" />}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm line-clamp-1">{product.name}</p>
        <p className="text-white/30 text-xs">{product.sku} · {product.category?.name ?? '—'}</p>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-sm text-white/50">
        <span>{CURRENCY_SYMBOL}{parseFloat(product.price).toFixed(2)}</span>
        <span className={totalStock <= 5 ? 'text-yellow-400 font-semibold' : ''}>{totalStock} stok</span>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase border transition-colors ${
          product.active
            ? 'border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
            : 'border-white/10 text-white/30 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
        }`}
      >
        {product.active ? 'Aktiv' : 'Joaktiv'}
      </button>
    </div>
  );
}

// ── Orders Section ────────────────────────────────────────────────────────────

function OrdersSection() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', page, search, statusFilter],
    queryFn: () => adminOrdersApi.getAll({
      page: String(page),
      search,
      ...(statusFilter ? { orderStatus: statusFilter } : {}),
    }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...upd }: { id: string; orderStatus?: string; paymentStatus?: string }) =>
      adminOrdersApi.updateStatus(id, upd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminOrders'] });
      toast.success('Porosia u përditësua.');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Gabim.'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-white tracking-wider">POROSITË</h1>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-e5 text-sm"
            placeholder="Kërko porosi..."
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-e5 text-sm"
          >
            <option value="">Të gjitha statuset</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>
      ) : (
        <div className="space-y-2">
          {data?.orders?.map(order => (
            <div key={order.id} className="bg-[#161616] border border-white/[0.06]">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <span className="text-white font-mono text-sm truncate">{order.orderNumber}</span>
                  <span className="text-white/50 text-sm truncate hidden sm:block">{order.customerEmail}</span>
                  <span className={`text-xs px-2 py-0.5 inline-flex items-center justify-center ${ORDER_STATUS_COLORS[order.orderStatus] ?? 'text-white/40'}`}>
                    {ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                  </span>
                  <span className="text-white font-semibold text-sm">{CURRENCY_SYMBOL}{parseFloat(order.total).toFixed(2)}</span>
                </div>
                <ChevronDown size={14} className={`text-white/30 transition-transform flex-shrink-0 ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
              </div>

              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.06] p-5 space-y-4"
                >
                  {/* Items */}
                  <div>
                    <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Produktet</p>
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-1.5 text-sm">
                        {item.productImage && <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover bg-[#202020]" />}
                        <div className="flex-1">
                          <p className="text-white">{item.productName}</p>
                          <p className="text-white/40 text-xs">{item.size && `${item.size} · `}Sasia: {item.quantity}</p>
                        </div>
                        <p className="text-white">{CURRENCY_SYMBOL}{parseFloat(item.totalPrice).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div>
                    <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Adresa</p>
                    <p className="text-white/70 text-sm">{order.shippingFirstName} {order.shippingLastName} — {order.shippingAddress1}, {order.shippingCity}, {order.shippingCountry}</p>
                  </div>

                  {/* Status controls */}
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <label className="block text-white/30 text-[10px] tracking-widest uppercase mb-1">Statusi i Porosisë</label>
                      <select
                        defaultValue={order.orderStatus}
                        onChange={e => updateMutation.mutate({ id: order.id, orderStatus: e.target.value })}
                        className="input-e5 text-sm py-2"
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/30 text-[10px] tracking-widest uppercase mb-1">Statusi i Pagesës</label>
                      <select
                        defaultValue={order.paymentStatus}
                        onChange={e => updateMutation.mutate({ id: order.id, paymentStatus: e.target.value })}
                        className="input-e5 text-sm py-2"
                      >
                        {[['PENDING','Në Pritje'],['PAID','Paguar'],['FAILED','Dështuar'],['REFUNDED','Rimbursuar']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {data?.pagination && (
            <div className="flex items-center justify-between text-sm text-white/40 pt-2">
              <span>Gjithsej: {data.pagination.total} porosi</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed">Prapa</button>
                <button disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed">Para</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
