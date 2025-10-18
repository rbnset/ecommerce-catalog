import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';

import { createHead } from '@vueuse/head';
const head = createHead();

createApp(App).use(router).use(head).mount('#app');
