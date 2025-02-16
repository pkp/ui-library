/** @type { import('@storybook/vue3').Preview } */

import {withThemeByDataAttribute} from '@storybook/addon-themes';
import {mockDateDecorator} from 'storybook-mock-date-decorator';
import PrimeVue from 'primevue/config';

import {setup} from '@storybook/vue3';
import GlobalMixins from '@/mixins/global.js';
import emitter from 'tiny-emitter/instance';

import stripUnsafeHtml from '@/directives/stripUnsafeHtml.js';

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

import ModalManager from '@/components/Modal/ModalManager.vue';

import VueScrollTo from 'vue-scrollto';

import '../src/styles/_import.less';
import '../src/styles/_global.less';
import '../src/styles/tw-theme-vars.css';
import {allModes} from './modes';
import {initialize, mswLoader} from 'msw-storybook-addon';

import {createPinia} from 'pinia';

const pinia = createPinia();

// Initialize MSW
initialize({
	onUnhandledRequest: (request) => {
		if (request.url.includes('://mock/')) {
			console.error(`Unhandled ${request.method} request to ${request.url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
		}
	},
});

setup((app) => {
	app.use(pinia);
	app.use(PrimeVue, {
		unstyled: true,
	});

	app.mixin(GlobalMixins);

	app.use(FloatingVue, {
		themes: {
			'pkp-tooltip': {
				$extend: 'tooltip',
				triggers: ['hover', 'focus'],
				delay: {
					show: 0,
					hide: 0,
				},
			},
		},
	});

	app.use(VueScrollTo);

	app.directive('strip-unsafe-html', stripUnsafeHtml);

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
		withThemeByDataAttribute({
			themes: {
				ltr: 'ltr',
				rtl: 'rtl',
			},
			defaultTheme: 'ltr',
		}),
		(story, {globals}) => {
			/** withThemebyDataAttribute decorator applies attribute after render, which
			 * is too late fort tinyMCE which needs to detect it on first render correctly
			 *
			 */
			document.body.setAttribute('dir', globals.theme || 'ltr');
			return story();
		},
		(story) => ({
			components: {story},
			template: '<div style="padding: 10px;"><story /></div>',
		}),
		/** Globally Available Dialog */
		(story) => ({
			setup() {},
			components: {story, ModalManager},
			template: `<div>			
				<ModalManager></ModalManager>
				<story />
			</div>`,
		}),
		mockDateDecorator,
	],
	parameters: {
		// remove default storybook padding as it likely cuts off modals
		layout: 'fullscreen',
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		direction: 'ltr',
		options: {
			storySort: {
				order: [
					'Guide',
					[
						'Page Architecture',
						'API Interactions',
						'Style',
						['Introduction'],
						'Vue Composition API',
						'Pinia Store',
						'Translation',
						'Technical Roadmap',
					],
					'Composables',
					'Components',
					'Forms',
					'ListPanel',
					'Pages',
				],
			},

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
				large: {name: 'Large', styles: {width: '1280px', height: '1000px'}},
				/** For scrollable scenarios */
				largeHeight: {
					name: 'Large',
					styles: {width: '1280px', height: '1600px'},
				},
			},
		},
		chromatic: {
			modes: {
				desktop: allModes['desktop'],
				'desktop rtl': allModes['desktop rtl'],
			},
		},
	},
};

export default preview;
