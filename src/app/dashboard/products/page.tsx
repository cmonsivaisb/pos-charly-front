'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Plus, Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" /> Productos
        </h1>
        <button className="btn btn-primary" onClick={() => (window as any).add_product_modal.showModal()}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input type="text" placeholder="Buscar por nombre, SKU o código de barras..." className="input input-bordered w-full pl-10" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Costo</th>
                  <th>Precio (con IVA)</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Cargando...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No hay productos registrados</td></tr>
                ) : (
                  products.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.sku || '-'}</td>
                      <td>${p.costPrice}</td>
                      <td>${p.priceTotal}</td>
                      <td>
                        <div className={`badge ${p.stock <= p.minStock ? 'badge-error' : 'badge-success'}`}>
                          {p.stock}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost">Editar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="add_product_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Agregar Nuevo Producto</h3>
          <ProductForm onSuccess={() => {
            (window as any).add_product_modal.close();
            fetchProducts();
          }} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('INCLUDES_TAX');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      barcode: formData.get('barcode'),
      costPrice: Number(formData.get('costPrice')),
      priceInputMode: mode,
      inputValue: Number(formData.get('inputValue')),
      ivaRate: 0.16,
    };

    try {
      await api.post('/products', data);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control col-span-2">
          <label className="label"><span className="label-text">Nombre del Producto *</span></label>
          <input name="name" type="text" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">SKU</span></label>
          <input name="sku" type="text" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Código de Barras</span></label>
          <input name="barcode" type="text" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Costo (Precio de Compra)</span></label>
          <input name="costPrice" type="number" step="0.01" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Modo de Precio</span></label>
          <select className="select select-bordered" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="INCLUDES_TAX">Precio con IVA incluido</option>
            <option value="EXCLUDES_TAX">Precio más IVA</option>
          </select>
        </div>
        <div className="form-control col-span-2">
          <label className="label"><span className="label-text">Precio de Venta</span></label>
          <input name="inputValue" type="number" step="0.01" className="input input-bordered" required />
          <p className="text-xs mt-1 opacity-70">
            En México, normalmente los precios que vemos ya incluyen IVA. Si no estás seguro, captura el precio con IVA incluido y el sistema lo calculará automáticamente.
          </p>
        </div>
      </div>
      <div className="modal-action">
        <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
          Guardar Producto
        </button>
      </div>
    </form>
  );
}
