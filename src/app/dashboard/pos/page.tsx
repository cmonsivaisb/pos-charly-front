'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Search, CreditCard, Banknote, Trash2, Plus, Minus, PackageX, Printer } from 'lucide-react';
import { Ticket } from '@/components/Ticket';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

export default function POSPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<{ cart: any[], total: number, paymentMethod: string } | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.priceTotal,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleCheckout = async (method: string) => {
    if (cart.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    const currentCart = [...cart];
    const currentTotal = total;
    
    try {
      const payload = {
        items: currentCart.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        })),
        paymentMethod: method,
      };
      await api.post('/sales', payload);
      
      setLastSale({ cart: currentCart, total: currentTotal, paymentMethod: method });
      
      fetchProducts(); // Refresh stock

      // Success Alert
      await Swal.fire({
        title: '¡Venta Exitosa!',
        text: `Total cobrado: $${currentTotal.toFixed(2)}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'center',
        toast: false
      });

      // Small delay to ensure state update and Ticket component re-render before showing print dialog
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.print();
          setCart([]); // Clear cart AFTER print dialog trigger
        }
      }, 1000);

    } catch (err: any) {
      console.error('Checkout error:', err);
      const message = err.response?.data?.message;
      if (Array.isArray(message)) {
        alert(`Error: ${message.join(', ')}`);
      } else if (message) {
        alert(`Error: ${message}`);
      } else {
        alert('Error al realizar la venta');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
    (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-base-200">
      {/* Hidden Ticket for Printing */}
      <div className="hidden print:block">
        {lastSale && (
          <Ticket 
            ref={ticketRef}
            cart={lastSale.cart}
            total={lastSale.total}
            paymentMethod={lastSale.paymentMethod}
            userEmail={user?.email || ''}
          />
        )}
      </div>

      {/* Left side: Product selection */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="BUSCAR PRODUCTO O ESCANEAR CÓDIGO..."
            className="input w-full pl-12 h-14 bg-base-100 border-2 border-base-300 focus:border-primary font-bold tracking-wide uppercase transition-all shadow-retail text-sm text-base-content"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-2 pb-10 content-start">
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              className="group bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-all overflow-hidden flex flex-col shadow-retail relative"
              style={{ height: 'auto', minHeight: 'min-content' }}
              onClick={() => addToCart(p)}
            >
              <div className="aspect-square bg-base-300 relative overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={p.imagePath ? `http://localhost:3001/${p.imagePath.replace(/\\/g, '/')}` : 'https://placehold.co/400x400?text=PRODUCT'}
                  alt={p.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=IMG+ERROR';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm ${p.stock > 0 ? 'bg-success text-success-content' : 'bg-error text-error-content'}`}>
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1 min-h-0">
                <h3 className="font-display font-bold text-[11px] leading-tight line-clamp-2 mb-1 uppercase tracking-tight group-hover:text-primary transition-colors text-base-content">
                  {p.name}
                </h3>
                <div className="mt-auto flex flex-col gap-1">
                  <span className="font-display font-bold text-lg text-primary leading-none">
                    ${Number(p.priceTotal).toFixed(2)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">
                    SKU: {p.sku || 'N/A'}
                  </span>
                </div>
              </div>
              {/* Hover Add Indicator */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-primary text-white px-4 py-2 rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform font-bold text-xs">
                  AÑADIR
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="col-span-full flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>}
          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-20 opacity-50">
              <PackageX className="w-16 h-16 mb-4 text-base-content" />
              <p className="font-bold uppercase tracking-widest text-base-content">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Cart / Checkout Terminal */}
      <div className="w-[450px] bg-base-100 border-l-2 border-base-300 flex flex-col shadow-2xl z-10">
        {/* Terminal Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b-4 border-primary dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold leading-none uppercase tracking-tighter">Orden Actual</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Terminal #01</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-display font-bold text-primary leading-none">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Artículos</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
              <ShoppingCart className="w-24 h-24 mb-4 text-base-content" />
              <p className="font-display font-bold text-xl uppercase tracking-widest text-center px-10 text-base-content">Esperando productos...</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 bg-base-200 p-3 border-2 border-transparent hover:border-primary/30 transition-all shadow-sm group">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs uppercase truncate leading-none mb-2 text-base-content">{item.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-display font-bold text-sm">${Number(item.unitPrice).toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Sub: ${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-base-100 border border-base-300 rounded overflow-hidden">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-base-300 text-slate-500 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-base-content">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-base-300 text-slate-500 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  className="btn btn-square btn-xs btn-ghost text-slate-400 hover:text-error"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="p-6 bg-base-200 border-t-2 border-base-300 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
              <span className="font-display font-bold text-base-content opacity-70">${(total * 0.84).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IVA (16%)</span>
              <span className="font-display font-bold text-base-content opacity-70">${(total * 0.16).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-300 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-base-content uppercase tracking-tighter">Total a Pagar</span>
              <span className="text-4xl font-display font-bold text-primary tracking-tighter">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="btn bg-success hover:bg-success-dark text-white border-none h-20 flex-col gap-1 shadow-retail active:translate-y-1 transition-all group"
              onClick={() => handleCheckout('CASH')}
              disabled={cart.length === 0 || isProcessing}
            >
              <Banknote className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold tracking-widest uppercase">Efectivo</span>
            </button>
            <button
              className="btn bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white border-none h-20 flex-col gap-1 shadow-retail active:translate-y-1 transition-all group"
              onClick={() => handleCheckout('CARD')}
              disabled={cart.length === 0 || isProcessing}
            >
              <CreditCard className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold tracking-widest uppercase">Tarjeta</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="btn btn-ghost btn-block btn-sm text-slate-500 hover:text-error uppercase text-[10px] font-bold tracking-[0.2em]"
              onClick={() => setCart([])}
              disabled={cart.length === 0 || isProcessing}
            >
              Anular Orden
            </button>
            {lastSale && (
              <button
                className="btn btn-outline btn-primary btn-block btn-sm flex gap-2 items-center text-[10px] font-bold tracking-widest uppercase"
                onClick={() => window.print()}
              >
                <Printer className="w-3 h-3" />
                Reimprimir Último Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
