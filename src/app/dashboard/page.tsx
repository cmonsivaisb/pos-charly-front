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
  CheckCircle2,
  ArrowUpRight,
  MoreVertical,
  Activity,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

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

  if (loading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    { name: 'Ventas de Hoy', value: `$${Number(data?.todaySales || 0).toFixed(2)}`, icon: TrendingUp, color: 'primary' },
    { name: 'Stock Total', value: data?.productCount || '0', icon: Package, color: 'slate-500' },
    { name: 'Clientes', value: data?.customerCount || '0', icon: Users, color: 'slate-500' },
    { name: 'Estado Sistema', value: 'Activo', icon: CheckCircle2, color: 'success' },
  ];

  return (
    <div className="p-8 bg-base-200 min-h-[calc(100vh-64px)]">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tighter uppercase text-base-content">
            Panel de <span className="text-primary">Control</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" /> Monitoreo en tiempo real para {user?.email}
          </p>
        </div>
        <Link href="/dashboard/pos" className="btn btn-primary h-14 px-8 shadow-retail font-display group">
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          INICIAR TERMINAL POS
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className={`bg-base-100 p-6 border-b-4 ${stat.color === 'primary' ? 'border-primary' : stat.color === 'success' ? 'border-success' : 'border-slate-800 dark:border-slate-700'} shadow-retail flex flex-col relative overflow-hidden group hover:translate-y-[-4px] transition-all`}>
            <div className="flex justify-between items-start z-10">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 truncate">{stat.name}</p>
                <p className="text-3xl font-display font-bold text-base-content truncate">{stat.value}</p>
              </div>
              <div className={`p-3 rounded bg-base-200 border border-base-300 flex-shrink-0 ml-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color === 'primary' ? 'text-primary' : stat.color === 'success' ? 'text-success' : 'text-slate-500'}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-success z-10">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.5% desde ayer</span>
            </div>
            {/* Background Graphic Element */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <stat.icon className="w-24 h-24 text-base-content" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-base-100 shadow-2xl border-2 border-base-300 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-100">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight flex items-center gap-2 text-base-content">
              <Clock className="w-5 h-5 text-primary" /> Ventas Recientes
            </h2>
            <button className="btn btn-ghost btn-sm btn-square text-base-content"><MoreVertical className="w-4 h-4" /></button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4">Folio</th>
                  <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4">Hora</th>
                  <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-right">Monto Total</th>
                  <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {data?.recentSales?.length > 0 ? (
                  data.recentSales.map((sale: any) => (
                    <tr key={sale.folio} className="hover:bg-base-200/30 transition-colors group">
                      <td className="font-display font-bold text-primary py-5">#{sale.folio}</td>
                      <td className="text-xs font-bold text-slate-500 uppercase">Hace 2 horas</td>
                      <td className="text-right font-display font-bold text-lg text-base-content">${Number(sale.total).toFixed(2)}</td>
                      <td className="text-center">
                        <div className="badge bg-success/10 text-success border-none font-bold uppercase text-[9px] px-3 tracking-widest">
                          {sale.status}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-20 opacity-30 italic font-bold uppercase tracking-widest text-base-content">No hay actividad registrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-base-300 text-center">
            <Link href="/dashboard/sales" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Ver Historial Completo</Link>
          </div>
        </div>

        {/* Quick Actions & Maintenance */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 p-8 shadow-retail border-b-4 border-primary">
            <h3 className="text-white font-display font-bold text-xl uppercase tracking-tighter mb-6">Accesos Rápidos</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/products" className="btn bg-slate-800 hover:bg-slate-700 text-white border-none h-16 justify-start px-6 gap-4 group">
                <div className="p-2 rounded bg-slate-700 group-hover:bg-primary transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Inventario</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Gestión de stock</span>
                </div>
              </Link>
              <Link href="/dashboard/subscription" className="btn bg-slate-800 hover:bg-slate-700 text-white border-none h-16 justify-start px-6 gap-4 group">
                <div className="p-2 rounded bg-slate-700 group-hover:bg-primary transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Mi Suscripción</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Plan Pro Activo</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-base-100 p-8 border-2 border-base-300 shadow-retail">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Integridad del Sistema</h4>
            <div className="space-y-4">
              {[
                { label: 'Servidor API', status: 'Online' },
                { label: 'Base de Datos', status: 'Online' },
                { label: 'Pasarela Pagos', status: 'Online' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-base-content/80">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-bold text-success uppercase">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
