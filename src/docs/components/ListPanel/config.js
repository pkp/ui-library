import submissionsListPanel from './helpers/submissionsListPanel';
import catalogListPanel from './helpers/catalogListPanel';
import selectReviewerListPanel from './helpers/selectReviewerListPanel';
import i18n from './helpers/i18n';

export let props = {
	apiUrl: '',
	canSelect: false,
	canSelectAll: false,
	count: 20,
	filters: [],
	getParams: {},
	id: '',
	isSidebarVisible: false,
	items: [],
	itemsMax: 0,
	lazyLoad: false,
	description: '',
	offset: 0,
	searchPhrase: '',
	selected: [],
	title: 'List Panel',
	i18n: {
		...i18n.filter,
		...i18n.search,
		empty: 'No items found',
		loading: 'Loading',
		selectAllLabel: 'Select all'
	}
};

export const propDocs = [
	{
		key: 'apiUrl',
		description:
			'Optional. If present, searching, filtering and other tasks will be performed through a `GET` request to this URL.'
	},
	{
		key: 'canSelect',
		description:
			'Can items in this list be selected? See [List Panel with Select](/#/component/ListPanel/ExampleListPanelSelect).'
	},
	{
		key: 'canSelectAll',
		description:
			'If `true`, a checkbox for selecting all items will appear above the list. See [List Panel with Select](/#/component/ListPanel/ExampleListPanelSelect).'
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
		key: 'description',
		description: 'A description that can be added below the header.'
	},
	{
		key: 'offset',
		description: 'Tracks the number of items visible for load more requests.'
	},
	{
		key: 'searchPhrase',
		description:
			'Modifying this property will automatically trigger a `GET` request if an `apiUrl` is set.'
	},
	{
		key: 'selected',
		description:
			'An array of items that should be selected. `canSelect` must be set to `true`. See [List Panel with Select](/#/component/ListPanel/ExampleListPanelSelect).'
	},
	{
		key: 'selectorName',
		description:
			'Optional. The name of the selection `<input>` field. See [List Panel with Select](/#/component/ListPanel/ExampleListPanelSelect).'
	},
	{
		key: 'selectorType',
		description:
			'Whether to use a `checkbox` or `radio` input field for selection. See [List Panel with Select](/#/component/ListPanel/ExampleListPanelSelect). Default is `checkbox`.'
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
 * CatalogListPanel (OMP)
 *
 * Data and documentation for the CatalogListPanel component, which
 * extends the base ListPanel.
 */
export const propsCatalogListPanel = {
	...props,
	...catalogListPanel
};

export const propsDocsCatalogListPanel = [
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

/**
 * SelectSubmissionsListPanel
 *
 * Props for the SelectSubmissionsListPanel component
 */
export const propsSelectSubmissionsListPanel = {
	...props,
	...submissionsListPanel,
	canSelect: true,
	canSelectAll: true,
	selectorName: 'submissionIds[]',
	i18n: {
		...props.i18n,
		...i18n.search,
		...i18n.selectSubmissionsListPanel
	}
};

/**
 * SelectReviewerListPanel
 *
 * Props for the SelectReviewerListPanel component
 */
export const propsSelectReviewerListPanel = {
	...props,
	...selectReviewerListPanel,
	canSelect: true,
	canSelectAll: true,
	selectorName: 'reviewerId',
	selectorType: 'radio',
	i18n: {
		...props.i18n,
		...i18n.expandable,
		...i18n.filter,
		...i18n.pagination,
		...i18n.search,
		...i18n.selectReviewerListPanel
	}
};

export default {
	props,
	propDocs,
	dataDocs,
	propsSubmissionsListPanel,
	propsDocsSubmissionsListPanel,
	propsCatalogListPanel,
	propsDocsCatalogListPanel,
	propsSelectSubmissionsListPanel
};
