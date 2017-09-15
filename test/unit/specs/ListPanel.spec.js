import Vue from 'vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';

// Test data
ListPanel.data = function () {
	return {
		id: 'ExampleListPanel',
		collection: {
			items: [
				{title: 'Item one'},
				{title: 'Item two'},
				{title: 'Item three'},
			],
			maxItems: 10,
		},
		activeFilters: {},
		searchPhrase: '',
		isLoading: false,
		isOrdering: false,
		isFilterVisible: false,
		count: 20,
		offset: 0,
		apiPath: '',
		getParams: {},
		i18n: {
			title: 'Example List Panel',
		},
		lazyLoad: false,
		_lastGetRequest: null,
	};
};

describe('ListPanel.vue', () => {
	it('should render correct contents', () => {
		const Constructor = Vue.extend(ListPanel);
		const vm = new Constructor().$mount();
		expect(vm.$el.querySelector('.pkpListPanel__title').textContent)
			.to.equal('Example List Panel');
	});
});
