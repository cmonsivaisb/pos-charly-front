import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Store } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white bg-base-100 text-base-content">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 border-b border-base-content/10 bg-base-100/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded shadow-retail group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-base-content tracking-tight">RETAIL<span className="text-primary">POS</span></span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-base-content/70 uppercase tracking-widest">
              <a href="#features" className="hover:text-base-content transition-colors">Producto</a>
              <a href="#pricing" className="hover:text-base-content transition-colors">Precios</a>
            </div>
            <div className="w-px h-6 bg-base-content/20 hidden md:block"></div>
            <Link href="/login" className="hidden md:flex btn btn-sm btn-ghost text-base-content hover:bg-base-content/10 uppercase font-bold tracking-widest">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn-sm btn-primary text-white shadow-retail shadow-black/20 uppercase font-bold tracking-widest">
              Comenzar
            </Link>
          </div>
          {/* Moved ThemeToggle outside the group of other links/buttons */}
          <div className="ml-4 relative z-10"><ThemeToggle /></div> 
        </div>
      </nav>

      <main>
        <Hero />
        <Features id="features" />
        <Pricing id="pricing" />
      </main>

      <Footer />
    </div>
  );
}