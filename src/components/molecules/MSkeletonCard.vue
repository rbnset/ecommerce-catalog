<template>
  <div class="sk-card" role="status" aria-busy="true" aria-live="polite" aria-label="Loading product">
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
/* Samakan tinggi tombol skeleton dengan tombol mobile di page (36px) */
:root {
  --btn-height-mobile: 36px;
  /* ubah bila perlu */
}

/* ====== Wrapper: disamakan dengan .card di page ====== */
.sk-card {
  position: relative;
  z-index: 2;
  width: min(1100px, 80vw);
  background: var(--color-surface, #fff);
  border-radius: 10px;
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1));
  padding: 48px 32px;
  margin: 0;

  /* Layout konten kartu produk: gambar kiri, detail kanan */
  display: grid;
  grid-template-columns: 30% 65%;
  gap: 5%;
  contain: layout paint;
  /* kurangi reflow saat konten real masuk */
}

/* ====== Tablet: ikuti page (padding mengecil, stack 1 kolom) ====== */
@media (max-width: 1024px) {
  .sk-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 32px 24px;
  }
}

/* ====== Mobile: ikuti page (width & padding) ====== */
@media (max-width: 600px) {
  .sk-card {
    width: 92vw;
    padding: 16px 14px;
  }
}

/* ====== Thumbnail skeleton (stabil) ====== */
.sk-image {
  border-radius: 10px;
  background: #e6e6e6;
  width: 100%;
  aspect-ratio: 4 / 3;
  align-self: center;
}

@supports not (aspect-ratio: 4 / 3) {
  .sk-image {
    height: 320px;
  }
}

/* ====== Body kanan ====== */
.sk-body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 0;
}

.sk-line {
  height: 14px;
  border-radius: 999px;
  background: #e6e6e6;
}

.sk-title {
  height: 22px;
}

.w-60 {
  width: 60%;
}

/* ====== Bottom row (harga + tombol) ====== */
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
  background: #e6e6e6;
}

.sk-actions {
  display: flex;
  gap: var(--space-3, 12px);
  flex-wrap: wrap;
}

.sk-btn {
  width: 120px;
  height: 40px;
  border-radius: var(--radius-md, 8px);
  background: #e6e6e6;
}

.sk-btn.outline {
  width: 140px;
}

/* ====== Mobile tombol full-width & tinggi 36px (sejalan page) ====== */
@media (max-width: 600px) {
  .sk-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .sk-btn,
  .sk-btn.outline {
    width: 100%;
    height: var(--btn-height-mobile);
  }
}

/* ====== Shimmer ====== */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, #f5f5f5, transparent);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Hormati preferensi reduced motion */
@media (prefers-reduced-motion: reduce) {
  .shimmer::after {
    animation: none;
  }
}
</style>
