'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Search, User, CreditCard, Banknote } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (method: string) => {
    if (cart.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const payload = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        })),
        paymentMethod: method,
      };
      await api.post('/sales', payload);
      alert('Venta realizada con éxito');
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error al realizar la venta');
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left side: Product selection */}
      <div className="flex-1 flex flex-col p-4 bg-base-200 overflow-hidden">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
          <input
            type="text"
            placeholder="Buscar producto (F1)..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              className="card bg-base-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow overflow-hidden"
              onClick={() => addToCart(p)}
            >
              <figure className="h-32 bg-base-200">
                <img 
                  src={p.imagePath ? `http://localhost:3001/${p.imagePath}` : 'https://placehold.co/200x150?text=Sin+Foto'} 
                  alt={p.name}
                  className="object-cover w-full h-full"
                />
              </figure>
              <div className="card-body p-3">
                <h3 className="font-bold text-xs truncate" title={p.name}>{p.name}</h3>
                <p className="text-primary font-bold text-md">${p.priceTotal}</p>
                <div className="flex justify-between items-center text-[10px] opacity-70">
                  <span>Stock: {p.stock}</span>
                  <span className="badge badge-xs">{p.sku || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Cart */}
      <div className="w-96 bg-base-100 border-l flex flex-col shadow-xl">
        <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-content">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Carrito
          </h2>
          <span className="badge badge-secondary">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <ShoppingCart className="w-16 h-16 mx-auto mb-2" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <div className="text-xs opacity-70">
                    {item.quantity} x ${item.unitPrice}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  <button
                    className="btn btn-circle btn-xs btn-ghost text-error"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-base-200 border-t space-y-4">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="btn btn-success btn-lg flex-col h-auto py-4"
              onClick={() => handleCheckout('CASH')}
              disabled={cart.length === 0}
            >
              <Banknote className="w-6 h-6 mb-1" />
              Efectivo
            </button>
            <button
              className="btn btn-info btn-lg flex-col h-auto py-4"
              onClick={() => handleCheckout('CARD')}
              disabled={cart.length === 0}
            >
              <CreditCard className="w-6 h-6 mb-1" />
              Tarjeta
            </button>
          </div>
          <button
            className="btn btn-outline btn-block"
            onClick={() => setCart([])}
            disabled={cart.length === 0}
          >
            Limpiar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
