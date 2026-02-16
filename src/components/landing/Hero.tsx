
'use client';

import { ArrowRight, CheckCircle2, Store } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-base-100 pt-16 pb-32">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-base-content tracking-tighter leading-[1.1] mb-6">
              Gestión Inteligente para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Punto de Venta</span>
            </h1>
            
            <p className="text-lg opacity-70 text-base-content mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Controla inventario, ventas y facturación desde cualquier lugar. La solución SaaS definitiva para comercios modernos que buscan escalar sin complicaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register" className="btn btn-primary h-14 px-8 text-sm font-bold tracking-widest uppercase shadow-retail hover:scale-105 transition-transform group">
                Comenzar Prueba Gratis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn btn-outline h-14 px-8 text-base-content border-current/20 hover:bg-base-content/10 text-sm font-bold tracking-widest uppercase">
                Ver Demo en Vivo
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 opacity-60 text-base-content text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Sin Tarjeta de Crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Setup en 2 minutos
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 aspect-[16/10] group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              {/* Abstract UI Representation */}
              <div className="p-6 h-full flex flex-col">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex gap-4">
                  <div className="w-1/4 bg-slate-800 rounded-lg animate-pulse"></div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 rounded-lg"></div>
                      <div className="bg-slate-800 rounded-lg"></div>
                      <div className="bg-slate-800 rounded-lg"></div>
                      <div className="bg-slate-800 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}