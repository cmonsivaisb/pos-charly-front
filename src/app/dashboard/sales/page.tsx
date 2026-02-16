'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Receipt, Search, Calendar, User, CreditCard, Banknote } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'CASH': return <Banknote className="w-4 h-4" />;
      case 'CARD': return <CreditCard className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Receipt className="w-8 h-8" /> Historial de Ventas
        </h1>
        <button className="btn btn-outline" onClick={fetchSales}>
          Actualizar
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Cajero</th>
                  <th>Método</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Cargando...</td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No se han registrado ventas</td></tr>
                ) : (
                  sales.map((sale: any) => (
                    <tr key={sale.id}>
                      <td className="font-bold">#{sale.folio}</td>
                      <td>{formatDate(sale.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 opacity-50" />
                          {sale.user?.name || sale.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 badge badge-ghost">
                          {getPaymentIcon(sale.paymentMethod)}
                          {sale.paymentMethod === 'CASH' ? 'Efectivo' : 'Tarjeta'}
                        </div>
                      </td>
                      <td className="font-bold text-primary">${sale.total}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedSale(sale);
                            (window as any).sale_details_modal.showModal();
                          }}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="sale_details_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Detalles de Venta #{selectedSale?.folio}</h3>
          
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="opacity-70 text-xs uppercase font-bold text-primary">Fecha y Hora</p>
                  <p className="font-medium">{formatDate(selectedSale.createdAt)}</p>
                </div>
                <div>
                  <p className="opacity-70 text-xs uppercase font-bold text-primary">Método de Pago</p>
                  <p className="font-medium">{selectedSale.paymentMethod === 'CASH' ? 'Efectivo' : 'Tarjeta'}</p>
                </div>
                <div>
                  <p className="opacity-70 text-xs uppercase font-bold text-primary">Cajero</p>
                  <p className="font-medium">{selectedSale.user?.name || selectedSale.user?.email}</p>
                </div>
                <div>
                  <p className="opacity-70 text-xs uppercase font-bold text-primary">Cliente</p>
                  <p className="font-medium">{selectedSale.customer?.name || 'Venta al Mostrador'}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-right">Unit.</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="text-xs font-medium">{item.productName}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">${item.unitPrice}</td>
                        <td className="text-right font-bold">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-base-200">
                    <tr>
                      <td colSpan={3} className="text-right font-bold text-primary uppercase">Total</td>
                      <td className="text-right font-bold text-xl text-primary">${selectedSale.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          <div className="modal-action">
            <button className="btn btn-primary btn-block" onClick={() => (window as any).sale_details_modal.close()}>Cerrar</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
