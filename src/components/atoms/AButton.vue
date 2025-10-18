<template>
  <button :class="['a-btn', 'anim-pop', variantClass]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ variant?: 'solid' | 'outline'; color?: 'navy' | 'purple' | 'neutral'; disabled?: boolean }>();
const variantClass = computed(() => `a-btn--${props.variant ?? 'solid'} a-btn--${props.color ?? 'neutral'}`);
</script>

<style scoped>
.a-btn {
  cursor: pointer;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: 2px solid transparent;
  transition: transform .12s ease, box-shadow .12s ease
}

.a-btn:active {
  transform: translateY(1px)
}

.a-btn:hover:not(:disabled) {
  box-shadow: 0 6px 14px rgba(0, 0, 0, .08)
}

.a-btn:disabled {
  opacity: .6;
  cursor: not-allowed
}

.a-btn--solid.a-btn--navy {
  background: var(--color-secondary);
  color: var(--color-primary-contrast)
}

.a-btn--solid.a-btn--purple {
  background: var(--color-primary);
  color: var(--color-primary-contrast)
}

.a-btn--solid.a-btn--neutral {
  background: #e5e7eb;
  color: var(--color-text)
}

.a-btn--outline.a-btn--navy {
  background: transparent;
  color: var(--color-secondary);
  border-color: var(--color-secondary)
}

.a-btn--outline.a-btn--purple {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary)
}

.a-btn--outline.a-btn--neutral {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border)
}
</style>
