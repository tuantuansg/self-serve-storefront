import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export type CartItem = { product: Product; quantity: number };

const STORAGE_KEY = "tienphat_cart_v2";
let items: CartItem[] = [];
const listeners = new Set<() => void>();

const isBrowser = typeof window !== "undefined";

function load() {
  if (!isBrowser) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    items = [];
  }
}

function persist() {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

let initialized = false;
function ensureInit() {
  if (!initialized && isBrowser) {
    load();
    initialized = true;
  }
}

export const cartStore = {
  subscribe(cb: () => void) {
    ensureInit();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  get() {
    ensureInit();
    return items;
  },
  add(product: Product, quantity = 1) {
    ensureInit();
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      items = items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
      );
    } else {
      items = [...items, { product, quantity }];
    }
    persist();
    emit();
  },
  update(productId: string, quantity: number) {
    ensureInit();
    if (quantity <= 0) {
      items = items.filter((i) => i.product.id !== productId);
    } else {
      items = items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    }
    persist();
    emit();
  },
  remove(productId: string) {
    ensureInit();
    items = items.filter((i) => i.product.id !== productId);
    persist();
    emit();
  },
  clear() {
    items = [];
    persist();
    emit();
  },
};

export function useCart() {
  const [snapshot, setSnapshot] = useState<CartItem[]>([]);
  useEffect(() => {
    const update = () => setSnapshot([...cartStore.get()]);
    update();
    return cartStore.subscribe(update);
  }, []);
  const totalItems = snapshot.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = snapshot.reduce((s, i) => s + i.quantity * i.product.price, 0);
  return { items: snapshot, totalItems, totalPrice, ...cartStore };
}
