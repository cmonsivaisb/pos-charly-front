
'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'ESTÁNDAR',
    price: '$49',
    period: '/mes',
    description: 'Todo lo que necesitas para tu negocio.',
    features: [
      'Productos Ilimitados',
      'Usuarios Ilimitados',
      'Analíticas Avanzadas',
      'Control de Inventario',
      'Soporte Prioritario',
      'Facturación Electrónica',
      'Múltiples Sucursales'
    ],
    cta: 'Comenzar Ahora',
    href: '/register',
    highlight: true
  }
];

interface PricingProps {
  id?: string;
}

export function Pricing({ id }: PricingProps) {
  return (
    <div id={id} className="py-24 bg-base-200 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Planes Flexibles</h2>
          <h3 className="text-4xl font-display font-bold text-base-content mb-6">Inversión inteligente para tu éxito</h3>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Elige el plan que mejor se adapte a tu etapa actual.
            Sin contratos forzosos, cancela cuando quieras.
          </p>
        </div>

        <div className="flex justify-center max-w-6xl mx-auto items-start">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className="relative bg-base-100 dark:bg-slate-950 rounded-2xl p-8 border-2 border-primary shadow-2xl z-10 max-w-md w-full"
            >
              
              <h4 className="text-lg font-bold text-base-content/60 uppercase tracking-widest mb-2">{plan.name}</h4>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-extrabold tracking-tight text-base-content">{plan.price}</span>
                {plan.period && <span className="text-xl text-base-content/60 ml-2 font-medium">{plan.period}</span>}
              </div>
              <p className="text-base-content/70 text-sm mb-8 pb-8 border-b border-base-300 dark:border-slate-800">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.href} 
                className={`btn w-full h-14 uppercase tracking-widest text-xs font-bold shadow-retail ${ 
                  plan.highlight 
                    ? "btn-primary" 
                    : "bg-base-200 dark:bg-slate-800 text-base-content hover:bg-base-300"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}