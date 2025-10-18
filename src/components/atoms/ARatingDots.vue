<template>
  <div class="a-rating">
    <span class="rate">{{ rate.toFixed(1) }}</span>
    <div class="dots">
      <span v-for="i in 5" :key="i" class="dot" :class="dotClass(i)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ rate: number; tone?: 'navy'|'purple' }>();
const filledUntil = computed(()=> Math.floor(props.rate + 0.5));
function dotClass(i:number){
  const filled = i <= filledUntil.value;
  const t = props.tone === 'navy' ? 'navy' : 'purple';
  return filled ? `dot--${t}` : `dot--${t}-ghost`;
}
</script>
<style scoped>
.a-rating{display:flex;gap:10px;align-items:center}.rate{font-weight:700}.dots{display:flex;gap:6px}
.dot{width:10px;height:10px;border-radius:999px;border:2px solid transparent;transform: scale(.9)}
.dot--navy{background:#002772;animation: pop-in .18s ease}
.dot--navy-ghost{background:#fff;border-color:#002772}
.dot--purple{background:#720060;animation: pop-in .18s ease}
.dot--purple-ghost{background:#fff;border-color:#720060}
@media (max-width: var(--bp-mobile)){ .dot{ width:8px; height:8px } }
</style>
