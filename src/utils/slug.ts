// Utility untuk membuat slug SEO-friendly yang stabil
export function slugify(raw: string): string {
  return raw
    .normalize('NFKD') // handle accent
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alnum => -
    .replace(/^-+|-+$/g, '') // trim -
    .replace(/-{2,}/g, '-'); // collapse --
}

/**
 * Slug stabil dengan ID di akhir (contoh: "fancy-shirt-18").
 * Keuntungan: unik, bisa di-reverse ke ID tanpa hit API list.
 */
export function slugWithId(title: string, id: number): string {
  const base = slugify(title || String(id));
  return `${base}-${id}`; // tambahkan -id agar unik & reversible
}

/**
 * Ekstrak ID dari slug berformat *-<id>.
 * Return NaN kalau tidak ada id valid.
 */
export function extractIdFromSlug(slug: string): number {
  const m = /-(\d+)$/.exec(slug);
  return m ? Number(m[1]) : NaN;
}
