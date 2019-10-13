import Vue from 'vue';
import Router from 'vue-router';
import Page from './Page';
import ViewComponent from './ViewComponent';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Page,
		},
		{
			path: '/pages/:page',
			name: 'Page',
			component: Page,
			props: true,
		},
		{
			path: '/components/:componentName',
			name: 'Component',
			component: ViewComponent,
			props: true,
		},
		{
			path: '/components/:componentName/examples/:exampleName',
			name: 'ComponentExample',
			component: ViewComponent,
			props: true,
		},
		{
			path: '/components/:componentName/implementations/:implementationName',
			name: 'ComponentImplementation',
			component: ViewComponent,
			props: true,
		},
	],
});
