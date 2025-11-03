import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import ProductPage from '@/components/pages/ProductPage.vue';

const routes = [
  // 1) Slug route harus terdaftar dulu (lebih spesifik untuk nama)
  { path: '/product/:slug', name: 'product.slug', component: ProductPage },

  // 2) Backward-compat: route lama berbasis id -> redirect ke slug
  { path: '/product/:id(\\d+)', name: 'product.id', component: ProductPage },

  // 3) Home -> product pertama
  { path: '/', name: 'home', component: ProductPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

/**
 * Redirect 301: /product/18 -> /product/<slug-with-id>
 * Kita tidak fetch di guard ini; slug akan dibentuk di page ketika data sudah ada.
 * Namun agar benar-benar 301 (history replace), kita akan tangani di halaman setelah fetch.
 * (Lihat ProductPage patch di bawah).
 */
export default router;
