cat > src/pages/ProductPage.vue <<'EOF' <template>
  <TProductTemplate :available="isAvailable" :tone="tone">
    <!-- Skeleton saat loading / first render -->
    <template v-if="isLoading || !productData">
      <MSkeletonCard />
    </template>

    <!-- Konten -->
    <Transition name="fade" mode="out-in">
      <div v-if="!isAvailable && productData" key="empty" class="empty">
        <p>This product is unavailable to show</p>
        <AButton variant="solid" color="neutral" :disabled="isLoading" @click="nextWithUrl">Next product</AButton>
      </div>
      <OProductCard v-else-if="productData" key="card" :image="productData?.image" :title="productData?.title ?? ''"
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
  import AButton from '@/components/atoms/AButton.vue';
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
  .empty {
    display: grid;
    place-items: center;
    gap: 12px;
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    padding: var(--space-8);
  }
</style>
  EOF
