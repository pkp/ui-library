import submissionsListPanel from './helpers/submissionsListPanel';
import catalogSubmissionsListPanel from './helpers/catalogSubmissionsListPanel';

export let props = {};

export let data = {
	id: '',
	items: [],
	itemsMax: null,
	searchPhrase: '',
	isLoading: false,
	isOrdering: false,
	isFilterVisible: false,
	count: 20,
	offset: 0,
	apiPath: '',
	getParams: {},
	activeFilters: {},
	noticeType: '',
	i18n: {
		title: 'List Panel'
	},
	lazyLoad: false,
	latestGetRequest: null
};

export const propDocs = [];

export const dataDocs = [
	{
		key: 'id',
		description: 'Used internally. Do not modify.'
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
		key: 'activeFilters',
		description:
			'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.'
	},
	{
		key: 'searchPhrase',
		description:
			'Modifying this property will automatically trigger a `GET` request if an `apiPath` is set.'
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
		key: 'isFilterVisible',
		description: ''
	},
	{
		key: 'count',
		description: 'Number of items to fetch per request.'
	},
	{
		key: 'offset',
		description: 'Tracks the number of items visible for load more requests.'
	},
	{
		key: 'apiPath',
		description:
			'Optional. If present, `GET` requests can be fired off with `ListPanel.get()`'
	},
	{
		key: 'getParams',
		description:
			'Default parameters to pass with `GET` requests when no filters or search parameters exist.'
	},
	{
		key: 'noticeType',
		description:
			'The type of notice being displayed. Default is an empty string. Options: `info`, `warning`.'
	},
	{
		key: 'i18n',
		description: ''
	},
	{
		key: 'lazyLoad',
		description: 'If `true`, it will call `ListPanel.get()` when mounted.'
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
export const dataSubmissionsListPanel = {
	...submissionsListPanel,
	addUrl: 'https://example.org',
	infoUrl: 'https://example.org',
	assignParticipantUrl: 'https://example.org'
};

export const dataDocsSubmissionsListPanel = [
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
	data,
	propDocs,
	dataDocs,
	dataSubmissionsListPanel,
	dataDocsSubmissionsListPanel,
	dataCatalogSubmissionsListPanel,
	dataDocsCatalogSubmissionsListPanel
};
