import { createApp } from 'vue';
import { ensureUserIsLoggedIn } from './authressClient';

import './assets/style.css';
import 'bootstrap';
import './assets/styles/styles.scss';

import { router } from './router';

const app = createApp({});
app.use(router);
app.mount('#app');