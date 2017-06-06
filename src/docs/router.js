import Vue from 'vue';
import Router from 'vue-router';
import Page from './Page';
import ViewComponent from './ViewComponent';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Page',
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
			name: 'Component',
			component: ViewComponent,
			props: true,
		},
		{
			path: '/components/:componentName/implementations/:implementationName',
			name: 'Component',
			component: ViewComponent,
			props: true,
		},
	],
});
