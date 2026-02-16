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
  ChevronRight,
  Users,
  Receipt
} from 'lucide-react';
import Link from 'next/link';

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
    { name: 'POS', icon: ShoppingCart, href: '/dashboard/pos' },
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
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <Menu />
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">POS SaaS</a>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-64 min-h-full bg-base-100 text-base-content border-r">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold">
              PS
            </div>
            <span className="text-xl font-bold tracking-tight">POS SaaS</span>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href 
                      ? 'bg-primary text-primary-content' 
                      : 'hover:bg-base-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t">
            <div className="px-4 py-3 mb-2">
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider">Usuario</p>
              <p className="font-medium truncate">{user.email}</p>
              <p className="text-xs opacity-50">{user.role}</p>
            </div>
            <button 
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-error hover:bg-error/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
