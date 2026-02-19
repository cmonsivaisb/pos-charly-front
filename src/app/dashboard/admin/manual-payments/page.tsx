'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ManualPaymentsAdminPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/payments/admin/manual-requests?status=SUBMITTED');
      setRequests(res.data);
    } catch (error) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.patch(`/payments/admin/manual-requests/${selectedRequest.id}/approve`, { comment });
      toast.success('Pago aprobado y suscripción activada');
      setSelectedRequest(null);
      setComment('');
      fetchRequests();
    } catch (error) {
      toast.error('Error al aprobar pago');
    }
  };

  const handleReject = async () => {
    if (!comment) return toast.error('El comentario es obligatorio para rechazar');
    try {
      await api.patch(`/payments/admin/manual-requests/${selectedRequest.id}/reject`, { comment });
      toast.success('Pago rechazado');
      setSelectedRequest(null);
      setComment('');
      fetchRequests();
    } catch (error) {
      toast.error('Error al rechazar pago');
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Administración de Pagos Manuales</h1>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Monto</th>
              <th>Banco</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req: any) => (
              <tr key={req.id}>
                <td>
                  <div className="font-bold">{req.tenant?.name}</div>
                  <div className="text-sm opacity-50">{req.tenant?.email}</div>
                </td>
                <td>${req.amount}</td>
                <td>{req.bankName}</td>
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedRequest(req)}
                  >
                    Revisar
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 opacity-50">No hay solicitudes pendientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Revisión */}
      {selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Revisar Pago - {selectedRequest.tenant?.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p><strong>Monto:</strong> ${selectedRequest.amount}</p>
                <p><strong>Referencia:</strong> {selectedRequest.reference || 'N/A'}</p>
                <p><strong>Banco:</strong> {selectedRequest.bankName}</p>
              </div>
              <div className="border rounded p-2 bg-gray-50 flex items-center justify-center min-h-[200px]">
                {selectedRequest.evidencePath ? (
                  selectedRequest.evidencePath.endsWith('.pdf') ? (
                    <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${selectedRequest.evidencePath}`} target="_blank" className="btn btn-link">Ver PDF</a>
                  ) : (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${selectedRequest.evidencePath}`} 
                      alt="Comprobante" 
                      className="max-h-64 object-contain"
                    />
                  )
                ) : (
                  <span className="text-error">Sin comprobante</span>
                )}
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">Comentario (obligatorio si rechaza)</label>
              <textarea 
                className="textarea textarea-bordered h-24"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setSelectedRequest(null)}>Cancelar</button>
              <button className="btn btn-error" onClick={handleReject}>Rechazar</button>
              <button className="btn btn-success" onClick={handleApprove}>Aprobar y Activar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
