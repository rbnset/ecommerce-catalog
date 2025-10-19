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
 * Perbaikan:
 * - Head SEO reaktif (vueuse/head)
 * - Canonical slug redirect untuk route numerik
 * - Watch route agar navigasi manual ikut muat data & canonicalize
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

/** Ambil initial ID dari slug atau id numerik */
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
  goTo, // opsional (dipakai watcher)
} = useProduct(initialId);

const tone = computed(() => (isMen.value ? 'navy' : isWomen.value ? 'purple' : 'neutral'));

/* --------- SEO HEAD (reactive) --------- */
const pageTitle = computed(() =>
  productData.value?.title ? `${productData.value.title} | Product` : 'Product',
);
const pageDesc = computed(() => (productData.value?.description ?? '').slice(0, 155));
const pageUrl = computed(() => window.location.origin + route.fullPath);
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

/** Jika user masuk via /product/:id numerik → replace ke slug canonical */
async function ensureCanonicalUrl() {
  if (!productData.value) return;
  if (route.name === 'product.id') {
    const slug = slugWithId(productData.value.title ?? '', productData.value.id);
    await router.replace({ name: 'product.slug', params: { slug } });
  }
}

onMounted(async () => {
  await init();
  await load();
  await ensureCanonicalUrl();
});

/** Next → navigasi pakai slug canonical */
async function nextWithUrl() {
  await next(); // productData di-clear di composable → skeleton tampil dulu
  if (productData.value) {
    const slug = slugWithId(productData.value.title ?? '', productData.value.id);
    await router.replace({ name: 'product.slug', params: { slug } });
  }
}

/** Sinkron saat user back/forward/ketik URL */
watch(
  () => route.fullPath,
  async () => {
    const targetId = resolveInitialId(route);
    if (targetId !== productId.value && Number.isFinite(targetId) && targetId > 0) {
      await goTo?.(targetId);
      await ensureCanonicalUrl();
    }
  },
);
</script>

<style scoped>
/* Unavailable layout (aman & responsif) */
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

/* Mobile */
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
