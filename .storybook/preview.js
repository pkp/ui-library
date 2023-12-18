/** @type { import('@storybook/vue3').Preview } */

import {setup} from '@storybook/vue3';

import GlobalMixins from '@/mixins/global.js';
import emitter from 'tiny-emitter/instance';

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
import FloatingVue from 'floating-vue';

import VueScrollTo from 'vue-scrollto';

import '../src/styles/_import.less';
import '../src/styles/_global.less';
import {allModes} from './modes';
import {initializeRTL} from 'storybook-addon-rtl';
import {initialize, mswLoader} from 'msw-storybook-addon';

import {createPinia} from 'pinia';

const pinia = createPinia();

initializeRTL();
// Initialize MSW
initialize({
	onUnhandledRequest: ({method, url}) => {
		if (url.pathname.includes('://mock/')) {
			console.error(`Unhandled ${method} request to ${url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
		}
	},
});

setup((app) => {
	app.use(pinia);
	app.mixin(GlobalMixins);

	app.use(FloatingVue, {
		themes: {
			'pkp-tooltip': {
				$extend: 'tooltip',
				triggers: ['click'],
				delay: {
					show: 0,
					hide: 0,
				},
			},
		},
	});

	app.use(VueScrollTo);

	app.component('Badge', Badge);
	app.component('Dropdown', Dropdown);
	app.component('Icon', Icon);
	app.component('Notification', Notification);
	app.component('Panel', Panel);
	app.component('PanelSection', PanelSection);
	app.component('PkpButton', PkpButton);
	app.component('PkpHeader', PkpHeader);
	app.component('Spinner', Spinner);
	app.component('Step', Step);
	app.component('Steps', Steps);
	app.component('Tab', Tab);
	app.component('Tabs', Tabs);

	console.log('preview running');
	window.pkp.eventBus = {
		$on: (...args) => emitter.on(...args),
		$once: (...args) => emitter.once(...args),
		$off: (...args) => emitter.off(...args),
		$emit: (...args) => emitter.emit(...args),
	};
});

const preview = {
	loaders: [mswLoader],
	decorators: [
		(story) => ({
			components: {story},
			template: '<div style="margin: 3em;"><story /></div>',
		}),
	],
	parameters: {
		actions: {argTypesRegex: '^on[A-Z].*'},
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		direction: 'ltr',
		options: {
			/*storySort: (a, b) => {
				if (a.id.includes('introduction--docs')) {
					return -1;
				}
				if (b.id.includes('introduction--docs')) {
					return 1;
				}

				return a.id === b.id
					? 0
					: a.id.localeCompare(b.id, undefined, {numeric: true});
			},*/
		},
		viewport: {
			viewports: {
				large: {name: 'Large', styles: {width: '1024px', height: '1000px'}},
				/** For scrollable scenarios */
				largeHeight: {
					name: 'Large',
					styles: {width: '1024px', height: '1500px'},
				},
			},
		},
		chromatic: {
			modes: {
				desktop: allModes['desktop'],
			},
		},
	},
};

export default preview;
