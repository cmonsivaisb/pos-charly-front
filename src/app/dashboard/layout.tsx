'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  LogOut,
  Menu,
  Users,
  Receipt,
  Store
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login');
    }
  }, [user, router, isHydrated]);

  if (!isHydrated || !user) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'POS Terminal', icon: ShoppingCart, href: '/dashboard/pos' },
    { name: 'Ventas', icon: Receipt, href: '/dashboard/sales' },
    { name: 'Productos', icon: Package, href: '/dashboard/products' },
    { name: 'Suscripción', icon: CreditCard, href: '/dashboard/subscription' },
  ];

  if (user?.role === 'PLATFORM_ADMIN') {
    menuItems.push({ name: 'Admin Tenants', icon: Users, href: '/dashboard/admin/tenants' });
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100 h-screen overflow-hidden">
        {/* Navbar for Mobile */}
        <div className="navbar bg-base-200 border-b lg:hidden px-4 shrink-0">
          <div className="flex-none">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2">
            <span className="font-display font-bold text-xl tracking-tight uppercase">Retail<span className="text-primary">POS</span></span>
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-0 w-72 min-h-full bg-slate-900 text-slate-100 dark:bg-slate-950 flex flex-col border-r border-slate-800">
          
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white shadow-retail shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display font-bold text-lg leading-none tracking-tight uppercase truncate">Retail<span className="text-primary">POS</span></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">Terminal System</span>
                </div>
              </div>
              <div className="hidden lg:block shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Menu Principal</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-retail' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className="font-bold text-sm tracking-wide uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800 mt-auto">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="avatar placeholder shrink-0">
                <div className="bg-slate-800 text-slate-300 rounded-lg w-10 h-10 flex items-center justify-center border border-slate-700">
                  <span className="text-xs font-bold uppercase">{user.email.substring(0, 2)}</span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-white truncate" title={user.email}>{user.email}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-red-600/90 text-white transition-all duration-200 font-bold text-[10px] uppercase tracking-widest border border-slate-700 hover:border-red-500 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
