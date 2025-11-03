export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
};

const BASE = (import.meta as any)?.env?.VITE_API_BASE_URL ?? 'https://fakestoreapi.com';

/** tiny in-memory cache (TTL 60s) */
const cache = new Map<string, { t: number; v: unknown }>();
const TTL_MS = 60_000;

const getCache = <T>(k: string) => {
  const h = cache.get(k);
  if (!h) return null;
  if (Date.now() - h.t > TTL_MS) {
    cache.delete(k);
    return null;
  }
  return h.v as T;
};
const setCache = (k: string, v: unknown) => cache.set(k, { t: Date.now(), v });

async function fx(url: string, timeout = 12000) {
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), timeout);
  try {
    return await fetch(url, { signal: c.signal, headers: { Accept: 'application/json' } });
  } finally {
    clearTimeout(id);
  }
}

async function get<T>(url: string, retries = 2): Promise<T> {
  const c = getCache<T>(url);
  if (c) return c;

  let a = 0;
  for (;;) {
    try {
      const r = await fx(url);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = (await r.json()) as T;
      setCache(url, d);
      return d;
    } catch (e) {
      if (a++ >= retries) throw e;
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, a)));
    }
  }
}

export async function fetchProduct(id: number) {
  if (!Number.isFinite(id) || id < 1) throw new Error('Invalid product id');
  const p = await get<Product>(`${BASE}/products/${id}`);
  if (!p || typeof p !== 'object') throw new Error('Malformed product');
  return p;
}

export async function fetchProductsCount() {
  const list = await get<unknown[]>(`${BASE}/products`);
  return Array.isArray(list) ? list.length : 0;
}
