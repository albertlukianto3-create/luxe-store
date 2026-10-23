'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('cart') || '[]')); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem('cart', JSON.stringify(items)); }, [items, ready]);

  const add = (p, qty = 1) => {
    setItems((c) => {
      const f = c.find((i) => i.id === p.id);
      if (f) return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(p.stock, i.qty + qty) } : i));
      return [...c, { id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty: Math.min(p.stock, qty) }];
    });
    setOpen(true);
  };
  const setQty = (id, qty) => setItems((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.stock, qty) } : i))));
  const clear = () => setItems([]);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, setQty, clear, count, subtotal, open, setOpen }}>{children}</Ctx.Provider>;
}
