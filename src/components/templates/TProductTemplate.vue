<template>
  <div class="container-wrap" :class="bgClass">
    <!-- Pattern muncul hanya saat available -->
    <Transition name="fade">
      <div v-if="available" class="pattern">
        <!-- Inline SVG pattern supaya tidak perlu asset eksternal -->
        <svg viewBox="0 0 100 10" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.06)" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
    </Transition>

    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ available: boolean; tone: 'navy' | 'purple' | 'neutral' }>();
const bgClass = computed(() => (!props.available ? 'bg-grey' : props.tone === 'navy' ? 'bg-blue' : 'bg-pink'));
</script>

<style scoped>
/* Full-screen like original design + equal vertical padding across breakpoints */
.container-wrap {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: grid;
  /* Global page gap (top & bottom space), desktop default */
  --page-gap: 48px;
  padding-block: var(--page-gap);
}

/* Center the content area */
.inner {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: calc(100vh - (var(--page-gap) * 2));
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pattern sits behind card */
.pattern {
  position: absolute;
  z-index: 1;
  top: -12%;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.pattern svg {
  width: 100%;
  height: 200px;
}

/* Tablet: sedikit kurangi gap agar muat */
@media (max-width: 1024px) {
  .container-wrap {
    --page-gap: 32px;
  }

  .pattern svg {
    height: 180px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .container-wrap {
    --page-gap: 20px;
  }

  .pattern svg {
    height: 160px;
  }
}
</style>
