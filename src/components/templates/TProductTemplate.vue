<template>
  <div class="container-wrap" :class="bgClass">
    <div class="inner container">
      <slot />
    </div>
    <Transition name="fade">
      <div v-if="available" class="pattern"></div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ available: boolean; tone: 'navy' | 'purple' | 'neutral' }>();
const bgClass = computed(() => (!props.available ? 'bg-grey' : props.tone === 'navy' ? 'bg-blue' : 'bg-pink'));
</script>
<style scoped>
.container-wrap {
  position: relative;
  min-height: 100vh;
  padding: var(--space-6);
  transition: background-color .25s ease
}

.inner {
  max-width: 960px;
  margin: auto
}

.pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(0, 0, 0, .06) 1px, transparent 1px);
  background-size: 22px 22px;
  animation: fade-in .3s ease
}

.bg-grey {
  background: var(--color-bg)
}

.bg-blue {
  background: var(--bg-men)
}

.bg-pink {
  background: var(--bg-women)
}

@media (max-width:var(--bp-tablet)) {
  .container-wrap {
    padding: var(--space-5)
  }

  .inner {
    max-width: 860px
  }
}

@media (max-width:var(--bp-mobile)) {
  .container-wrap {
    padding: var(--space-4)
  }

  .inner {
    max-width: 100%
  }
}
</style>
