'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/sales/stats');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: 'Ventas de Hoy', value: `$${data?.todaySales || '0.00'}`, icon: TrendingUp, color: 'text-success' },
    { name: 'Productos', value: data?.productCount || '0', icon: Package, color: 'text-info' },
    { name: 'Clientes', value: data?.customerCount || '0', icon: Users, color: 'text-warning' },
    { name: 'Suscripción', value: 'Activa', icon: CheckCircle2, color: 'text-primary' },
  ];

  return (
    <div className="p-6 bg-base-300 min-h-[calc(100vh-64px)] lg:min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bienvenido, {user?.email}</h1>
        <p className="opacity-70">Aquí tienes un resumen de tu negocio hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-70 font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-base-200 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 opacity-50" /> Ventas Recientes
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentSales?.length > 0 ? (
                    data.recentSales.map((sale: any) => (
                      <tr key={sale.folio}>
                        <td className="font-bold">#{sale.folio}</td>
                        <td className="font-bold text-primary">${sale.total}</td>
                        <td>
                          <div className="badge badge-success badge-sm text-[10px]">
                            {sale.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 opacity-50 italic">No hay ventas registradas hoy</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/dashboard/pos" className="btn btn-primary h-auto py-6 flex-col gap-2">
                <ShoppingCart className="w-6 h-6" />
                Nueva Venta
              </a>
              <a href="/dashboard/products" className="btn btn-outline h-auto py-6 flex-col gap-2">
                <Package className="w-6 h-6" />
                Gestión Inventario
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
