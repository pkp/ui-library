import submissionsListPanel from './submissionsListPanel';
import i18n from './i18n';

// Add data to existing submission items
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

const items = submissionsListPanel.items.map((item, i) => {
	const categoryId = i % 2 ? 1 : 2;
	const seriesId = getRandomInt(1, 3);
	item.series = {
		id: '1',
		position: '1',
		title: ''
	};
	item.category = [
		{
			id: categoryId,
			image: {},
			parent_id: 0,
			path: 'example',
			press_id: 1,
			seq: 10000
		}
	];
	item.featured = [
		{
			assoc_id: categoryId,
			assoc_type: pkp.const.ASSOC_TYPE_CATEGORY,
			seq: 0
		},
		{
			assoc_id: seriesId,
			assoc_type: pkp.const.ASSOC_TYPE_SERIES,
			seq: 0
		}
	];
	if (i === 3) {
		item.newRelease = [
			{
				assoc_id: seriesId,
				assoc_type: pkp.const.ASSOC_TYPE_SERIES
			}
		];
	} else {
		item.newRelease = [];
	}
	item.urlPublished = '/catalog/book/1';

	return item;
});

export default {
	id: 'CatalogListPanel',
	addUrl: '/example',
	catalogEntryUrl: 'https://example.org',
	catalogSortBy: 'datePublished', // ORDERBY_DATE_PUBLISHED
	catalogSortDir: 1, // SORT_DIRECTION_ASC
	csrfToken: '1234',
	filters: [
		{
			heading: 'Categories',
			filters: [
				{
					title: 'Example Category',
					param: 'categoryIds',
					value: 1,
					sortBy: '',
					sortDir: ''
				},
				{
					title: 'Another Category',
					param: 'categoryIds',
					value: 2,
					sortBy: '',
					sortDir: ''
				}
			]
		},
		{
			heading: 'Series',
			filters: [
				{
					title: 'Library & Information Studies',
					param: 'seriesIds',
					value: 1,
					sortBy: 'seriesPosition',
					sortDir: 'DESC'
				},
				{
					title: 'Political Economy',
					param: 'seriesIds',
					value: 2,
					sortBy: '',
					sortDir: 'ASC'
				},
				{
					title: 'History',
					param: 'seriesIds',
					value: 3,
					sortBy: 'seriesIds',
					sortDir: ''
				}
			]
		}
	],
	items: items,
	i18n: {
		...i18n.expandable,
		...i18n.filter,
		...i18n.orderable,
		...i18n.pagination,
		...i18n.search,
		...i18n.catalogListPanel,
		title: 'Catalog'
	}
};
