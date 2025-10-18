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
  grid-template-columns: 30% 65%;
  gap: 5%;
  background: var(--color-surface);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  padding: 48px 32px;
  width: min(1100px, 80vw);
  min-height: 70vh;
}

.sk-image {
  border-radius: 10px;
  background: #e6e6e6;
  height: 320px;
  align-self: center
}

/* kanan meniru 3 baris */
.sk-body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 0;
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
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
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

/* shimmer */
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

/* Tablet */
@media (max-width: 1024px) {
  .sk-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 32px 24px;
  }

  .sk-image {
    height: 300px;
  }

  .sk-bottom {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .sk-card {
    width: 92vw;
    min-height: auto;
    padding: 16px 14px;
  }

  .sk-image {
    height: 240px;
  }

  .sk-btn {
    height: 36px;
    width: 100%;
  }

  .sk-bottom {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
