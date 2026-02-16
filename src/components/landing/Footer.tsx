 'use client';

import { Store, Twitter, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-base-200 dark:bg-slate-900 text-base-content pt-24 pb-12 border-t border-base-300 dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded shadow-retail">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">RETAIL<span className="text-primary">POS</span></span>
            </div>
            <p className="text-base-content/70 text-sm leading-relaxed mb-6">
              La plataforma integral para la gestión de puntos de venta modernos. 
              Simplifica, vende y escala.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-base-content/60">Producto</h4>
            <ul className="space-y-4 text-sm font-medium text-base-content/80">
              <li><Link href="#" className="hover:text-primary transition-colors">Características</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Precios</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-base-300 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-base-content/60 font-medium">
          <p>© 2026 RetailPOS SaaS Inc. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-base-content transition-colors">Términos de Servicio</Link>
            <Link href="#" className="hover:text-base-content transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}