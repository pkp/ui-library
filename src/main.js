// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import GlobalMixins from './mixins/global.js';
import App from './docs/App';
import router from './docs/router';

Vue.mixin(GlobalMixins);

Vue.config.productionTip = false;

window.pkp = {
	eventBus: new Vue(),
	/**
	 * Dummy global function used by components
	 */
	userHasRole: function (role) {
		return true;
	},
};

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
});
