import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeflex/primeflex.css';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .use(router)
  .use(ToastService)
  .mount('#app');
