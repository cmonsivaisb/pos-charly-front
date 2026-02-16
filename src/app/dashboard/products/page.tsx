'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Plus, Search, Minus, PlusCircle, Filter, MoreHorizontal, Edit2, PackageSearch, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState('');

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
    // Asegurarse de que el stock sea un número
    setEditingProduct({
      ...product,
      stock: Number(product.stock)
    });
    (window as any).product_modal.showModal();
  };

  const handleAdd = () => {
    setEditingProduct(null);
    (window as any).product_modal.showModal();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;
    
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el producto');
    }
  };

  const adjustStock = async (id: string, amount: number) => {
    try {
      const product = products.find((p: any) => p.id === id) as any;
      if (!product) return;
      
      const newStock = Math.max(0, product.stock + amount);
      
      await api.patch(`/products/${id}`, { 
        stock: newStock,
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

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
    (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-base-200 min-h-[calc(100vh-64px)]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight uppercase flex items-center gap-3">
            <div className="bg-primary p-2 rounded shadow-retail">
              <Package className="w-8 h-8 text-white" />
            </div>
            Inventario <span className="text-primary">Global</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Gestión de catálogo y existencias</p>
        </div>
        <button className="btn btn-primary h-14 px-8 shadow-retail font-display group" onClick={handleAdd}>
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          NUEVO PRODUCTO
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 border-b-4 border-primary shadow-retail">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Productos</p>
          <p className="text-2xl font-display font-bold text-primary">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 border-b-4 border-error shadow-retail">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Bajo Stock</p>
          <p className="text-2xl font-display font-bold text-error">{products.filter((p:any) => p.stock <= p.minStock).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 border-b-4 border-slate-700 shadow-retail text-slate-900 dark:text-white">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Valor Inventario</p>
          <p className="text-2xl font-display font-bold">
            ${products.reduce((acc, p:any) => acc + (p.costPrice * p.stock), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 border-b-4 border-slate-700 shadow-retail text-slate-900 dark:text-white">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Categorías</p>
          <p className="text-2xl font-display font-bold">8</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-base-100 shadow-2xl border-2 border-base-300">
        <div className="p-6 border-b border-base-300 flex flex-col md:flex-row gap-4 justify-between items-center bg-base-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="BUSCAR PRODUCTO..." 
              className="input w-full pl-12 h-12 bg-base-200 border-none font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-primary" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost border-base-300 bg-base-200 uppercase text-[10px] font-bold tracking-widest"><Filter className="w-4 h-4 mr-2" /> Filtros</button>
            <button className="btn btn-ghost border-base-300 bg-base-200 uppercase text-[10px] font-bold tracking-widest">Exportar CSV</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50 border-b-2 border-base-300">
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4">Producto</th>
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4">SKU / Código</th>
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-right">Costo</th>
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-right">Precio Venta</th>
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-center">Stock Actual</th>
                <th className="uppercase text-[10px] font-bold tracking-widest text-slate-500 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20"><span className="loading loading-spinner text-primary"></span></td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 opacity-40">
                    <PackageSearch className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-bold uppercase tracking-widest">Catálogo Vacío</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-base-200/30 transition-colors group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-base-200 border border-base-300 relative overflow-hidden flex-shrink-0">
                          <img 
                            src={p.imagePath ? `http://localhost:3001/${p.imagePath.replace(/\\/g, '/')}` : 'https://placehold.co/200x200?text=No+Img'} 
                            alt={p.name} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Error';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm uppercase group-hover:text-primary transition-colors">{p.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{p.brand || 'Genérico'} • {p.model || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-mono">{p.sku || '---'}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{p.barcode || 'Sin código'}</span>
                      </div>
                    </td>
                    <td className="text-right font-display font-bold text-slate-500">
                      ${typeof p.costPrice === 'number' ? p.costPrice.toFixed(2) : Number(p.costPrice || 0).toFixed(2)}
                    </td>
                    <td className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-display font-bold text-lg text-primary">
                          ${typeof p.priceTotal === 'number' ? p.priceTotal.toFixed(2) : Number(p.priceTotal || 0).toFixed(2)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">IVA Incluido</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 min-w-[140px] justify-center">
                          <button 
                            className="w-8 h-8 rounded-lg bg-base-300 hover:bg-error hover:text-white flex items-center justify-center transition-colors disabled:opacity-30 shadow-sm"
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <div className={`text-xl font-display font-bold min-w-[4rem] text-center !opacity-100 !visible ${p.stock <= (p.minStock || 0) ? 'text-error animate-pulse' : 'text-slate-900 dark:text-white'}`} style={{ color: p.stock <= (p.minStock || 0) ? undefined : 'inherit' }}>
                            {p.stock.toLocaleString()}
                          </div>

                          <button 
                            className="w-8 h-8 rounded-lg bg-base-300 hover:bg-success hover:text-white flex items-center justify-center transition-colors shadow-sm"
                            onClick={() => adjustStock(p.id, 1)}
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Uni. Disponibles</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2 transition-opacity">
                        <button className="btn btn-square btn-sm bg-base-200 border-base-300 hover:text-primary hover:bg-base-300" onClick={() => handleEdit(p)} title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="btn btn-square btn-sm bg-base-200 border-base-300 hover:text-error hover:bg-base-300" onClick={() => handleDelete(p.id, p.name)} title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="product_modal" className="modal modal-bottom sm:modal-middle overflow-y-auto">
        <div className="modal-box max-w-2xl bg-base-100 p-0 border-2 border-primary my-8">
          <div className="bg-primary p-6 flex justify-between items-center text-white sticky top-0 z-10">
            <h3 className="font-display font-bold text-xl uppercase tracking-tighter">
              {editingProduct ? 'Modificar Registro' : 'Alta de Producto'}
            </h3>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Retail Terminal v2.0</div>
          </div>
          <div className="p-8">
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                (window as any).product_modal.close();
                fetchProducts();
              }}
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-slate-900/80 backdrop-blur-sm">
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

  const [stockValue, setStockValue] = useState(product?.stock ?? 0);

  useEffect(() => {
    if (product) {
      setStockValue(product.stock ?? 0);
    } else {
      setStockValue(0);
    }
  }, [product]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Info Section */}
        <div className="col-span-2">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Información del Producto</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control col-span-2">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Nombre Oficial</span></label>
              <input name="name" type="text" className="input input-bordered h-12 bg-base-200 border-none font-bold text-sm uppercase tracking-wide" defaultValue={product?.name} required />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">SKU (Interno)</span></label>
              <input name="sku" type="text" className="input input-bordered h-12 bg-base-200 border-none font-bold text-sm" defaultValue={product?.sku} />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Código de Barras</span></label>
              <input name="barcode" type="text" className="input input-bordered h-12 bg-base-200 border-none font-bold text-sm" defaultValue={product?.barcode} />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="col-span-2 pt-4 border-t border-base-300">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Finanzas y Precios</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Costo de Compra</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input name="costPrice" type="number" step="0.01" className="input input-bordered h-12 pl-8 bg-base-200 border-none font-display font-bold text-lg" defaultValue={product?.costPrice} required />
              </div>
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Configuración IVA</span></label>
              <select className="select select-bordered h-12 bg-base-200 border-none font-bold text-xs uppercase" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="INCLUDES_TAX">Precio incluye IVA</option>
                <option value="EXCLUDES_TAX">Precio más IVA</option>
              </select>
            </div>
            <div className="form-control col-span-2">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Precio de Venta Sugerido</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">$</span>
                <input name="inputValue" type="number" step="0.01" className="input input-bordered h-12 pl-8 bg-base-100 border-2 border-primary font-display font-bold text-2xl text-primary" defaultValue={product?.priceInputMode === 'INCLUDES_TAX' ? product?.priceTotal : product?.priceBase} required />
              </div>
            </div>
          </div>
        </div>

        {/* Stock Section */}
        <div className="col-span-2 pt-4 border-t border-base-300">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Existencias</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[10px] font-bold uppercase text-slate-500">Track Stock</span>
              <input name="trackStock" type="checkbox" className="checkbox checkbox-primary checkbox-sm" defaultChecked={product ? product.trackStock : true} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-xs uppercase text-slate-500">
                  {product ? 'Stock Actual' : 'Stock Inicial'}
                </span>
              </label>
              <input 
                name="stock" 
                type="number" 
                className="input input-bordered h-12 bg-base-200 border-none font-display font-bold text-xl" 
                value={stockValue}
                onChange={(e) => setStockValue(Number(e.target.value))}
                required 
              />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Ubicación</span></label>
              <input name="warehouseLocation" type="text" className="input input-bordered h-12 bg-base-200 border-none font-bold text-sm uppercase" defaultValue={product?.warehouseLocation} placeholder="A-01-01" />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-span-2 pt-4 border-t border-base-300">
           <label className="label py-1"><span className="label-text font-bold text-xs uppercase text-slate-500">Imagen Representativa</span></label>
           <input type="file" className="file-input file-input-bordered w-full h-12 bg-base-200 border-none" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" className="btn flex-1 h-14 bg-base-300 border-none uppercase font-bold text-xs tracking-widest shadow-retail" onClick={() => (window as any).product_modal.close()}>
          Cancelar
        </button>
        <button type="submit" className={`btn flex-[2] h-14 btn-primary uppercase font-display font-bold text-sm tracking-widest shadow-retail ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? 'Procesando...' : (product ? 'Guardar Cambios' : 'Confirmar Alta')}
        </button>
      </div>
    </form>
  );
}
