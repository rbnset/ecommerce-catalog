<template>
  <Transition name="card" appear>
    <div class="card">
      <!-- Image column -->
      <div class="product-image">
        <img v-if="image" :src="image" alt="image-clothes" class="anim-fade" />
      </div>

      <!-- Content column -->
      <div class="detail-product anim-slide">
        <!-- Top -->
        <div class="top-card">
          <h2 class="title" :class="tone === 'navy' ? 'text-navy' : 'text-purple'">
            {{ title }}
          </h2>

          <div class="category">
            <p v-if="category">{{ category }}</p>
            <MRatingCircles :rate="rate" :tone="tone" />
          </div>
        </div>

        <!-- Mid (auto expands but won’t overlap bottom) -->
        <div class="mid-card">
          <p class="desc">{{ description }}</p>
        </div>

        <!-- Bottom (stays at bottom thanks to grid row layout) -->
        <div class="bottom-card">
          <span class="price" :class="tone === 'navy' ? 'text-navy' : 'text-purple'">
            $ {{ price.toFixed(2) }}
          </span>
          <div class="buttons">
            <button class="btn-buy" :class="tone === 'navy' ? 'btn-navy' : 'btn-purple'">Buy now</button>
            <button class="btn-next" :class="tone === 'navy' ? 'btn-navy-bdr' : 'btn-purple-bdr'"
              @click="$emit('next')">
              Next product
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import MRatingCircles from '@/components/molecules/MRatingCircles.vue';
defineProps<{
  image?: string;
  title: string;
  category?: string;
  description: string;
  price: number;
  rate: number | null;
  tone: 'navy' | 'purple';
  disabled?: boolean;
}>();
</script>

<style scoped>
/* ============ Card layout (desktop first) ============ */
.card {
  position: relative;
  z-index: 2;

  /* ukuran seperti referensi, tapi fleksibel */
  width: min(1100px, 80vw);
  min-height: 70vh;
  /* jaga tinggi minimum */
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 48px 32px;

  display: grid;
  grid-template-columns: 30% 65%;
  gap: 5%;
}

/* kiri: gambar */
.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 80%;
  max-height: 320px;
  object-fit: contain;
}

/* kanan: detail pakai grid 3 baris (auto | 1fr | auto) */
.detail-product {
  display: grid;
  grid-template-rows: auto 1fr auto;
  /* <-- inti solusi anti tumpang tindih */
  gap: 16px;
  min-height: 0;
  /* penting agar overflow terkelola */
}

/* top: judul + kategori + rating */
.top-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 12px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.25;
}

.category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.category p {
  color: #3f3f3f;
  font-size: 18px;
  font-weight: 400;
}

/* mid: deskripsi (biar fleksibel dan tidak nabrak bottom) */
.mid-card {
  overflow: auto;
  /* scroll kecil kalau teks panjang */
  min-height: 0;
  /* biar 1fr bisa mengecil */
}

.desc {
  color: #1e1e1e;
  font-size: 18px;
  font-weight: 400;
  text-align: justify;

  /* clamp aman tapi tidak memaksa overlap */
  display: -webkit-box;
  -webkit-line-clamp: 7;
  line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* bottom: garis atas + harga + tombol, POSISI NORMAL (bukan absolute/fixed) */
.bottom-card {
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  padding-top: 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  /* harga kiri, tombol kanan */
  gap: 16px;
  align-items: center;
}

.price {
  font-size: 28px;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 1.1rem;
}

.buttons .btn-buy,
.buttons .btn-next {
  height: 2.6rem;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  border-radius: 4px;
  padding: 0 18px;
}

/* ============ Tablet ============ */
@media (max-width: 1024px) {
  .card {
    grid-template-columns: 1fr;
    /* jadi satu kolom */
    gap: 20px;
    padding: 32px 24px;
  }

  .product-image img {
    max-height: 300px;
  }

  .desc {
    -webkit-line-clamp: 9;
    line-clamp: 9;
  }

  .bottom-card {
    grid-template-columns: 1fr;
  }

  .buttons {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

/* ============ Mobile ============ */
@media (max-width: 600px) {
  .card {
    min-height: auto;
    /* biar tingginya mengikuti konten */
    width: 92vw;
    padding: 16px 14px;
  }

  .product-image {
    margin: 8px 0;
  }

  .product-image img {
    width: 70%;
    max-height: 240px;
  }

  .title {
    font-size: 20px;
  }

  .category p {
    font-size: 16px;
  }

  .desc {
    font-size: 16px;
    -webkit-line-clamp: 10;
    line-clamp: 10;
  }

  /* bottom tetap dalam flow — TIDAK fixed */
  .bottom-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .buttons {
    flex-direction: column;
  }

  .buttons .btn-buy,
  .buttons .btn-next {
    width: 100%;
    height: 2.4rem;
  }
}
</style>
