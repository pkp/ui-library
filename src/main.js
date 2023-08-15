import {createApp, h} from 'vue';
import emitter from 'tiny-emitter/instance';

//import './styles/style.css';
import App from './App.vue';

import router from './router';

import GlobalMixins from '@/mixins/global.js';
//import VueAnnouncer from 'vue-announcer';
//import VModal from 'vue-js-modal';
//import VTooltip from 'v-tooltip';
//import VueScrollTo from 'vue-scrollto';

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

//Vue.use(VueAnnouncer);
/*Vue.use(VModal, {
	dynamic: true,
	injectModalsContainer: true,
});*/
//Vue.use(VTooltip, {defaultTrigger: 'click'});
//Vue.use(VueScrollTo);

export default window.pkp.eventBus = {
	$on: (...args) => emitter.on(...args),
	$once: (...args) => emitter.once(...args),
	$off: (...args) => emitter.off(...args),
	$emit: (...args) => emitter.emit(...args),
};

const vueApp = createApp({
	data() {
		/**
		 * Fake data that is passed to the root component
		 *
		 * This data is usually added to every PageComponent by the
		 * PKPTemplateManager class in OJS, OMP or OPS.
		 */

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
	render: () => h(App),
});

vueApp.config.productionTip = false;

vueApp.mixin(GlobalMixins);

vueApp.component('Badge', Badge);
vueApp.component('Dropdown', Dropdown);
vueApp.component('Icon', Icon);
vueApp.component('Notification', Notification);
vueApp.component('Panel', Panel);
vueApp.component('PanelSection', PanelSection);
vueApp.component('PkpButton', PkpButton);
vueApp.component('PkpHeader', PkpHeader);
vueApp.component('Spinner', Spinner);
vueApp.component('Step', Step);
vueApp.component('Steps', Steps);
vueApp.component('Tab', Tab);
vueApp.component('Tabs', Tabs);

vueApp.use(router);

vueApp.mount('#app');
