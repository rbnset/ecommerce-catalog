<template>
  <TProductTemplate :available="isAvailable" :tone="tone">
    <Transition name="fade" mode="out-in">
      <!-- SKELETON -->
      <MSkeletonCard v-if="!productData" key="skeleton" />

      <!-- UNAVAILABLE: sad image di TENGAH card -->
      <div v-else-if="!isAvailable" key="empty" class="card">
        <div class="product-unavailable-container">
          <!-- Overlay full, center pakai flex -->
          <div class="overlay" aria-hidden="true">
            <img :src="sadFaceUrl" alt="Unavailable illustration" />
          </div>

          <!-- Konten utama (di atas overlay) -->
          <div class="detail-product">
            <p>This product is unavailable to show</p>
            <div class="buttons">
              <button class="button-next" @click="nextWithUrl">Next product</button>
            </div>
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
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import { useProduct } from '@/composables/useProduct';
import TProductTemplate from '@/components/templates/TProductTemplate.vue';
import OProductCard from '@/components/organisms/OProductCard.vue';
import MSkeletonCard from '@/components/molecules/MSkeletonCard.vue';
import { extractIdFromSlug, slugWithId } from '@/utils/slug';
import sadFaceUrl from '@/assets/images/sad-face.png';

const route = useRoute();
const router = useRouter();

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

const { productId, productData, isLoading, isMen, isWomen, isAvailable, load, init, next, goTo } =
  useProduct(initialId);

const tone = computed(() => (isMen.value ? 'navy' : isWomen.value ? 'purple' : 'neutral'));

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
  ].filter(Boolean) as any,
  link: [{ rel: 'canonical', href: pageUrl }],
});

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

async function nextWithUrl() {
  await next();
  if (productData.value) {
    const slug = slugWithId(productData.value.title ?? '', productData.value.id);
    await router.replace({ name: 'product.slug', params: { slug } });
  }
}

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
/* ====== CARD WRAPPER ====== */
.card {
  position: relative;
  z-index: 2;
  width: min(1100px, 80vw);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 48px 32px;
  margin: 0;
}

/* ====== UNAVAILABLE LAYOUT (image center, teks di atasnya) ====== */
.product-unavailable-container {
  position: relative;
  /* anchor overlay */
  width: 100%;
  min-height: 40vh;
  overflow: hidden;
}

/* Overlay mengisi card dan center child pakai flex */
.product-unavailable-container .overlay {
  position: absolute;
  inset: 0;
  /* top:0; right:0; bottom:0; left:0 */
  z-index: 1;
  display: flex;
  align-items: center;
  /* vertical center */
  justify-content: center;
  /* horizontal center */
  pointer-events: none;
  /* tidak menghalangi tombol */
}

/* Gambar responsif, selalu center */
.product-unavailable-container .overlay img {
  display: block;
  width: clamp(200px, 38vw, 560px);
  /* responsif: min 200px, ideal 38vw, max 560px */
  height: auto;
  /* jaga rasio */
  object-fit: contain;
  opacity: 0.68;
  /* agar teks tetap terbaca */
}

/* Konten utama di atas overlay */
.product-unavailable-container .detail-product {
  position: relative;
  /* di atas overlay karena z-index parent lebih tinggi */
  z-index: 2;
  min-height: 40vh;
  padding: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* center vertical */
  text-align: center;
}

.product-unavailable-container .detail-product p {
  color: #000;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
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
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  border: 3px solid #000;
  background: #fff;
  margin: 0 auto;
  cursor: pointer;
}

/* ====== Responsif ====== */
@media (max-width: 1024px) {
  .card {
    padding: 32px 24px;
  }

  .product-unavailable-container {
    min-height: 44vh;
  }

  .product-unavailable-container .overlay img {
    width: clamp(200px, 42vw, 520px);
  }
}

@media (max-width: 600px) {
  .card {
    width: 92vw;
    padding: 16px 14px;
  }

  .product-unavailable-container,
  .product-unavailable-container .detail-product {
    min-height: 50vh;
  }

  .product-unavailable-container .overlay img {
    width: clamp(180px, 60vw, 380px);
    opacity: 0.6;
  }

  .product-unavailable-container .detail-product p {
    font-size: 16px;
  }

  .product-unavailable-container .detail-product .button-next {
    width: 100%;
    max-width: 300px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
