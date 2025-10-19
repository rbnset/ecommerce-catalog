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
          <MClampText :text="description" :lines="7" :lines-tablet="9" :lines-mobile="10" />
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
import MClampText from '@/components/molecules/MClampText.vue';

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
  margin: 0;

  width: min(1100px, 80vw);
  min-height: 70vh;
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
  gap: 16px;
  min-height: 0;
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

/* mid: deskripsi (fleksibel, tidak nabrak bottom) */
.mid-card {
  overflow: auto;
  min-height: 0;
}

/* bottom: garis atas + harga + tombol (POSISI NORMAL, bukan absolute/fixed) */
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

/* Utility warna (sesuai tokens/globalmu) */
.text-navy {
  color: #002772;
}

.text-purple {
  color: #720060;
}

.btn-navy {
  background-color: #002772;
  border: 3px solid #002772;
  color: #fff;
}

.btn-purple {
  background-color: #720060;
  border: 3px solid #720060;
  color: #fff;
}

.btn-navy-bdr {
  border: 3px solid #002772;
  color: #002772;
  background: #fff;
}

.btn-purple-bdr {
  border: 3px solid #720060;
  color: #720060;
  background: #fff;
}


/* ============ Tablet (keep bottom same as desktop) ============ */
@media (max-width: 1024px) {
  .card {
    /* Tablet: 1 kolom (gambar di atas, detail di bawah) tetap OK */
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 32px 24px;
  }

  .product-image img {
    max-height: 300px;
  }

  /* ⬇️ BOTTOM SAMA DENGAN DESKTOP: 2 kolom (harga kiri, tombol kanan) */
  .bottom-card {
    grid-template-columns: 1fr auto;
    /* <— ini kuncinya */
    align-items: center;
    gap: 16px;
  }

  /* Tombol tetap sejajar kanan, tanpa wrap di tablet */
  .buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    flex-wrap: nowrap;
    /* <— cegah turun baris */
  }

  /* Sedikit kecilkan agar muat di tablet */
  .buttons .btn-buy,
  .buttons .btn-next {
    height: 2.4rem;
    font-size: 16px;
    padding: 0 14px;
  }

  .price {
    font-size: 24px;
  }
}


/* ============ Mobile ============ */
@media (max-width: 600px) {
  .card {
    min-height: auto;
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
