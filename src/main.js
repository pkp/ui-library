// Tinymce must be loaded before Vue
import 'tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/skins/lightgray/skin.min.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import GlobalMixins from '@/mixins/global.js';
import VTooltip from 'v-tooltip';
import VueScrollTo from 'vue-scrollto';
import Tabs from 'vue-tabs-component';

Vue.use(VTooltip, {defaultTrigger: 'click'});
Vue.use(VueScrollTo);
Vue.use(Tabs);

// Add the global event bus, which would be part of /public/globals.js if it
// didn't require Vue to be imported
window.pkp.eventBus = new Vue();

Vue.config.productionTip = false;

Vue.mixin(GlobalMixins);

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
