import { ref, shallowRef, computed } from 'vue';
import { fetchProduct, fetchProductsCount, type Product } from '@/services/productsApi';

export function useProduct(initialId = 1) {
  const productId = ref(initialId);
  const maximumProduct = ref(0);
  const isLoading = ref(false);
  const productData = shallowRef<Product | null>(null);

  const isMen = computed(() => productData.value?.category === "men's clothing");
  const isWomen = computed(() => productData.value?.category === "women's clothing");
  const isAvailable = computed(() => isMen.value || isWomen.value);

  let token = 0; // cegah race condition saat user spam Next
  async function load() {
    const t = ++token;
    isLoading.value = true;
    try {
      const data = await fetchProduct(productId.value);
      if (t !== token) return; // abaikan respons lama
      productData.value = data;
    } finally {
      if (t === token) isLoading.value = false;
    }
  }

  async function init() {
    maximumProduct.value = await fetchProductsCount();
    if (productId.value < 1 || productId.value > maximumProduct.value) productId.value = 1;
  }

  async function next() {
    if (isLoading.value) return;
    productId.value = productId.value < maximumProduct.value ? productId.value + 1 : 1;
    await load();
  }

  return { productId, maximumProduct, isLoading, productData, isMen, isWomen, isAvailable, load, init, next };
}
