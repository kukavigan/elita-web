import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { ROUTES } from '@/lib/routes';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => { document.title = 'Porosia Konfirmuar — Elita5 Store'; }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl text-white tracking-wider">POROSIA NUK U GJET</h2>
          <Link to={ROUTES.SHOP} className="btn-primary text-xs mt-6 inline-flex">Kthehu në Dyqan</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="container-e5 py-16 max-w-3xl mx-auto">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <p className="section-label mx-auto w-fit">Porosia Juaj</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider mt-2">KONFIRMUAR!</h1>
          <p className="text-white/40 text-sm mt-4 max-w-sm mx-auto">
            Faleminderit për porosinë tuaj. Do të merrni email konfirmimi së shpejti.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10">
            <span className="text-white/40 text-xs">Numri i porosisë:</span>
            <span className="text-white font-bold text-sm tracking-wider">{order.orderNumber}</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {/* Order items */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#161616] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <Package size={16} className="text-white/40" />
              <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Produktet</h2>
            </div>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover bg-[#202020] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1">{item.productName}</p>
                    <div className="flex gap-3 mt-0.5">
                      {item.size && <span className="text-white/35 text-xs">Madhësia: {item.size}</span>}
                      <span className="text-white/35 text-xs">Sasia: {item.quantity}</span>
                    </div>
                  </div>
                  <p className="text-white text-sm font-semibold">{CURRENCY_SYMBOL}{parseFloat(item.totalPrice).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] mt-5 pt-5 space-y-2 text-sm">
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Zbritja</span>
                  <span>-{CURRENCY_SYMBOL}{parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50">
                <span>Dërgesa</span>
                <span>{parseFloat(order.shippingCost) === 0 ? 'Falas' : `${CURRENCY_SYMBOL}${parseFloat(order.shippingCost).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>TVSH</span>
                <span>{CURRENCY_SYMBOL}{parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/[0.06]">
                <span>Totali</span>
                <span>{CURRENCY_SYMBOL}{parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Shipping address */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#161616] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={16} className="text-white/40" />
              <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Adresa e Dërgimit</h2>
            </div>
            <p className="text-white text-sm">{order.shippingFirstName} {order.shippingLastName}</p>
            <p className="text-white/50 text-sm">{order.shippingAddress1}</p>
            {order.shippingAddress2 && <p className="text-white/50 text-sm">{order.shippingAddress2}</p>}
            <p className="text-white/50 text-sm">{order.shippingCity}, {order.shippingPostalCode}</p>
            <p className="text-white/50 text-sm">{order.shippingCountry}</p>
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#161616] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={16} className="text-white/40" />
              <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Pagesa</h2>
            </div>
            <p className="text-white text-sm">
              {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Para në Dorëzim' : 'Transfer Bankar'}
            </p>
            {order.paymentMethod === 'BANK_TRANSFER' && (
              <div className="mt-3 p-3 bg-[#202020] text-xs text-white/50 leading-relaxed">
                Detajet e transferit do t'i merrni me email në <strong className="text-white">{order.customerEmail}</strong>.
                Ju lutemi kryeni pagesën brenda 48 orëve.
              </div>
            )}
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => window.print()}
            className="btn-outline text-xs"
          >
            Shkarko Faturën
          </button>
          <Link to={ROUTES.SHOP} className="btn-primary text-xs">
            Vazhdo Blerjen <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
