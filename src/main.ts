import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { ensureUserIsLoggedIn } from './authressClient';

import './assets/style.css';
import 'bootstrap';
import './assets/styles/styles.scss';

import Home from './components/home.vue';
import ListReportsScreen from './routes/listReportsScreen.vue';
import ReportScreen from './routes/reportScreen.vue';
import Unauthorized from './components/unauthorized.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/unauthorized', component: Unauthorized, },
    {
      path: '/reports/:reportId?',
      name: 'ReportList',
      component: ListReportsScreen,
      beforeEnter: async (to, from, next) => {
        /************* Route Guard *************/

        // await ensureUserIsLoggedIn(next);

        /**************************************/
        next();
      }
    }
  ]
});

const app = createApp({});
app.use(router);
app.mount('#app');