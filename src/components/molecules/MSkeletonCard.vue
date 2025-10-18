<template>
  <div class="sk-card" aria-hidden="true">
    <div class="sk-image shimmer"></div>
    <div class="sk-body">
      <div class="sk-line sk-title shimmer"></div>
      <div class="sk-line shimmer"></div>
      <div class="sk-line shimmer w-60"></div>
      <div class="sk-bottom">
        <div class="sk-price shimmer"></div>
        <div class="sk-actions">
          <div class="sk-btn shimmer"></div>
          <div class="sk-btn outline shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.sk-card {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6)
}

.sk-image {
  height: 320px;
  border-radius: var(--radius-lg);
  background: #e6e6e6
}

.sk-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4)
}

.sk-line {
  height: 14px;
  border-radius: 999px;
  background: #e6e6e6
}

.sk-title {
  height: 22px
}

.w-60 {
  width: 60%
}

.sk-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-4)
}

.sk-price {
  width: 120px;
  height: 28px;
  border-radius: 999px;
  background: #e6e6e6
}

.sk-actions {
  display: flex;
  gap: var(--space-3)
}

.sk-btn {
  width: 120px;
  height: 40px;
  border-radius: var(--radius-md);
  background: #e6e6e6
}

.sk-btn.outline {
  width: 140px
}

.shimmer {
  position: relative;
  overflow: hidden
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, #f5f5f5, transparent);
  animation: shimmer 1.2s infinite
}

@keyframes shimmer {
  100% {
    transform: translateX(100%)
  }
}

@media (max-width: var(--bp-tablet)) {
  .sk-card {
    grid-template-columns: 1fr
  }

  .sk-image {
    height: 280px
  }
}

@media (max-width: var(--bp-mobile)) {
  .sk-card {
    padding: var(--space-4);
    border-radius: var(--radius-lg)
  }

  .sk-image {
    height: 200px
  }

  .sk-bottom {
    flex-direction: column;
    align-items: flex-start
  }

  .sk-btn {
    width: 100px;
    height: 36px
  }
}
</style>
