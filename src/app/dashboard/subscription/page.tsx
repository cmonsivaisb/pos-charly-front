'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubscriptionPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/subscription/status');
      setStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    try {
      await api.post('/subscription/activate-trial');
      alert('Suscripción activada (Simulación)');
      fetchStatus();
    } catch (err) {
      alert('Error al activar');
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  const isActive = status?.subscriptionStatus === 'ACTIVE';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Suscripción</h1>

      <div className={`card shadow-xl ${isActive ? 'bg-success text-success-content' : 'bg-warning text-warning-content'}`}>
        <div className="card-body flex-row items-center gap-6">
          {isActive ? <CheckCircle className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
          <div>
            <h2 className="card-title text-2xl">Estado: {status?.subscriptionStatus}</h2>
            <p>
              {isActive 
                ? `Tu cuenta está activa. Próximo pago: ${new Date(status.nextPaymentDate).toLocaleDateString()}`
                : 'Tu cuenta está en periodo de prueba por 15 días o requiere pago.'}
            </p>
          </div>
        </div>
      </div>

      {!isActive && (
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body">
              <h2 className="card-title text-primary">Plan Software</h2>
              <p className="text-4xl font-bold my-4">$499 <span className="text-sm font-normal text-slate-500">MXN/mes</span></p>
              <div className="badge badge-outline mb-4 text-[10px] font-bold uppercase">Software y Soporte</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-success" /> Ventas ilimitadas
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-success" /> Soporte técnico
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-slate-400 italic">
                  * Demo limitada por tiempo (15 días)
                </li>
              </ul>
              <button className="btn btn-primary btn-block h-14" onClick={handlePay}>
                <CreditCard className="w-4 h-4 mr-2" /> Pagar con PayPal
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body">
              <h2 className="card-title">Pago Manual</h2>
              <p className="text-sm opacity-70 mb-4">
                Transfiere a la siguiente cuenta y sube tu comprobante.
              </p>
              <div className="bg-base-200 p-4 rounded-lg text-sm mb-6">
                <p><strong>Banco:</strong> BBVA</p>
                <p><strong>CLABE:</strong> 0123 4567 8901 2345 67</p>
                <p><strong>Beneficiario:</strong> POS SaaS México</p>
              </div>
              <button className="btn btn-outline btn-block">
                Reportar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
