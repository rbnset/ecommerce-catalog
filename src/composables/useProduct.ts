// src/composables/useProduct.ts
import { ref, shallowRef, computed } from 'vue';
import { fetchProduct, fetchProductsCount, type Product } from '@/services/productsApi';

/**
 * Composable untuk 1 produk per halaman.
 * - init(): ambil jumlah produk (maximumProduct) dan normalkan productId
 * - load(): fetch produk berdasarkan productId saat ini (aman dari race)
 * - next(): pindah ke produk berikutnya (wrap ke 1), clear data biar skeleton muncul
 * - (opsional) prev(), goTo(id)
 */
export function useProduct(initialId = 1) {
  const productId = ref(initialId);
  const maximumProduct = ref(0);
  const isLoading = ref(false);
  const productData = shallowRef<Product | null>(null);

  // Tone/availability
  const isMen = computed(() => productData.value?.category === "men's clothing");
  const isWomen = computed(() => productData.value?.category === "women's clothing");
  const isAvailable = computed(() => isMen.value || isWomen.value);

  // Token untuk mencegah race-condition (respon lama menimpa yang baru)
  let token = 0;

  /**
   * Fetch produk berdasarkan productId saat ini.
   * Menggunakan token agar respon lama diabaikan.
   */
  async function load() {
    const t = ++token;
    isLoading.value = true;
    try {
      const data = await fetchProduct(productId.value);
      if (t !== token) return; // abaikan respons usang
      productData.value = data; // set data setelah fetch sukses
    } finally {
      if (t === token) isLoading.value = false;
    }
  }

  /**
   * Ambil jumlah total produk, dan normalkan productId di rentang [1..maximumProduct].
   */
  async function init() {
    maximumProduct.value = await fetchProductsCount();
    if (productId.value < 1 || productId.value > maximumProduct.value) {
      productId.value = 1;
    }
  }

  /**
   * Pindah ke produk berikutnya (wrap), lalu load.
   * Penting: kosongkan productData dulu supaya skeleton tampil (mutually exclusive).
   */
  async function next() {
    if (isLoading.value) return;
    productId.value = productId.value < maximumProduct.value ? productId.value + 1 : 1;

    // ⬇️ Trigger skeleton secara bersih (template pakai v-if="!productData")
    productData.value = null;

    await load();
  }

  // (Opsional) tombol Prev
  async function prev() {
    if (isLoading.value) return;
    productId.value = productId.value > 1 ? productId.value - 1 : Math.max(1, maximumProduct.value);
    productData.value = null; // munculkan skeleton
    await load();
  }

  // (Opsional) pindah langsung ke ID tertentu (dengan validasi dasar)
  async function goTo(id: number) {
    if (isLoading.value) return;
    if (!Number.isFinite(id) || id < 1 || id > maximumProduct.value) return;
    productId.value = id;
    productData.value = null; // munculkan skeleton
    await load();
  }

  return {
    productId,
    maximumProduct,
    isLoading,
    productData,
    isMen,
    isWomen,
    isAvailable,
    load,
    init,
    next,
    // opsional:
    prev,
    goTo,
  };
}
