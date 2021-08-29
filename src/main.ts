import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n';
import { globalComponentSize } from '/@/utils/componentSize';

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import '/@/theme/index.scss';
import mitt from 'mitt';
import screenShort from 'vue-web-screen-shot';
import VueGridLayout from 'vue-grid-layout';

const app = createApp(App);

// @ts-ignore
import contextmenu from 'vue3-contextmenu'
import 'vue3-contextmenu/dist/vue3-contextmenu.css'
app.use(contextmenu)

app
	.use(router)
	.use(store, key)
	.use(ElementPlus, { i18n: i18n.global.t, size: globalComponentSize })
	.use(i18n)
	.use(screenShort, { enableWebRtc: false })
	.use(VueGridLayout)
	.mount('#app');

app.config.globalProperties.mittBus = mitt();

directive(app);
