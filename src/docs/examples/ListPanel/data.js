import WithCount from './WithCount.vue';
import WithCountRaw from '!!raw-loader!./WithCount.vue';
import WithSearch from './WithSearch.vue';
import WithSearchRaw from '!!raw-loader!./WithSearch.vue';
import WithLoadMore from './WithLoadMore.vue';
import WithLoadMoreRaw from '!!raw-loader!./WithLoadMore.vue';
import WithActions from './WithActions.vue';
import WithActionsRaw from '!!raw-loader!./WithActions.vue';
import WithNotice from './WithNotice.vue';
import WithNoticeRaw from '!!raw-loader!./WithNotice.vue';
import WithOrdering from './WithOrdering.vue';
import WithOrderingRaw from '!!raw-loader!./WithOrdering.vue';
import SubmissionsListPanel from './implementations/ExampleSubmissionsListPanel.vue';
import SubmissionsListPanelRaw from '!!raw-loader!./../../../components/ListPanel/submissions/SubmissionsListPanel.vue';

export default {
	baseData: function () {
		return {
			id: 'ExampleListPanel',
			collection: {
				items: [
					{id: 1, title: 'Item one'},
					{id: 2, title: 'Item two'},
					{id: 3, title: 'Item three'},
				],
				maxItems: 10,
			},
			filterParams: {},
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
	},
	dataDesc: {
		id: 'Used internally. Do not modify.',
		collection: '`items`: Array containing items in the list. `maxItems:` count of total available items',
		filterParams: 'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.',
		searchPhrase: 'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.',
		isLoading: '',
		isOrdering: '',
		isFilterVisible: '',
		count: 'Number of items to fetch per request.',
		offset: 'Tracks the number of items visible for load more requests.',
		apiPath: 'Optional. If present, `GET` requests can be fired off with `ListPanel.get()`',
		getParams: 'Default parameters to pass with `GET` requests when no filters or search parameters exist.',
		i18n: '',
		lazyLoad: 'If `true`, it will call `ListPanel.get()` when mounted.',
		_lastGetRequest: 'Internal tracking to to ensure only the last `ListPanel.get()` call is processed.',
		// Selectable
		inputName: 'Name for the checkbox field',
		// SubmissionsListPanel
		addUrl: 'Url to the submission wizard',
		infoUrl: 'Link to fetch the Information Center content in the modal. The string `__id__` is replaced with the submission ID before being called.',
	},
	examples: {
		'with-count': {
			label: 'with Count',
			component: WithCount,
			componentRaw: WithCountRaw,
		},
		'with-load-more': {
			label: 'with Load More',
			component: WithLoadMore,
			componentRaw: WithLoadMoreRaw,
		},
		'with-actions': {
			label: 'with Actions',
			component: WithActions,
			componentRaw: WithActionsRaw,
		},
		'with-search': {
			label: 'with Search',
			component: WithSearch,
			componentRaw: WithSearchRaw,
		},
		'with-notice': {
			label: 'with Notice',
			component: WithNotice,
			componentRaw: WithNoticeRaw,
		},
		'with-ordering': {
			label: 'with Ordering',
			component: WithOrdering,
			componentRaw: WithOrderingRaw,
		},
	},
	implementations: {
		'SubmissionsListPanel': {
			label: 'SubmissionsListPanel',
			component: SubmissionsListPanel,
			componentRaw: SubmissionsListPanelRaw,
		},
	},
};
