<template>
  <TransitionGroup name="card" tag="div" class="m-actions">
    <AButton key="buy" :color="tone" variant="solid" :disabled="disabled">Buy now</AButton>
    <AButton key="next" :color="tone" variant="outline" :disabled="disabled" @click="$emit('next')">Next product
    </AButton>
  </TransitionGroup>
</template>
<script setup lang="ts">
import AButton from '@/components/atoms/AButton.vue';
defineProps<{ tone: 'navy' | 'purple'; disabled?: boolean }>();
</script>
<style scoped>
.m-actions {
  display: flex;
  gap: 10px
}
</style>
