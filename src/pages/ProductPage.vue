<template>
  <TProductTemplate :available="isAvailable" :tone="tone">
    <Transition name="fade" mode="out-in">
      <!-- SKELETON (menggantikan konten) -->
      <MSkeletonCard v-if="!productData" key="skeleton" />

      <!-- UNAVAILABLE STATE -->
      <div v-else-if="!isAvailable" key="empty" class="product-unavailable-container">
        <div class="overlay">
          <!-- boleh ganti ke assetmu sendiri jika mau -->
          <svg width="120" height="120" viewBox="0 0 24 24" fill="#d1d5db" aria-hidden="true">
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
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProduct } from '@/composables/useProduct';
import TProductTemplate from '@/components/templates/TProductTemplate.vue';
import OProductCard from '@/components/organisms/OProductCard.vue';
import MSkeletonCard from '@/components/molecules/MSkeletonCard.vue';

const route = useRoute();
const router = useRouter();
const initialId = Number(route.params.id ?? 1);

const { productId, productData, isLoading, isMen, isWomen, isAvailable, load, init, next } =
  useProduct(Number.isFinite(initialId) && initialId > 0 ? initialId : 1);

const tone = computed(() => (isMen.value ? 'navy' : isWomen.value ? 'purple' : 'neutral'));

onMounted(async () => { await init(); await load(); });

async function nextWithUrl() {
  await next();
  router.replace({ name: 'product', params: { id: productId.value } });
}
</script>

<style scoped>
/* Unavailable layout mimicking original */
.product-unavailable-container {
  width: 80vw;
  height: 70vh;
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
    height: 90vh;
    padding: 1rem;
  }

  .product-unavailable-container .overlay {
    top: 25%;
    left: 10%;
  }

  .product-unavailable-container .detail-product {
    margin-top: 2rem;
  }

  .product-unavailable-container .detail-product p {
    font-size: 16px;
  }

  .product-unavailable-container .detail-product .buttons {
    margin-top: 2rem;
  }

  .product-unavailable-container .detail-product .button-next {
    width: 265px;
    height: 32px;
    font-size: 16px;
  }
}
</style>
