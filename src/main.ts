import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { authressLoginClient } from './authressClient';

import './style.css';
import 'bootstrap';
import './styles/styles.scss';

import Home from './routes/home.vue';
import ListReportsScreen from './routes/listReportsScreen.vue';
import ReportScreen from './routes/reportScreen.vue';
import Unauthorized from './routes/unauthorized.vue';

const ensureUserIsLoggedIn = async (next: () => void) => {
  // const userIsLoggedIn = await authressLoginClient.userSessionExists();
  // if (!userIsLoggedIn) {
  //   console.log('User is not logged on the protected route, redirecting to unauthorized');
  //   next('Unauthorized');
  //   return;
  // }
  next();
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    {
      path: '/unauthorized', component: Unauthorized,
      beforeEnter: async (to, from, next) => {
        const userIsLoggedIn = await authressLoginClient.userSessionExists();
        if (userIsLoggedIn) {
          console.log('User is already logged in, redirect them to home.');
          next('/');
          return;
        }
        next();
      }
    },
    {
      path: '/reports',
      name: 'ReportList',
      component: ListReportsScreen,
      beforeEnter: async (to, from, next) => {
        await ensureUserIsLoggedIn(next);
      }
    },
    {
      path: '/reports/:reportId',
      name: 'Report',
      component: ReportScreen,
      beforeEnter: async (to, from, next) => {
        await ensureUserIsLoggedIn(next);
      }
    }
  ]
});

const app = createApp({});
app.use(router);
app.mount('#app');