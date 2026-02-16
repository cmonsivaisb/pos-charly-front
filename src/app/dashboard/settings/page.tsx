'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Building2, MapPin, Phone, Mail, DollarSign, Percent, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    legalName: '',
    rfc: '',
    address: '',
    phone: '',
    email: '',
    currency: 'MXN',
    defaultIvaRate: 0.16,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/tenancy/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/tenancy/settings', settings);
      alert('Configuración guardada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8"><span className="loading loading-ring loading-lg"></span></div>;

  return (
    <div className="p-8 bg-base-200 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold tracking-tighter uppercase text-base-content">
            Configuración de <span className="text-primary">Negocio</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-primary" /> Datos generales y facturación del Tenant
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Info */}
          <div className="bg-base-100 p-8 shadow-retail border-2 border-base-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Building2 className="w-24 h-24" />
            </div>
            
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
               Información Comercial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Nombre Comercial</label>
                <input 
                  type="text" 
                  className="input input-bordered font-bold" 
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Email de Contacto</label>
                <input 
                  type="email" 
                  className="input input-bordered font-bold" 
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Teléfono</label>
                <input 
                  type="text" 
                  className="input input-bordered font-bold" 
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Dirección Física</label>
                <input 
                  type="text" 
                  className="input input-bordered font-bold" 
                  value={settings.address || ''}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Legal Info */}
          <div className="bg-base-100 p-8 shadow-retail border-2 border-base-300">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Datos Fiscales (Ticket)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Razón Social</label>
                <input 
                  type="text" 
                  className="input input-bordered font-bold" 
                  value={settings.legalName || ''}
                  onChange={(e) => setSettings({...settings, legalName: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">RFC / TAX ID</label>
                <input 
                  type="text" 
                  className="input input-bordered font-bold" 
                  value={settings.rfc || ''}
                  onChange={(e) => setSettings({...settings, rfc: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-base-100 p-8 shadow-retail border-2 border-base-300">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Preferencias del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Moneda</label>
                <select 
                  className="select select-bordered font-bold"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label uppercase text-[10px] font-bold text-slate-500">Tasa IVA Default</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    className="input input-bordered w-full font-bold" 
                    value={settings.defaultIvaRate}
                    onChange={(e) => setSettings({...settings, defaultIvaRate: parseFloat(e.target.value)})}
                  />
                  <Percent className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`btn btn-primary btn-lg px-12 shadow-retail font-display ${saving ? 'loading' : ''}`}
              disabled={saving}
            >
              {!saving && <Save className="w-5 h-5 mr-2" />}
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
