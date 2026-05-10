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
//jjj
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

  // Ensure orders have totals based on current product prices when products load/update
  useEffect(() => {
    if (!products || products.length === 0) return;
    const recomputed = orders.map(o => {
      if (typeof o.total === 'number' && o.total > 0) return o;
      const items = o.items || [];
      const total = items.reduce((sum, it) => {
        const prod = products.find(p => String(p.id) === String(it.id));
        const price = Number(prod?.price ?? 0);
        return sum + price * (Number(it.quantity) || 0);
      }, 0);
      return { ...o, total };
    });
    // Only update if any total was missing or changed
    const needUpdate = recomputed.some((r, i) => r.total !== orders[i]?.total);
    if (needUpdate) {
      setOrders(recomputed);
      try { localStorage.setItem('orders', JSON.stringify(recomputed)); } catch (e) { /* ignore */ }
    }
  }, [products]);

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

  // Check availability for a list of items [{id, quantity}]
  const checkAvailability = (items) => {
    const details = items.map(item => {
      const prod = products.find(p => String(p.id) === String(item.id));
      const stock = Number(prod?.stock ?? prod?.quantity ?? 0);
      return { id: item.id, requested: item.quantity, available: stock };
    });
    const insufficient = details.filter(d => d.available < d.requested);
    return { details, insufficient };
  };

  const createOrder = (order) => {
    // order: { customerName, items:[{id,quantity}], total }
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const { insufficient } = checkAvailability(order.items || []);

    // compute total from current product prices unless provided
    const computedTotal = (order.items || []).reduce((sum, it) => {
      const prod = products.find(p => String(p.id) === String(it.id));
      const price = Number(prod?.price ?? 0);
      return sum + price * (Number(it.quantity) || 0);
    }, 0);
    const total = typeof order.total === 'number' && order.total >= 0 ? order.total : computedTotal;

    let status = 'Pending';
    if (insufficient.length === 0) status = 'Confirmed';
    else if (insufficient.every(i => i.available === 0)) status = 'Rejected';

    const history = [{ status, at: createdAt }];
    const newOrder = { id, createdAt, history, status, total, ...order };

    // If confirmed, decrement stock
    if (status === 'Confirmed') {
      persistProducts(prev => {
        const next = prev.map(p => {
          const item = (order.items || []).find(i => String(i.id) === String(p.id));
          if (item) {
            const newStock = Math.max(0, (Number(p.stock ?? p.quantity ?? 0) - Number(item.quantity || 0)));
            return { ...p, stock: newStock };
          }
          return p;
        });
        return next;
      });
    }

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('orders', JSON.stringify(nextOrders));
    return newOrder;
  };

  const validateOrder = (id) => {
    const ord = orders.find(o => String(o.id) === String(id));
    if (!ord) return null;
    const { insufficient } = checkAvailability(ord.items || []);
    const now = new Date().toISOString();
    if (insufficient.length === 0) {
      // confirm and decrement
      persistProducts(prev => prev.map(p => {
        const item = (ord.items || []).find(i => String(i.id) === String(p.id));
        if (item) {
          const newStock = Math.max(0, (Number(p.stock ?? p.quantity ?? 0) - Number(item.quantity || 0)));
          return { ...p, stock: newStock };
        }
        return p;
      }));

      const updated = { ...ord, status: 'Confirmed', history: [...ord.history, { status: 'Confirmed', at: now }] };
      const next = orders.map(o => (String(o.id) === String(id) ? updated : o));
      setOrders(next);
      localStorage.setItem('orders', JSON.stringify(next));
      return updated;
    } else if (insufficient.every(i => i.available === 0)) {
      const updated = { ...ord, status: 'Rejected', history: [...ord.history, { status: 'Rejected', at: now }], insufficient };
      const next = orders.map(o => (String(o.id) === String(id) ? updated : o));
      setOrders(next);
      localStorage.setItem('orders', JSON.stringify(next));
      return updated;
    } else {
      const updated = { ...ord, status: 'Pending', history: [...ord.history, { status: 'Pending', at: now }], insufficient };
      const next = orders.map(o => (String(o.id) === String(id) ? updated : o));
      setOrders(next);
      localStorage.setItem('orders', JSON.stringify(next));
      return updated;
    }
  };

  const updateOrderStatus = (id, status) => {
    // if setting to Confirmed, ensure stock is decremented
    const now = new Date().toISOString();
    if (status === 'Confirmed') {
      const ord = orders.find(o => String(o.id) === String(id));
      if (ord) {
        persistProducts(prev => prev.map(p => {
          const item = (ord.items || []).find(i => String(i.id) === String(p.id));
          if (item) {
            const newStock = Math.max(0, (Number(p.stock ?? p.quantity ?? 0) - Number(item.quantity || 0)));
            return { ...p, stock: newStock };
          }
          return p;
        }));
      }
    }

    const next = orders.map(o => (String(o.id) === String(id) ? { ...o, status, history: [...(o.history||[]), { status, at: now }] } : o));
    setOrders(next);
    localStorage.setItem('orders', JSON.stringify(next));
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    // Sum revenue for Confirmed and Pending orders (exclude Rejected)
    totalRevenue: orders.reduce((s, o) => {
      const st = String(o.status || '').toLowerCase();
      if (st === 'rejected') return s;
      return s + (Number(o.total) || 0);
    }, 0),
    totalUsers: Number(localStorage.getItem('mock_user_count') || 42),
  };

  const lowStockProducts = (threshold = 5) => products.filter(p => Number(p.stock ?? p.quantity ?? 0) <= threshold);

  return (
    <ProductsContext.Provider value={{ products, addProduct, editProduct, deleteProduct, orders, createOrder, validateOrder, updateOrderStatus, checkAvailability, lowStockProducts, stats }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
