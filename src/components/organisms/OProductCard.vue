<template>
  <Transition name="card" appear>
    <div class="card">
      <div class="img-wrap">
        <img v-if="image" :src="image" alt="image" class="anim-fade" />
      </div>
      <div class="body anim-slide">
        <MProductHeader :title="title" :category="category" :rate="rate" :tone="tone" />
        <p class="desc">{{ description }}</p>
        <div class="bottom">
          <APrice :value="price" :tone="tone" />
          <MProductActions :tone="tone" :disabled="disabled" @next="$emit('next')" />
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import MProductHeader from '@/components/molecules/MProductHeader.vue';
import MProductActions from '@/components/molecules/MProductActions.vue';
import APrice from '@/components/atoms/APrice.vue';
defineProps<{ image?: string; title: string; category?: string; description: string; price: number; rate: number | null; tone: 'navy' | 'purple'; disabled?: boolean }>();
</script>
<style scoped>
.card {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6)
}

.img-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px
}

.img-wrap img {
  max-width: 100%;
  max-height: 420px;
  object-fit: contain
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5)
}

.desc {
  font-size: clamp(14px, .5vw + 12px, 16px)
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4)
}

@media (max-width: var(--bp-tablet)) {
  .card {
    grid-template-columns: 1fr;
    padding: var(--space-5)
  }

  .img-wrap {
    min-height: 280px
  }
}

@media (max-width: var(--bp-mobile)) {
  .card {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    gap: var(--space-4)
  }

  .img-wrap {
    min-height: 220px
  }

  .bottom {
    flex-direction: column;
    align-items: flex-start
  }
}
</style>
