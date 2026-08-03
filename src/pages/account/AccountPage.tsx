import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package, Heart, User, MapPin, Settings, LogOut, Plus, Trash2,
  Loader2, CheckCircle, ChevronRight, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, ordersApi, ApiAddress, ApiOrder } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ApiError } from '@/lib/apiClient';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Në Pritje', CONFIRMED: 'Konfirmuar', PROCESSING: 'Procesim',
  SHIPPED: 'Nisur', DELIVERED: 'Dorëzuar', CANCELLED: 'Anuluar',
};
const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400', CONFIRMED: 'text-blue-400', PROCESSING: 'text-blue-400',
  SHIPPED: 'text-purple-400', DELIVERED: 'text-green-400', CANCELLED: 'text-red-400',
};

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Të paktën 8 karaktere.'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Fjalëkalimet nuk përputhen.', path: ['confirmPassword'] });
const addressFormSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;
type AddressFormData = z.infer<typeof addressFormSchema>;

type Section = 'orders' | 'wishlist' | 'profile' | 'addresses' | 'settings';

export function AccountPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState<Section>('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ApiAddress | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => { document.title = 'Llogaria — Elita5 Store'; }, []);
  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate(ROUTES.LOGIN);
  }, [isAuthenticated, authLoading, navigate]);
  useEffect(() => {
    if (location.pathname.includes('profili')) setActiveSection('profile');
    else if (location.pathname.includes('adresat')) setActiveSection('addresses');
    else if (location.pathname.includes('cilesimet')) setActiveSection('settings');
    else if (location.pathname.includes('porositë')) setActiveSection('orders');
  }, [location.pathname]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: ordersApi.getMyOrders,
    enabled: isAuthenticated && activeSection === 'orders',
  });

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['myAddresses'],
    queryFn: authApi.getAddresses,
    enabled: isAuthenticated && activeSection === 'addresses',
  });

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '' },
  });
  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });
  const addressForm = useForm<AddressFormData>({ resolver: zodResolver(addressFormSchema) });

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => { refreshUser(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); toast.success('Profili u përditësua.'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Gabim.'),
  });

  const passwordMutation = useMutation({
    mutationFn: (d: { currentPassword: string; newPassword: string }) => authApi.changePassword(d),
    onSuccess: () => { passwordForm.reset(); toast.success('Fjalëkalimi u ndryshua me sukses.'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Gabim.'),
  });

  const addressMutation = useMutation({
    mutationFn: (d: AddressFormData) =>
      editingAddress ? authApi.updateAddress(editingAddress.id, d) : authApi.createAddress(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myAddresses'] });
      setShowAddressForm(false);
      setEditingAddress(null);
      addressForm.reset();
      toast.success(editingAddress ? 'Adresa u përditësua.' : 'Adresa u shtua.');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Gabim.'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: authApi.deleteAddress,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['myAddresses'] }); toast.success('Adresa u fshi.'); },
  });

  if (authLoading) {
    return <div className="pt-[72px] min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-white/30" /></div>;
  }
  if (!user) return null;

  const NAV_ITEMS = [
    { id: 'orders' as Section, label: 'Porositë', Icon: Package },
    { id: 'wishlist' as Section, label: 'Lista e Dëshirave', Icon: Heart },
    { id: 'profile' as Section, label: 'Profili', Icon: User },
    { id: 'addresses' as Section, label: 'Adresat', Icon: MapPin },
    { id: 'settings' as Section, label: 'Cilësimet', Icon: Settings },
  ];

  return (
    <main className="pt-[72px] min-h-screen">
      {/* Header */}
      <div className="bg-[#0D0D0D] border-b border-white/[0.06] py-12">
        <div className="container-e5">
          <p className="section-label">Llogaria</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider mt-2">
            MIRË SE VINI,<br /><span className="text-[#B71C1C]">{user.firstName.toUpperCase()}</span>
          </h1>
        </div>
      </div>

      <div className="container-e5 py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                    activeSection === id
                      ? 'border-l-2 border-[#B71C1C] bg-white/[0.04] text-white pl-[14px]'
                      : 'text-white/40 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'
                  }`}
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => { logout(); navigate(ROUTES.HOME); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:text-white text-sm transition-colors"
              >
                <LogOut size={15} />
                Dil
              </button>
            </div>
          </aside>

          {/* Content */}
          <div>
            {/* ORDERS */}
            {activeSection === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-3xl text-white tracking-wider mb-6">POROSITË MIJA</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-white/30" /></div>
                ) : !orders?.length ? (
                  <div className="text-center py-16 border border-white/[0.06]">
                    <Package size={32} className="text-white/15 mx-auto mb-4" />
                    <p className="text-white/40 text-sm">Nuk keni porosi ende.</p>
                    <Link to={ROUTES.SHOP} className="btn-outline text-xs mt-6 inline-flex">Shiko Dyqanin</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST shortcut */}
            {activeSection === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-3xl text-white tracking-wider mb-6">LISTA E DËSHIRAVE</h2>
                <div className="text-center py-8 border border-white/[0.06]">
                  <Link to={ROUTES.WISHLIST} className="btn-primary text-xs inline-flex">
                    Shiko Listën e Dëshirave <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* PROFILE */}
            {activeSection === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-3xl text-white tracking-wider mb-6">PROFILI</h2>
                <form onSubmit={profileForm.handleSubmit(d => profileMutation.mutate(d))} className="space-y-5 max-w-md">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Emri</label>
                      <input className="input-e5 w-full" {...profileForm.register('firstName')} />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Mbiemri</label>
                      <input className="input-e5 w-full" {...profileForm.register('lastName')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Email</label>
                    <input className="input-e5 w-full opacity-50 cursor-not-allowed" value={user.email} disabled />
                  </div>
                  <div>
                    <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Telefoni</label>
                    <input className="input-e5 w-full" type="tel" {...profileForm.register('phone')} />
                  </div>
                  <button type="submit" disabled={profileMutation.isPending} className="btn-primary text-xs">
                    {profileMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : profileSaved ? <><CheckCircle size={13} /> Ruajtur</> : 'Ruaj Ndryshimet'}
                  </button>
                </form>

                <div className="mt-10 border-t border-white/[0.06] pt-8">
                  <h3 className="font-display text-2xl text-white tracking-wider mb-5">NDRYSHO FJALËKALIMIN</h3>
                  <form onSubmit={passwordForm.handleSubmit(d => passwordMutation.mutate(d))} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Fjalëkalimi Aktual</label>
                      <input type="password" className="input-e5 w-full" {...passwordForm.register('currentPassword')} />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Fjalëkalimi i Ri</label>
                      <input type="password" className="input-e5 w-full" {...passwordForm.register('newPassword')} />
                      {passwordForm.formState.errors.newPassword && <p className="mt-1 text-[#E53935] text-xs">{passwordForm.formState.errors.newPassword.message}</p>}
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Konfirmo Fjalëkalimin e Ri</label>
                      <input type="password" className="input-e5 w-full" {...passwordForm.register('confirmPassword')} />
                      {passwordForm.formState.errors.confirmPassword && <p className="mt-1 text-[#E53935] text-xs">{passwordForm.formState.errors.confirmPassword.message}</p>}
                    </div>
                    <button type="submit" disabled={passwordMutation.isPending} className="btn-outline text-xs">
                      {passwordMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Ndrysho Fjalëkalimin'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ADDRESSES */}
            {activeSection === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl text-white tracking-wider">ADRESAT</h2>
                  <button onClick={() => { setEditingAddress(null); addressForm.reset(); setShowAddressForm(true); }} className="btn-outline text-xs flex items-center gap-2">
                    <Plus size={13} /> Shto Adresë
                  </button>
                </div>

                {addrLoading ? <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-white/30" /></div> : (
                  <div className="space-y-3">
                    {addresses?.map(addr => (
                      <div key={addr.id} className="flex items-start justify-between p-5 bg-[#161616] border border-white/[0.06] hover:border-white/15 transition-colors">
                        <div>
                          {addr.isDefault && <span className="text-[9px] font-bold tracking-widest uppercase text-[#E53935] mb-2 block">E Parazgjedhur</span>}
                          <p className="text-white font-semibold text-sm">{addr.firstName} {addr.lastName}</p>
                          <p className="text-white/50 text-sm mt-1">{addr.addressLine1}</p>
                          {addr.addressLine2 && <p className="text-white/50 text-sm">{addr.addressLine2}</p>}
                          <p className="text-white/50 text-sm">{addr.city}, {addr.postalCode}, {addr.country}</p>
                          {addr.phone && <p className="text-white/40 text-xs mt-1">{addr.phone}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingAddress(addr); addressForm.reset(addr as never); setShowAddressForm(true); }} className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                            <Settings size={12} />
                          </button>
                          <button onClick={() => deleteAddressMutation.mutate(addr.id)} className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#E53935] hover:border-[#E53935]/30 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showAddressForm && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-[#161616] border border-white/[0.06]">
                    <h3 className="font-display text-2xl text-white tracking-wider mb-5">{editingAddress ? 'NDRYSHO ADRESËN' : 'SHTO ADRESË'}</h3>
                    <form onSubmit={addressForm.handleSubmit(d => addressMutation.mutate(d))} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Emri *</label>
                          <input className="input-e5 w-full" {...addressForm.register('firstName')} />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Mbiemri *</label>
                          <input className="input-e5 w-full" {...addressForm.register('lastName')} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Qyteti *</label>
                          <input className="input-e5 w-full" {...addressForm.register('city')} />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Kodi Postar *</label>
                          <input className="input-e5 w-full" {...addressForm.register('postalCode')} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Adresa *</label>
                        <input className="input-e5 w-full" {...addressForm.register('addressLine1')} />
                      </div>
                      <div>
                        <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Adresa (shtesë)</label>
                        <input className="input-e5 w-full" {...addressForm.register('addressLine2')} />
                      </div>
                      <input type="hidden" value="XK" {...addressForm.register('country')} />
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="accent-[#B71C1C]" {...addressForm.register('isDefault')} />
                        <span className="text-white/50 text-sm">Vendos si adresë të parazgjedhur</span>
                      </label>
                      <div className="flex gap-3">
                        <button type="submit" disabled={addressMutation.isPending} className="btn-primary text-xs">
                          {addressMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Ruaj Adresën'}
                        </button>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-ghost text-xs">Anulo</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SETTINGS */}
            {activeSection === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-3xl text-white tracking-wider mb-6">CILËSIMET</h2>
                <div className="space-y-4">
                  <div className="p-5 bg-[#161616] border border-white/[0.06]">
                    <p className="text-white font-semibold text-sm mb-1">Anëtar që nga</p>
                    <p className="text-white/40 text-sm">{new Date(user.createdAt).toLocaleDateString('sq', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="p-5 bg-[#161616] border border-white/[0.06]">
                    <p className="text-white font-semibold text-sm mb-1">Roli i Llogarisë</p>
                    <p className="text-white/40 text-sm">{user.role === 'ADMIN' ? 'Administrator' : 'Klient'}</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="btn-accent text-xs inline-flex">
                      Paneli i Administratorit <ChevronRight size={14} />
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); navigate(ROUTES.HOME); }}
                    className="btn-outline text-xs flex items-center gap-2 border-red-500/30 text-red-400 hover:border-red-400 hover:text-red-300"
                  >
                    <LogOut size={13} /> Dil nga Llogaria
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderRow({ order }: { order: ApiOrder }) {
  const statusColor = ORDER_STATUS_COLORS[order.orderStatus] ?? 'text-white/50';
  const statusLabel = ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161616] border border-white/[0.06] hover:border-white/15 transition-colors">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white font-semibold text-sm">{order.orderNumber}</span>
          <span className={`text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
        </div>
        <p className="text-white/35 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('sq', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="text-white/40 text-xs mt-0.5">{order.items.length} produkt(e)</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-bold">{CURRENCY_SYMBOL}{parseFloat(order.total).toFixed(2)}</span>
        <Link to={`/llogaria/porosi/${order.id}`} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
          <Eye size={13} /> Detajet
        </Link>
      </div>
    </div>
  );
}
