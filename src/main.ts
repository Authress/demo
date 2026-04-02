import { createApp } from 'vue';
import { ensureUserIsLoggedIn } from './authressClient';
import { demoBrand } from './demo-config';

import './assets/style.scss';
import 'bootstrap';
import './assets/styles/styles.scss';

import { router } from './router';

document.title = `${demoBrand.companyName} + Vue + TS`;

const app = createApp({});
app.use(router);
app.mount('#app');