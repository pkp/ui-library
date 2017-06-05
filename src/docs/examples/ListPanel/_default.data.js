import Notes from 'raw-loader!./_default.md';
import WithCount from './WithCount.vue';
import WithCountRaw from '!!raw-loader!./WithCount.vue';
import WithSearch from './WithSearch.vue';
import WithSearchRaw from '!!raw-loader!./WithSearch.vue';

export default {
	baseData: function () {
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
			filterParams: {},
			searchPhrase: '',
			isLoading: false,
			isSearching: false,
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
	},
	dataDesc: {
		id: 'Used internally. Do not modify.',
		collection: '`items`: Array containing items in the list. `maxItems:` count of total available items',
		filterParams: 'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.',
		searchPhrase: 'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.',
		isLoading: '',
		isSearching: '',
		isOrdering: '',
		isFilterVisible: '',
		count: 'Number of items to fetch per request.',
		offset: 'Tracks the number of items visible for load more requests.',
		apiPath: 'Optional. If present, `GET` requests can be fired off with `ListPanel.get()`',
		getParams: 'Default parameters to pass with `GET` requests when no filters or search parameters exist.',
		i18n: '',
		lazyLoad: 'If `true`, it will call `ListPanel.get()` when mounted.',
		_lastGetRequest: 'Internal tracking to to ensure only the last `ListPanel.get()` call is processed.',
	},
	notes: Notes,
	examples: {
		WithCount: {
			label: 'with Count',
			component: WithCount,
			componentRaw: WithCountRaw,
		},
		WithSearch: {
			label: 'with Search',
			component: WithSearch,
			componentRaw: WithSearchRaw,
		},
	},
};
