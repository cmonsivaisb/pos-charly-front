'use client';

import {
  BarChart3,
  Box,
  CreditCard,
  Globe2,
  Lock,
  Smartphone,
  Zap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Inventario en Tiempo Real',
    description: 'Control total de stock, alertas de bajo inventario y gestión de proveedores desde un solo lugar.'
  },
  {
    icon: Zap,
    title: 'Punto de Venta Rápido',
    description: 'Interfaz optimizada para velocidad. Procesa ventas en segundos, con o sin conexión a internet.'
  },
  {
    icon: BarChart3,
    title: 'Analíticas Avanzadas',
    description: 'Toma decisiones basadas en datos. Reportes de ventas, productos más vendidos y rendimiento.'
  },
  {
    icon: Globe2,
    title: 'Acceso en la Nube',
    description: 'Tu negocio va contigo. Accede a tu dashboard desde cualquier dispositivo y lugar del mundo.'
  },
  {
    icon: Users,
    title: 'Multi-Usuario y Roles',
    description: 'Gestiona permisos para cajeros, gerentes y administradores con control de acceso granular.'
  },
  {
    icon: Lock,
    title: 'Seguridad Empresarial',
    description: 'Tus datos están seguros con encriptación de grado bancario y copias de seguridad automáticas.'
  }
];

interface FeaturesProps {
  id?: string;
}

export function Features({ id }: FeaturesProps) {
  return (
    <div id={id} className="py-24 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Características Principales</h2>
          <h3 className="text-4xl font-display font-bold text-base-content mb-6">Todo lo que necesitas para crecer</h3>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Hemos diseñado cada herramienta pensando en la eficiencia operativa de tu negocio.
            Sin complicaciones, solo resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-base-200 rounded-xl shadow-retail flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-display font-bold text-base-content mb-3">{feature.title}</h4>
              <p className="text-base-content/70 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
