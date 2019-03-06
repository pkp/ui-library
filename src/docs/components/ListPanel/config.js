import submissionsListPanel from './helpers/submissionsListPanel';
import catalogSubmissionsListPanel from './helpers/catalogSubmissionsListPanel';

export let props = {
	apiUrl: '',
	count: 20,
	filters: [],
	getParams: {},
	id: '',
	isSidebarVisible: false,
	items: [],
	itemsMax: 0,
	lazyLoad: false,
	offset: 0,
	searchPhrase: '',
	title: 'List Panel',
	i18n: {}
};

export const propDocs = [
	{
		key: 'apiUrl',
		description:
			'Optional. If present, searching, filtering and other tasks will be performed through a `GET` request to this URL.'
	},
	{
		key: 'count',
		description: 'Number of items to fetch per request.'
	},
	{
		key: 'id',
		description: 'Used internally. Do not modify.'
	},
	{
		key: 'filters',
		description:
			'Filters that can be applied to this list to adjust what items are shown.'
	},
	{
		key: 'getParams',
		description:
			'Default parameters to pass with `GET` requests when no filters or search parameters exist.'
	},
	{
		key: 'isSidebarVisible',
		description: ''
	},
	{
		key: 'i18n',
		description: ''
	},
	{
		key: 'items',
		description: 'Array containing items in the list'
	},
	{
		key: 'itemsMax',
		description: 'Count of total available items in the list'
	},
	{
		key: 'lazyLoad',
		description: 'If `true`, it will call `ListPanel.get()` when mounted.'
	},
	{
		key: 'offset',
		description: 'Tracks the number of items visible for load more requests.'
	},
	{
		key: 'searchPhrase',
		description:
			'Modifying this property will automatically trigger a `GET` request if an `apiUrl` is set.'
	}
];

export const dataDocs = [
	{
		key: 'activeFilters',
		description:
			'Modifying this property will automatically trigger a `GET` request if an `apiUrl` is set.'
	},
	{
		key: 'isLoading',
		description: ''
	},
	{
		key: 'isOrdering',
		description: ''
	},
	{
		key: 'latestGetRequest',
		description:
			'Internal tracking to to ensure only the last `ListPanel.get()` call is processed.'
	}
];

/**
 * SubmissionsListPanel (OJS)
 *
 * Data and documentation for the SubmissionsListPanel component in OJS, which
 * extends the base ListPanel.
 */
export const propsSubmissionsListPanel = {
	...props,
	...submissionsListPanel,
	addUrl: 'https://example.org',
	infoUrl: 'https://example.org',
	assignParticipantUrl: 'https://example.org'
};

export const propsDocsSubmissionsListPanel = [
	{
		key: 'addUrl',
		description: 'Url to the submission wizard'
	},
	{
		key: 'infoUrl',
		description:
			'Link to fetch the Information Center content in the modal. The string `__id__` is replaced with the submission ID before the URL is called.'
	},
	{
		key: 'assignParticipantUrl',
		description:
			'Link to fetch the assign participant form in a modal. The strings `__id__` and `__stageId__` are replaced before the URL is called'
	},
	{
		key: 'csrfToken',
		description:
			'A CSRF token that is sent with any `POST`, `PUT` or `DELETE` request to prevent cross-site request forgery.'
	}
];

/**
 * CatalogSubmissionsListPanel (OMP)
 *
 * Data and documentation for the CatalogSubmissionsListPanel component, which
 * extends the base ListPanel.
 */
export const dataCatalogSubmissionsListPanel = {
	...catalogSubmissionsListPanel,
	catalogEntryUrl: 'https://example.org',
	catalogSortBy: 'datePublished', // ORDERBY_DATE_PUBLISHED
	catalogSortDir: 1 // SORT_DIRECTION_ASC
};

export const dataDocsCatalogSubmissionsListPanel = [
	{
		key: 'catalogEntryUrl',
		description:
			'URL to the public catalog entry page. The string `__id__` is replaced with the submission ID before the URL is called.'
	},
	{
		key: 'catalogSortBy',
		description:
			'Value in press setting `catalogSortOption`. Default: `ORDERBY_DATE_PUBLISHED`'
	},
	{
		key: 'catalogSortDir',
		description:
			'Value in press setting `catalogSortDir`. Default: `SORT_DIRECTION_ASC`'
	},
	{
		key: 'csrfToken',
		description:
			'A CSRF token that is sent with any `POST`, `PUT` or `DELETE` request to prevent cross-site request forgery.'
	}
];

export default {
	props,
	propDocs,
	dataDocs,
	propsSubmissionsListPanel,
	propsDocsSubmissionsListPanel,
	dataCatalogSubmissionsListPanel,
	dataDocsCatalogSubmissionsListPanel
};
