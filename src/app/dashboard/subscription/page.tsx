'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, requestsRes] = await Promise.all([
        api.get('/payments/status'),
        api.get('/payments/manual/my-requests'),
      ]);
      setStatus(statusRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMPPayment = async () => {
    try {
      const response = await api.post('/payments/mercadopago/create-preference', {
        entityType: 'SUBSCRIPTION',
        entityId: user?.tenantId,
        amount: 499,
        description: 'Suscripción Mensual POS SaaS',
      });
      window.location.href = response.data.init_point;
    } catch (error) {
      toast.error('Error al iniciar pago con Mercado Pago');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await api.post('/payments/manual/requests', { amount: '499.00', bankName: 'Manual Upload' });

      toast.success('Solicitud enviada con éxito');
      fetchData();
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestión de Suscripción</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Estado Actual */}
        <div className="card bg-base-100 shadow-xl border-t-4 border-primary lg:col-span-1">
          <div className="card-body">
            <h2 className="card-title text-primary">Estado Actual</h2>
            <div className="mt-4 flex flex-col items-center">
              <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
                status?.subscriptionStatus === 'ACTIVE' 
                  ? 'bg-success/20 text-success border border-success' 
                  : 'bg-warning/20 text-warning border border-warning'
              }`}>
                {status?.subscriptionStatus || 'SIN ESTADO'}
              </div>
              {status?.nextPaymentDate && (
                <p className="mt-4 text-sm font-medium opacity-70 text-center">
                  Próximo pago:<br/>
                  <span className="font-bold">{new Date(status.nextPaymentDate).toLocaleDateString()}</span>
                </p>
              )}
            </div>
            <div className="divider text-xs opacity-50 uppercase tracking-widest mt-8">Pagar con</div>
            <button 
              onClick={handleMPPayment} 
              className="btn btn-primary btn-block"
              disabled={status?.subscriptionStatus === 'ACTIVE'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pagar con Mercado Pago
            </button>
            <p className="text-[10px] text-center opacity-70 mt-2 italic">
              Activación automática inmediata
            </p>
          </div>
        </div>

        {/* Pago Manual */}
        <div className="card bg-base-100 shadow-xl border-t-4 border-secondary lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-secondary">Depósito o Transferencia Bancaria</h2>
            
            <div className="bg-base-200 p-4 rounded-lg mt-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold border-b border-base-300 mb-2 pb-1">Datos para pago:</p>
                <p><strong>Monto:</strong> $499.00 MXN</p>
                <p><strong>Banco:</strong> BBVA México</p>
                <p><strong>CLABE:</strong> 0123 4567 8901 2345 67</p>
                <p><strong>Concepto:</strong> {user?.tenantId.substring(0,8)}</p>
              </div>
              <div className="flex flex-col justify-center items-center border-l border-base-300 pl-4">
                <p className="text-center font-bold mb-2">Comprobante deshabilitado:</p>
                <form onSubmit={handleManualSubmit} className="w-full space-y-3">
                  <div className="text-xs opacity-60 text-center">No se admiten subidas de archivos por el momento.</div>
                  <button
                    type="submit"
                    className={`btn btn-secondary btn-sm btn-block ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    Enviar Solicitud
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de solicitudes */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Pagos Manuales
        </h3>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 opacity-50 italic">No has registrado solicitudes de pago</td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req.id}>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="font-medium">${req.amount}</td>
                    <td>
                      <span className={`badge badge-sm font-bold ${
                        req.status === 'APPROVED' ? 'badge-success' : 
                        req.status === 'REJECTED' ? 'badge-error' : 'badge-info'
                      }`}>
                        {req.status}
                      </span>
                      {req.adminComment && (
                        <div className="text-[10px] opacity-70 italic max-w-[200px]" title={req.adminComment}>
                          Nota: {req.adminComment}
                        </div>
                      )}
                    </td>
                    <td>
                      {req.evidencePath ? (
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${req.evidencePath}`} 
                          target="_blank" 
                          className="btn btn-xs btn-outline btn-ghost"
                        >
                          Ver comprobante
                        </a>
                      ) : (
                        <span className="text-xs text-error">Sin archivo</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
