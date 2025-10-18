import { createRouter, createWebHistory } from 'vue-router';
import ProductPage from '@/pages/ProductPage.vue';


const routes = [
  { path: '/', name: 'home', component: ProductPage },
  { path: '/product/:id(\\d+)?', name: 'product', component: ProductPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
