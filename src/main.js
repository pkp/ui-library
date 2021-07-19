import Vue from 'vue';
import App from './App.vue';
import router from './router';

import GlobalMixins from '@/mixins/global.js';
import VModal from 'vue-js-modal';
import VTooltip from 'v-tooltip';
import VueScrollTo from 'vue-scrollto';

import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import Tab from '@/components/Tabs/Tab.vue';
import Tabs from '@/components/Tabs/Tabs.vue';

Vue.use(VModal, {
	dynamic: true,
	injectModalsContainer: true
});
Vue.use(VTooltip, {defaultTrigger: 'click'});
Vue.use(VueScrollTo);

// Global event bus
window.pkp.eventBus = new Vue();

Vue.config.productionTip = false;

Vue.mixin(GlobalMixins);

Vue.component('Badge', Badge);
Vue.component('PkpButton', PkpButton);
Vue.component('Icon', Icon);
Vue.component('Spinner', Spinner);
Vue.component('Tab', Tab);
Vue.component('Tabs', Tabs);

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
