import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Banknote, Building2, Loader2, Lock, Tag, X } from 'lucide-react';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/services/api';
import { COUNTRIES, CURRENCY_SYMBOL } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { ApiError as ApiErrorClass } from '@/lib/apiClient';
import { toast } from 'sonner';

const FREE_SHIPPING_THRESHOLD = 60;
const SHIPPING_COST = 3;
const TAX_RATE = 0.18;

const addressSchema = z.object({
  firstName: z.string().min(2, 'Emri duhet të ketë të paktën 2 karaktere.'),
  lastName: z.string().min(2, 'Mbiemri duhet të ketë të paktën 2 karaktere.'),
  email: z.string().email('Email i pavlefshëm.'),
  phone: z.string().min(6, 'Numri i telefonit duhet të ketë të paktën 6 karaktere.'),
  country: z.string().min(2, 'Shteti është i detyrueshëm.'),
  city: z.string().min(2, 'Qyteti është i detyrueshëm.'),
  postalCode: z.string().min(4, 'Kodi postar duhet të ketë të paktën 4 karaktere.'),
  addressLine1: z.string().min(5, 'Adresa duhet të ketë të paktën 5 karaktere.'),
  addressLine2: z.string().optional(),
  customerNotes: z.string().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

const STEPS = ['Informacioni', 'Adresa', 'Dërgesa', 'Pagesa', 'Rishikim'];
type PaymentMethod = 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, couponCode, couponDiscount, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState<AddressFormData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  useEffect(() => { document.title = 'Checkout — Elita5 Store'; }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) navigate(ROUTES.SHOP);
  }, [items.length, navigate]);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'XK',
      email: user?.email ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  const discountAmount = appliedDiscount?.amount ?? (couponDiscount ? (subtotal * couponDiscount) / 100 : 0);
  const shipping = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = (subtotal - discountAmount) * TAX_RATE;
  const total = subtotal - discountAmount + shipping + tax;

  const handleValidateDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountError('');
    setDiscountLoading(true);
    try {
      const result = await ordersApi.validateDiscount(discountInput.trim(), subtotal);
      setAppliedDiscount({ code: discountInput.trim().toUpperCase(), amount: result.discountAmount });
      toast.success(`Kodi "${discountInput.toUpperCase()}" u aplikua!`);
      setDiscountInput('');
    } catch (err) {
      setDiscountError(err instanceof ApiErrorClass ? err.message : 'Kodi nuk është i vlefshëm.');
    } finally {
      setDiscountLoading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!shippingData) throw new Error('Mungojnë të dhënat e adresës.');
      const orderData: Record<string, unknown> = {
        customerEmail: shippingData.email,
        customerPhone: shippingData.phone,
        customerNotes: shippingData.customerNotes,
        shippingFirstName: shippingData.firstName,
        shippingLastName: shippingData.lastName,
        shippingCountry: shippingData.country,
        shippingCity: shippingData.city,
        shippingPostalCode: shippingData.postalCode,
        shippingAddress1: shippingData.addressLine1,
        shippingAddress2: shippingData.addressLine2,
        paymentMethod,
        discountCode: appliedDiscount?.code ?? couponCode ?? undefined,
      };

      // If not authenticated, pass cart items from local state
      if (!user) {
        orderData.guestItems = items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        }));
      }

      return ordersApi.create(orderData);
    },
    onSuccess: async (order) => {
      await clearCart();
      navigate(ROUTES.ORDER_CONFIRMATION(order.id));
    },
    onError: (err) => {
      const msg = err instanceof ApiErrorClass ? err.message : 'Gabim gjatë krijimit të porosisë.';
      toast.error(msg);
    },
  });

  const handleNextStep = async () => {
    if (step === 0) {
      const valid = await trigger(['firstName', 'lastName', 'email', 'phone']);
      if (valid) setStep(1);
    } else if (step === 1) {
      const valid = await trigger(['country', 'city', 'postalCode', 'addressLine1']);
      if (valid) { setShippingData(getValues()); setStep(2); }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setShippingData(getValues());
      setStep(4);
    }
  };

  return (
    <main className="pt-[72px] min-h-screen">
      {/* Progress bar */}
      <div className="border-b border-white/[0.06] bg-[#0D0D0D]">
        <div className="container-e5 py-4">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => { if (i < step) setStep(i); }}
                  disabled={i > step}
                  className={`flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                    i < step ? 'text-white/50 hover:text-white cursor-pointer'
                      : i === step ? 'text-white'
                      : 'text-white/20 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center border text-[9px] ${
                    i < step ? 'border-green-500 bg-green-500 text-white'
                      : i === step ? 'border-white text-white'
                      : 'border-white/15 text-white/20'
                  }`}>
                    {i < step ? <Check size={10} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={12} className="text-white/15 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-e5 py-10">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit(() => mutation.mutate())} noValidate>

            {/* Step 0 — Contact info */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h2 className="font-display text-3xl text-white tracking-wider mb-6">INFORMACIONI</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Emri *</label>
                        <input id="firstName" className="input-e5 w-full" {...register('firstName')} />
                        {errors.firstName && <p className="mt-1 text-[#E53935] text-xs">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Mbiemri *</label>
                        <input id="lastName" className="input-e5 w-full" {...register('lastName')} />
                        {errors.lastName && <p className="mt-1 text-[#E53935] text-xs">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Email *</label>
                      <input id="email" type="email" className="input-e5 w-full" {...register('email')} />
                      {errors.email && <p className="mt-1 text-[#E53935] text-xs">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Telefoni *</label>
                      <input id="phone" type="tel" className="input-e5 w-full" placeholder="+383 44 000 000" {...register('phone')} />
                      {errors.phone && <p className="mt-1 text-[#E53935] text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1 — Address */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h2 className="font-display text-3xl text-white tracking-wider mb-6">ADRESA E DËRGIMIT</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="country" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Shteti *</label>
                      <select id="country" className="input-e5 w-full" {...register('country')}>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Qyteti *</label>
                        <input id="city" className="input-e5 w-full" {...register('city')} />
                        {errors.city && <p className="mt-1 text-[#E53935] text-xs">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Kodi Postar *</label>
                        <input id="postalCode" className="input-e5 w-full" {...register('postalCode')} />
                        {errors.postalCode && <p className="mt-1 text-[#E53935] text-xs">{errors.postalCode.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="addressLine1" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Adresa *</label>
                      <input id="addressLine1" className="input-e5 w-full" placeholder="Rruga, Nr. shtëpisë..." {...register('addressLine1')} />
                      {errors.addressLine1 && <p className="mt-1 text-[#E53935] text-xs">{errors.addressLine1.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="addressLine2" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Adresa (shtesë)</label>
                      <input id="addressLine2" className="input-e5 w-full" placeholder="Apartamenti, suitë, kat..." {...register('addressLine2')} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Shipping */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h2 className="font-display text-3xl text-white tracking-wider mb-6">METODA E DËRGIMIT</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard', time: '3–5 ditë pune', price: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST },
                      { id: 'express', label: 'Express', time: '1–2 ditë pune', price: 7.5 },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${true ? 'border-white/20' : 'border-white/[0.06]'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" value={opt.id} defaultChecked={opt.id === 'standard'} className="accent-[#B71C1C]" />
                          <div>
                            <p className="text-white text-sm font-semibold">{opt.label}</p>
                            <p className="text-white/35 text-xs">{opt.time}</p>
                          </div>
                        </div>
                        <span className="text-white font-semibold">
                          {opt.price === 0 ? <span className="text-green-400">Falas</span> : `${CURRENCY_SYMBOL}${opt.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-white/50 text-[10px] tracking-widest uppercase mb-1.5">Shënime shtesë</label>
                    <textarea id="notes" rows={3} className="input-e5 w-full resize-none" placeholder="Instruksione specifike për dorëzim..." {...register('customerNotes')} />
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Payment */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h2 className="font-display text-3xl text-white tracking-wider mb-6">METODA E PAGESËS</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'CASH_ON_DELIVERY' as PaymentMethod, label: 'Para në dorëzim', desc: 'Paguani kur produkti arrin.', Icon: Banknote },
                      { id: 'BANK_TRANSFER' as PaymentMethod, label: 'Transfer bankar', desc: 'Detajet e transferit do t\'i merrni me email.', Icon: Building2 },
                    ].map(({ id, label, desc, Icon }) => (
                      <label key={id} className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === id ? 'border-white/40 bg-white/[0.03]' : 'border-white/[0.06] hover:border-white/15'}`}>
                        <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-[#B71C1C]" />
                        <Icon size={18} className="text-white/40 flex-shrink-0" />
                        <div>
                          <p className="text-white text-sm font-semibold">{label}</p>
                          <p className="text-white/40 text-xs">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-[#161616] border border-white/[0.06] flex items-start gap-3">
                    <Lock size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
                    <p className="text-white/35 text-xs leading-relaxed">Informacioni juaj ruhet me siguri të plotë. Nuk pranojmë pagesa me kartë tani — funksion i ardhshëm.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 4 — Review */}
              {step === 4 && shippingData && (
                <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h2 className="font-display text-3xl text-white tracking-wider mb-6">RISHIKIMI</h2>
                  <div className="space-y-4">
                    <div className="bg-[#161616] border border-white/[0.06] p-5">
                      <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">Adresa e Dërgimit</p>
                      <p className="text-white text-sm">{shippingData.firstName} {shippingData.lastName}</p>
                      <p className="text-white/50 text-sm">{shippingData.addressLine1}{shippingData.addressLine2 ? `, ${shippingData.addressLine2}` : ''}</p>
                      <p className="text-white/50 text-sm">{shippingData.city}, {shippingData.postalCode}, {shippingData.country}</p>
                    </div>
                    <div className="bg-[#161616] border border-white/[0.06] p-5">
                      <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">Pagesa</p>
                      <p className="text-white text-sm">{paymentMethod === 'CASH_ON_DELIVERY' ? 'Para në Dorëzim' : 'Transfer Bankar'}</p>
                    </div>
                    {mutation.error && (
                      <div className="p-4 bg-[#B71C1C]/10 border border-[#B71C1C]/25 text-[#E53935] text-sm">
                        {mutation.error instanceof ApiErrorClass ? mutation.error.message : 'Gabim gjatë procesimit të porosisë.'}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => step > 0 ? setStep(s => s - 1) : undefined}
                className={`btn-outline text-xs ${step === 0 ? 'invisible' : ''}`}
              >
                Prapa
              </button>

              {step < 4 ? (
                <button type="button" onClick={handleNextStep} className="btn-primary text-xs">
                  Vazhdo <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                  className="btn-accent text-xs flex items-center gap-2"
                >
                  {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Lock size={13} />}
                  {mutation.isPending ? 'Duke procesuar...' : 'Konfirmo Porosinë'}
                </button>
              )}
            </div>
          </form>

          {/* Order summary sidebar */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <h3 className="font-display text-2xl text-white tracking-wider">PËRMBLEDHJA</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {items.map(item => (
                <div key={`${item.productId}_${item.variantId}`} className="flex gap-3">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-14 h-14 object-cover bg-[#161616] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-1">{item.product?.name ?? 'Produkt'}</p>
                    {item.variant?.size && <p className="text-white/30 text-xs">Madhësia: {item.variant.size}</p>}
                    <p className="text-white/50 text-xs">Sasia: {item.quantity}</p>
                  </div>
                  <p className="text-white text-xs font-semibold flex-shrink-0">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="border-t border-white/[0.06] pt-4">
              {!appliedDiscount ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                    className="input-e5 flex-1 text-xs uppercase"
                    placeholder="KOD ZBRITJE"
                    onKeyDown={e => e.key === 'Enter' && handleValidateDiscount()}
                  />
                  <button
                    type="button"
                    onClick={handleValidateDiscount}
                    disabled={discountLoading}
                    className="w-10 h-[46px] bg-[#161616] border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
                  >
                    {discountLoading ? <Loader2 size={12} className="animate-spin" /> : <Tag size={13} />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-green-400" />
                    <span className="text-green-400 text-xs font-bold">{appliedDiscount.code}</span>
                  </div>
                  <button onClick={() => setAppliedDiscount(null)} className="text-white/30 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
              )}
              {discountError && <p className="mt-1.5 text-[#E53935] text-xs">{discountError}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-white/[0.06] pt-4 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Nëntotali</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Zbritja</span>
                  <span>-{CURRENCY_SYMBOL}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50">
                <span>Dërgesa</span>
                <span>{shipping === 0 ? <span className="text-green-400">Falas</span> : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>TVSH (18%)</span>
                <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-white/[0.06] pt-2 mt-2">
                <span>Totali</span>
                <span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
              </div>
            </div>

            <Link to={ROUTES.CART} className="text-white/30 hover:text-white text-xs transition-colors flex items-center gap-1">
              ← Kthehu në shportë
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
