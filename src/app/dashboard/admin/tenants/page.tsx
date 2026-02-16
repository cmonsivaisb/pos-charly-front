'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/admin/tenants');
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, reason?: string) => {
    try {
      await api.patch(`/admin/tenants/${id}/subscription`, { status, suspendedReason: reason });
      fetchTenants();
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-8 h-8" /> Gestión de Tenants (SaaS)
      </h1>

      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Negocio</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Trial Ends</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center">Cargando...</td></tr>
            ) : tenants.map((t: any) => (
              <tr key={t.id}>
                <td>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs opacity-50">{t.legalName || 'Sin razón social'}</div>
                </td>
                <td>{t.email}</td>
                <td>
                  <div className={`badge ${
                    t.subscriptionStatus === 'ACTIVE' ? 'badge-success' : 
                    t.subscriptionStatus === 'SUSPENDED' ? 'badge-error' : 'badge-warning'
                  }`}>
                    {t.subscriptionStatus}
                  </div>
                </td>
                <td>{t.trialEndsAt ? new Date(t.trialEndsAt).toLocaleDateString() : '-'}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-ghost" title="Ver detalles"><Eye className="w-4 h-4"/></button>
                  {t.subscriptionStatus !== 'ACTIVE' && (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleUpdateStatus(t.id, 'ACTIVE')}
                    >
                      Activar
                    </button>
                  )}
                  {t.subscriptionStatus !== 'SUSPENDED' && (
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        const reason = prompt('Motivo de suspensión:');
                        if (reason) handleUpdateStatus(t.id, 'SUSPENDED', reason);
                      }}
                    >
                      Suspender
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
