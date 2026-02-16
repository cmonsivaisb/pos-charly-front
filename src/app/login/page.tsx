'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, Lock, User, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = res.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-700 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[450px] z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded shadow-retail mb-6 rotate-3">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter uppercase">
            Retail<span className="text-primary">POS</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Sistema de Terminal de Punto de Venta</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 shadow-2xl border-b-8 border-primary overflow-hidden">
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight text-slate-900 dark:text-white">Acceso al Sistema</h2>
              <ThemeToggle />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase text-slate-500 tracking-widest">Correo Electrónico</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="input w-full pl-12 h-14 bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                    placeholder="admin@empresa.com"
                  />
                </div>
                {errors.email && <span className="text-error text-[10px] font-bold uppercase mt-1">{errors.email.message}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase text-slate-500 tracking-widest">Contraseña</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('password')}
                    type="password"
                    className="input w-full pl-12 h-14 bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="text-error text-[10px] font-bold uppercase mt-1">{errors.password.message}</span>}
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-block h-16 shadow-retail font-display font-bold text-sm tracking-widest uppercase group ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                INGRESAR AL SISTEMA
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ¿No tienes cuenta? <a href="/register" className="text-primary hover:underline">Solicitar Acceso</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center opacity-40">
          <p className="text-[9px] font-bold text-white uppercase tracking-widest">Retail Terminal v2.0.4 • 2026 POS SaaS Corp.</p>
        </div>
      </div>
    </div>
  );
}
