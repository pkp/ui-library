/** @type { import('@storybook/vue3-vite').Preview } */

import {withThemeByDataAttribute} from '@storybook/addon-themes';
import {mockDateDecorator} from 'storybook-mock-date-decorator';
import PrimeVue from 'primevue/config';

import {setup} from '@storybook/vue3-vite';
import GlobalMixins from '@/mixins/global.js';
import emitter from 'tiny-emitter/instance';

import stripUnsafeHtml from '@/directives/stripUnsafeHtml.js';

import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import PkpDropdownMenu from '@/frontend/components/PkpDropdownMenu/PkpDropdownMenu.vue';
import FloatingVue from 'floating-vue';

import ModalManager from '@/components/Modal/ModalManager.vue';

import VueScrollTo from 'vue-scrollto';

import '../src/styles/_import.less';
import '../src/styles/_global.less';
import '../src/styles/tw-theme-vars.css';
// Frontend CSS removed - imported per-story in Frontend/ stories
import {allModes} from './modes';
import {initialize, mswLoader} from 'msw-storybook-addon';
import {injectIconSprite} from './iconSprite';

import {createPinia, setActivePinia} from 'pinia'; // Updated import

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

	app.component('PkpIcon', PkpIcon);
	app.component('PkpTextarea', PkpTextarea);
	app.component('PkpDropdownMenu', PkpDropdownMenu);

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
		// Inject SVG icon sprite for PkpIcon component
		(story) => {
			injectIconSprite();
			return story();
		},
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
		(story) => {
			// New decorator for fresh Pinia per story
			setActivePinia(createPinia());
			return story();
		},
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
					'Frontend',
				],
			},
		},
		viewport: {
			options: {
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
