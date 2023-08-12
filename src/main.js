import Vue from 'vue';
import App from './App.vue';
import router from './router';

import GlobalMixins from '@/mixins/global.js';
import VueAnnouncer from 'vue-announcer';
import VModal from 'vue-js-modal';
import VTooltip from 'v-tooltip';
import VueScrollTo from 'vue-scrollto';

import Badge from '@/components/Badge/Badge.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import Icon from '@/components/Icon/Icon.vue';
import Notification from '@/components/Notification/Notification.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import Step from '@/components/Steps/Step.vue';
import Steps from '@/components/Steps/Steps.vue';
import Tab from '@/components/Tabs/Tab.vue';
import Tabs from '@/components/Tabs/Tabs.vue';

Vue.use(VueAnnouncer);
Vue.use(VModal, {
	dynamic: true,
	injectModalsContainer: true,
});
Vue.use(VTooltip, {defaultTrigger: 'click'});
Vue.use(VueScrollTo);

// Global event bus
window.pkp.eventBus = new Vue();

Vue.config.productionTip = false;

Vue.mixin(GlobalMixins);

Vue.component('Badge', Badge);
Vue.component('Dropdown', Dropdown);
Vue.component('Icon', Icon);
Vue.component('Notification', Notification);
Vue.component('Panel', Panel);
Vue.component('PanelSection', PanelSection);
Vue.component('PkpButton', PkpButton);
Vue.component('PkpHeader', PkpHeader);
Vue.component('Spinner', Spinner);
Vue.component('Step', Step);
Vue.component('Steps', Steps);
Vue.component('Tab', Tab);
Vue.component('Tabs', Tabs);

new Vue({
	router,

	/**
	 * Fake data that is passed to the root component
	 *
	 * This data is usually added to every PageComponent by the
	 * PKPTemplateManager class in OJS, OMP or OPS.
	 */
	data() {
		return {
			/**
			 * File genres
			 */
			fileGenres: [
				{
					id: 1,
					name: 'Book Manuscript',
					isPrimary: true,
				},
				{
					id: 2,
					name: 'Chapter Manuscript',
					isPrimary: true,
				},
				{
					id: 3,
					name: 'Preface',
				},
				{
					id: 4,
					name: 'Index',
				},
				{
					id: 5,
					name: 'Glossary',
				},
				{
					id: 7,
					name: 'Prospectus',
				},
				{
					id: 11,
					name: 'Table',
				},
				{
					id: 8,
					name: 'Figure',
				},
				{
					id: 9,
					name: 'Audio',
				},
				{
					id: 10,
					name: 'Other',
				},
			],
			/**
			 * TinyMCE configuration
			 */
			tinyMCE: {
				skinUrl: 'styles/tinymce',
			},
		};
	},
	render: (h) => h(App),
}).$mount('#app');
