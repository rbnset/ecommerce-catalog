<template>
  <TProductTemplate :available="isAvailable" :tone="tone">
    <Transition name="fade" mode="out-in">
      <!-- SKELETON (menggantikan konten) -->
      <MSkeletonCard v-if="!productData" key="skeleton" />

      <!-- UNAVAILABLE STATE -->
      <div v-else-if="!isAvailable" key="empty" class="product-unavailable-container">
        <div class="overlay" aria-hidden="true">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="#d1d5db">
            <path
              d="M9.171 16.828a4 4 0 0 1 5.657 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" />
          </svg>
        </div>
        <div class="detail-product">
          <p>This product is unavailable to show</p>
          <div class="buttons">
            <button class="button-next" @click="nextWithUrl">Next product</button>
          </div>
        </div>
      </div>

      <!-- KONTEN PRODUK -->
      <OProductCard v-else key="card" :image="productData?.image" :title="productData?.title ?? ''"
        :category="productData?.category ?? ''" :description="productData?.description ?? ''"
        :price="productData?.price ?? 0" :rate="productData?.rating?.rate ?? null" :tone="tone" :disabled="isLoading"
        @next="nextWithUrl" />
    </Transition>
  </TProductTemplate>
</template>

<script setup lang="ts">
/**
 * Perbaikan utama:
 * - useHead dipanggil SETELAH state/computed siap supaya reaktif
 * - ensureCanonicalUrl() dipanggil tiap selesai load + ketika route numeric
 * - watch(route) agar navigasi manual/back/forward juga memuat ulang data
 */
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

import { useProduct } from '@/composables/useProduct';
import TProductTemplate from '@/components/templates/TProductTemplate.vue';
import OProductCard from '@/components/organisms/OProductCard.vue';
import MSkeletonCard from '@/components/molecules/MSkeletonCard.vue';
import { extractIdFromSlug, slugWithId } from '@/utils/slug';

const route = useRoute();
const router = useRouter();

/** Resolve initial ID dari slug atau id numerik */
function resolveInitialId(r = route): number {
  if (typeof r.params.slug === 'string') {
    const sid = extractIdFromSlug(r.params.slug);
    if (Number.isFinite(sid) && sid > 0) return sid;
  }
  if (typeof r.params.id === 'string') {
    const nid = Number(r.params.id);
    if (Number.isFinite(nid) && nid > 0) return nid;
  }
  return 1;
}

const initialId = resolveInitialId();

const {
  productId,
  productData,
  isLoading,
  isMen,
  isWomen,
  isAvailable,
  load,
  init,
  next,
  goTo, // (opsional) bisa dipakai di watcher route
} = useProduct(initialId);

const tone = computed(() => (isMen.value ? 'navy' : isWomen.value ? 'purple' : 'neutral'));

/** -----------------------------
 *  SEO Head (reactive via vueuse)
 *  -----------------------------
 *  NOTE: dideklarasikan SETELAH productData/tone ada supaya computed valid
 */
const pageTitle = computed(() =>
  productData.value?.title ? `${productData.value.title} | Product` : 'Product',
);
const pageDesc = computed(() => (productData.value?.description ?? '').slice(0, 155));
const pageUrl = computed(() => {
  // gunakan origin + fullPath supaya reaktif saat route berubah
  const origin = window.location.origin;
  return origin + route.fullPath;
});
const pageImage = computed(() => productData.value?.image || '');

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDesc },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDesc },
    { property: 'og:url', content: pageUrl },
    pageImage.value ? { property: 'og:image', content: pageImage } : undefined,
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDesc },
    pageImage.value ? { name: 'twitter:image', content: pageImage } : undefined,
  ].filter(Boolean) as any,
  link: [{ rel: 'canonical', href: pageUrl }],
});

/** Pastikan URL canonical slug ketika user membuka /product/:id numerik */
async function ensureCanonicalUrl() {
  if (!productData.value) return;
  if (route.name === 'product.id') {
    const slug = slugWithId(productData.value.title ?? '', productData.value.id);
    await router.replace({ name: 'product.slug', params: { slug } });
  }
}

onMounted(async () => {
  await init();      // ambil maximumProduct dan normalisasi id
  await load();      // muat produk initial
  await ensureCanonicalUrl();
});

/** Next → selalu navigasi dengan slug (canonical), head akan ikut update reaktif */
async function nextWithUrl() {
  await next(); // composable sudah set productData=null → skeleton tampil dulu
  if (productData.value) {
    const slug = slugWithId(productData.value.title ?? '', productData.value.id);
    await router.replace({ name: 'product.slug', params: { slug } });
  }
}

/**
 * Watch route: jika user navigasi manual (klik back/forward atau ketik URL),
 * sinkronkan state dengan slug/id baru.
 */
watch(
  () => route.fullPath,
  async () => {
    // Ekstrak target id dari route saat ini
    const targetId = resolveInitialId(route);
    if (targetId !== productId.value && Number.isFinite(targetId) && targetId > 0) {
      // pakai goTo agar skeleton tampil & aman dari race
      await goTo?.(targetId);
      await ensureCanonicalUrl();
    }
  },
);
</script>

<style scoped>
/* Unavailable layout mirroring original, plus responsive fixes dari patch sebelumnya */
.product-unavailable-container {
  width: 80vw;
  min-height: 70vh;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 48px 32px;
  position: relative;
  z-index: 2;

  display: grid;
  place-items: center;
}

.product-unavailable-container .overlay {
  position: absolute;
  z-index: 1;
  top: 15%;
  left: 13%;
}

.product-unavailable-container .detail-product {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  text-align: center;
}

.product-unavailable-container .detail-product p {
  color: #000;
  font-size: 20px;
  font-weight: 400;
}

.product-unavailable-container .detail-product .buttons {
  margin-top: 13px;
}

.product-unavailable-container .detail-product .button-next {
  width: 465px;
  height: 42px;
  color: #3f3f3f;
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  border: 3px solid #000;
  background: #fff;
  cursor: pointer;
}

/* Mobile tweaks */
@media only screen and (max-width: 600px) {
  .product-unavailable-container {
    width: 92vw;
    min-height: 70vh;
    padding: 16px 14px;
  }

  .product-unavailable-container .overlay {
    top: 20%;
    left: 8%;
  }

  .product-unavailable-container .detail-product {
    margin-top: 1.5rem;
  }

  .product-unavailable-container .detail-product p {
    font-size: 16px;
  }

  .product-unavailable-container .detail-product .buttons {
    margin-top: 1.5rem;
  }

  .product-unavailable-container .detail-product .button-next {
    width: 100%;
    max-width: 300px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
