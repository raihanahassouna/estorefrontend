import React, { createContext, useContext, useEffect, useState } from 'react';
import { productService } from '../services/productService';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      // Try localStorage first for fast UX
      const saved = JSON.parse(localStorage.getItem('products') || 'null');
      if (Array.isArray(saved) && saved.length > 0) {
        setProducts(saved);
      }

      try {
        const data = await productService.getAll();
        let prods = [];
        if (Array.isArray(data)) prods = data;
        else if (data?.products) prods = data.products;
        else if (data?.data) prods = data.data;

        // Merge remote with local (local overrides)
        const merged = [...prods];
        if (Array.isArray(saved)) {
          // prepend local items that remote doesn't have (by id)
          const remoteIds = new Set(prods.map(p => String(p.id)));
          for (const p of saved) if (!remoteIds.has(String(p.id))) merged.unshift(p);
        }

        setProducts(merged);
        localStorage.setItem('products', JSON.stringify(merged));
      } catch (e) {
        // ignore, keep local
        console.warn('Failed loading remote products', e);
      }
    };

    // Load orders (persisted locally for demo)
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    load();
  }, []);

  const persistProducts = (updater) => {
    setProducts(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem('products', JSON.stringify(next)); } catch (e) { /* ignore */ }
      return next;
    });
  };

  const addProduct = async (p) => {
    // Try server first, fallback to local
    try {
      const created = await productService.create(p);
      const toSave = created && created.id ? created : { id: String(created?.id ?? Date.now()), ...p };
      persistProducts(prev => [toSave, ...prev]);
      return toSave;
    } catch (e) {
      const local = { id: Date.now().toString(), ...p };
      persistProducts(prev => [local, ...prev]);
      return local;
    }
  };

  const editProduct = async (id, updates) => {
    try {
      const remote = await productService.update(id, updates);
      const toApply = remote && Object.keys(remote).length ? remote : { id, ...updates };
      persistProducts(prev => prev.map(p => (String(p.id) === String(id) ? { ...p, ...toApply } : p)));
      return toApply;
    } catch (e) {
      persistProducts(prev => prev.map(p => (String(p.id) === String(id) ? { ...p, ...updates } : p)));
      return { id, ...updates };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.remove(id);
      persistProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      return true;
    } catch (e) {
      persistProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      return false;
    }
  };

  const addOrder = (order) => {
    const newOrder = { id: Date.now().toString(), status: 'Pending', createdAt: new Date().toISOString(), ...order };
    const next = [newOrder, ...orders];
    setOrders(next);
    localStorage.setItem('orders', JSON.stringify(next));
  };

  const updateOrderStatus = (id, status) => {
    const next = orders.map(o => (String(o.id) === String(id) ? { ...o, status } : o));
    setOrders(next);
    localStorage.setItem('orders', JSON.stringify(next));
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    totalUsers: Number(localStorage.getItem('mock_user_count') || 42),
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, editProduct, deleteProduct, orders, addOrder, updateOrderStatus, stats }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
