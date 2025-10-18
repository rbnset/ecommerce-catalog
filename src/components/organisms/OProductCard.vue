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

        <!-- Mid -->
        <div class="mid-card">
          <p class="desc">{{ description }}</p>
        </div>

        <!-- Bottom -->
        <div class="bottom-card">
          <span class="price" :class="tone === 'navy' ? 'text-navy' : 'text-purple'">$ {{ price.toFixed(2) }}</span>
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
/* Card overall */
.card {
  position: relative;
  z-index: 2;
  width: 80vw;
  height: 70vh;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 48px 32px;

  display: grid;
  grid-template-columns: 30% 65%;
  gap: 5%;
}

/* Image column */
.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 80%;
  max-height: 283px;
  object-fit: contain;
}

/* Content column */
.detail-product {
  position: relative;
  width: 100%;
}

.top-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 28px;
  font-weight: 600;
}

.category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem auto;
}

.category p {
  color: #3f3f3f;
  font-size: 18px;
  font-weight: 400;
}

/* Description */
.mid-card {
  margin-top: 1rem;
}

.desc {
  color: #1e1e1e;
  font-size: 20px;
  font-weight: 400;
  text-align: justify;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
}

/* Bottom row fixed to bottom area */
.bottom-card {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.price {
  font-size: 28px;
  font-weight: 600;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1.1rem;
}

.buttons .btn-buy,
.buttons .btn-next {
  width: 100%;
  height: 2.6rem;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
}

/* Responsive */
@media only screen and (max-width: 600px) {
  .card {
    height: 90vh;
    padding: 1rem;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-image {
    margin: 1rem 0;
  }

  .product-image img {
    width: 70%;
    max-height: 260px;
  }

  .title {
    font-size: 20px;
  }

  .category p {
    font-size: 16px;
  }

  .desc {
    font-size: 16px;
    -webkit-line-clamp: 8;
    line-clamp: 8;
  }

  .bottom-card {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    background: #fff;
    padding: 1rem;
  }

  .buttons {
    flex-direction: column;
  }

  .buttons .btn-buy,
  .buttons .btn-next {
    width: 72%;
    height: 2.3rem;
    margin: 0 auto;
  }
}
</style>
