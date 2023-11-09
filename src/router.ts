/************* UI Router *************

This is the UI Router. It lists the routes for the website that runs the report portal.

Below is a list of routes with the component for the page.

**************************************/

import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './components/home.vue';
import Unauthorized from './components/unauthorized.vue';
import Reports from './routes/listReportsScreen.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },

    { path: '/unauthorized', component: Unauthorized, },

    {
      path: '/reports/:reportId?',
      name: 'ReportList',
      component: Reports,
      beforeEnter: async (to, from, next) => {
        /************* Route Guard *************/
        // await ensureUserIsLoggedIn(next);
        /**************************************/
        next();
      }
    }
  ]
});
