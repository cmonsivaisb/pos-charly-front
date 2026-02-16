'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z.object({
  businessName: z.string().min(3, 'El nombre del negocio debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  adminName: z.string().min(3, 'El nombre del administrador debe tener al menos 3 caracteres'),
  rfc: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4">Registro de Negocio</h2>
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre del Negocio</span>
              </label>
              <input
                type="text"
                placeholder="Mi Tienda S.A."
                className={`input input-bordered ${errors.businessName ? 'input-error' : ''}`}
                {...register('businessName')}
              />
              {errors.businessName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.businessName.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">RFC (Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="XXXX000000XXX"
                className="input input-bordered"
                {...register('rfc')}
              />
            </div>
            <div className="divider">Admin Info</div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre del Admin</span>
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                className={`input input-bordered ${errors.adminName ? 'input-error' : ''}`}
                {...register('adminName')}
              />
              {errors.adminName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.adminName.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="admin@ejemplo.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="******"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>¿Ya tienes cuenta? <a href="/login" className="link link-primary">Inicia sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
