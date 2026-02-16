'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Plus, Search, Minus, PlusCircle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    (window as any).product_modal.showModal();
  };

  const handleAdd = () => {
    setEditingProduct(null);
    (window as any).product_modal.showModal();
  };

  const adjustStock = async (id: string, amount: number) => {
    try {
      const product = products.find((p: any) => p.id === id) as any;
      if (!product) return;
      
      const newStock = Math.max(0, product.stock + amount);
      
      // Enviar actualización parcial
      await api.patch(`/products/${id}`, { 
        stock: newStock,
        // Re-enviar campos requeridos por el DTO para evitar validación fallida
        name: product.name,
        costPrice: Number(product.costPrice),
        priceInputMode: product.priceInputMode,
        inputValue: product.priceInputMode === 'INCLUDES_TAX' ? Number(product.priceTotal) : Number(product.priceBase)
      });
      
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error al ajustar el stock');
    }
  };

  return (
    <div className="p-6 bg-base-300 min-h-[calc(100vh-64px)] lg:min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" /> Productos
        </h1>
        <button className="btn btn-primary" onClick={handleAdd}>
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
                  <th>Imagen</th>
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
                  <tr><td colSpan={7} className="text-center py-4">Cargando...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4">No hay productos registrados</td></tr>
                ) : (
                  products.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-200">
                            <img 
                              src={p.imagePath ? `http://localhost:3001/${p.imagePath.replace(/\\/g, '/')}` : 'https://placehold.co/100x100?text=No+Foto'} 
                              alt={p.name} 
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error+Img';
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs opacity-50">{p.brand} {p.model}</div>
                      </td>
                      <td>{p.sku || '-'}</td>
                      <td>${p.costPrice}</td>
                      <td>${p.priceTotal}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button 
                            className="btn btn-xs btn-circle btn-outline btn-error"
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <div className={`badge font-bold w-12 ${p.stock <= p.minStock ? 'badge-error' : 'badge-success'}`}>
                            {p.stock}
                          </div>

                          <button 
                            className="btn btn-xs btn-circle btn-outline btn-success"
                            onClick={() => adjustStock(p.id, 1)}
                          >
                            <PlusCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost text-primary" onClick={() => handleEdit(p)}>Editar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="product_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
          <ProductForm
            product={editingProduct}
            onSuccess={() => {
              (window as any).product_modal.close();
              fetchProducts();
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

function ProductForm({ onSuccess, product }: { onSuccess: () => void, product?: any }) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(product?.priceInputMode || 'INCLUDES_TAX');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setMode(product.priceInputMode);
    } else {
      setMode('INCLUDES_TAX');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      barcode: formData.get('barcode'),
      description: formData.get('description'),
      brand: formData.get('brand'),
      model: formData.get('model'),
      packaging: formData.get('packaging'),
      supplierName: formData.get('supplierName'),
      warehouseLocation: formData.get('warehouseLocation'),
      costPrice: Number(formData.get('costPrice')),
      priceInputMode: mode,
      inputValue: Number(formData.get('inputValue')),
      ivaRate: 0.16,
      stock: Number(formData.get('stock')),
      trackStock: formData.get('trackStock') === 'on',
    };

    try {
      let productId = product?.id;
      if (product) {
        await api.patch(`/products/${product.id}`, data);
      } else {
        const res = await api.post('/products', data);
        productId = res.data.id;
      }
      
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        await api.post(`/products/${productId}/image`, imageFormData);
      }

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
          <label className="label"><span className="label-text font-bold">Información Básica</span></label>
          <input name="name" type="text" placeholder="Nombre del Producto" className="input input-bordered" defaultValue={product?.name} required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">SKU</span></label>
          <input name="sku" type="text" className="input input-bordered" defaultValue={product?.sku} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Código de Barras</span></label>
          <input name="barcode" type="text" className="input input-bordered" defaultValue={product?.barcode} />
        </div>
        
        <div className="form-control col-span-2">
          <label className="label"><span className="label-text">Descripción</span></label>
          <textarea name="description" className="textarea textarea-bordered" rows={2} defaultValue={product?.description}></textarea>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Marca</span></label>
          <input name="brand" type="text" className="input input-bordered" defaultValue={product?.brand} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Modelo</span></label>
          <input name="model" type="text" className="input input-bordered" defaultValue={product?.model} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Empaque (ej. Caja 12p)</span></label>
          <input name="packaging" type="text" className="input input-bordered" defaultValue={product?.packaging} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Ubicación Almacén</span></label>
          <input name="warehouseLocation" type="text" className="input input-bordered" defaultValue={product?.warehouseLocation} />
        </div>

        <div className="form-control col-span-2">
          <label className="label"><span className="label-text font-bold text-primary">Precios e Impuestos</span></label>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Costo (Compra)</span></label>
          <input name="costPrice" type="number" step="0.01" className="input input-bordered" defaultValue={product?.costPrice} required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Modo de Precio</span></label>
          <select className="select select-bordered" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="INCLUDES_TAX">Precio incluye IVA</option>
            <option value="EXCLUDES_TAX">Precio más IVA</option>
          </select>
        </div>
        <div className="form-control col-span-2">
          <label className="label"><span className="label-text font-bold">Precio de Venta</span></label>
          <input name="inputValue" type="number" step="0.01" className="input input-bordered" defaultValue={product?.priceInputMode === 'INCLUDES_TAX' ? product?.priceTotal : product?.priceBase} required />
          <p className="text-xs mt-1 opacity-70 italic">
            "En México, normalmente los precios ya incluyen IVA."
          </p>
        </div>

        <div className="form-control col-span-2">
          <label className="label"><span className="label-text font-bold text-secondary">Inventario</span></label>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-bold">Stock Actual</span></label>
          <input name="stock" type="number" className="input input-bordered border-secondary" defaultValue={product?.stock || 0} required />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text font-bold">Controlar Inventario</span>
            <input name="trackStock" type="checkbox" className="checkbox checkbox-secondary" defaultChecked={product ? product.trackStock : true} />
          </label>
        </div>

        <div className="form-control col-span-2">
          <label className="label"><span className="label-text font-bold">Imagen del Producto</span></label>
          <input type="file" className="file-input file-input-bordered w-full" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div className="modal-action">
        <button type="submit" className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Guardar Producto')}
        </button>
      </div>
    </form>
  );
}
