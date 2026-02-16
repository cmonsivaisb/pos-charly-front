'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post('/auth/register', data);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-700 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[500px] z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded shadow-retail mb-4 rotate-[-3deg]">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter uppercase">
            Únete a Retail<span className="text-primary">POS</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Crea tu terminal comercial hoy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-2xl border-t-8 border-primary overflow-hidden">
          <div className="p-10">
             <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Registro de Empresa
              </h2>
              <ThemeToggle />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase text-slate-500 tracking-widest">Nombre del Negocio / Dueño</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('name')}
                    className="input w-full pl-12 h-14 bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white uppercase"
                    placeholder="TIENDA EJEMPLO S.A."
                  />
                </div>
                {errors.name && <span className="text-error text-[10px] font-bold uppercase mt-1">{errors.name.message}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase text-slate-500 tracking-widest">Correo Corporativo</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="input w-full pl-12 h-14 bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                    placeholder="contacto@negocio.com"
                  />
                </div>
                {errors.email && <span className="text-error text-[10px] font-bold uppercase mt-1">{errors.email.message}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase text-slate-500 tracking-widest">Contraseña de Acceso</span>
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

              <div className="pt-2">
                <button
                  type="submit"
                  className={`btn btn-primary btn-block h-16 shadow-retail font-display font-bold text-sm tracking-widest uppercase group ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  REGISTRAR MI NEGOCIO
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ¿Ya tienes una cuenta? <a href="/login" className="text-primary hover:underline">Iniciar Sesión</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
