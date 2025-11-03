<template>
  <div class="m-header">
    <AHeading :tone="tone" as="h2">{{ title }}</AHeading>
    <div class="meta anim-fade">
      <span class="badge" v-if="category">{{ category }}</span>
      <ARatingDots v-if="rate !== null" :rate="rate" :tone="tone" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import AHeading from '@/components/atoms/AHeading.vue';
  import ARatingDots from '@/components/atoms/ARatingDots.vue';
  defineProps<{ title: string; category?: string; rate: number | null; tone: 'navy' | 'purple' }>();
</script>
<style scoped>
  .m-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    background: #111827;
    color: #fff;
    font-size: 12px;
  }
</style>
