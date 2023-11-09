import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/home.vue';
import ListReportsScreen from './routes/listReportsScreen.vue';
import Unauthorized from './components/unauthorized.vue';

export const router = createRouter({
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
