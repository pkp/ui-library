import CatalogListPanel from './CatalogListPanel.vue';

import PkpDialog from '@/components/Modal/Dialog.vue';
import SubmissionsMock from '@/mocks/submissions';

export default {
	title: 'ListPanel/CatalogListPanel',
	component: CatalogListPanel,
};

const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

let items = SubmissionsMock.map((item, i) => {
	const categoryId = i % 2 ? 1 : 2;
	const seriesId = getRandomInt(1, 3);
	item.series = {
		id: '1',
		position: '1',
		title: '',
	};
	item.category = [
		{
			id: categoryId,
			image: {},
			parent_id: 0,
			path: 'example',
			press_id: 1,
			seq: 10000,
		},
	];
	item.featured = [
		{
			assoc_id: categoryId,
			assoc_type: pkp.const.ASSOC_TYPE_CATEGORY,
			seq: 0,
		},
		{
			assoc_id: seriesId,
			assoc_type: pkp.const.ASSOC_TYPE_SERIES,
			seq: 0,
		},
	];
	if (i === 3) {
		item.newRelease = [
			{
				assoc_id: seriesId,
				assoc_type: pkp.const.ASSOC_TYPE_SERIES,
			},
		];
	} else {
		item.newRelease = [];
	}
	item.urlPublished = '/catalog/book/1';

	return item;
});

export const Base = {
	render: (args) => ({
		components: {CatalogListPanel, PkpDialog},
		setup() {
			/**
			 * Add required locale keys
			 */
			pkp.localeKeys['submission.catalogEntry.new'] = 'Add Entry';
			pkp.localeKeys['submission.list.saveFeatureOrder'] = 'Save Order';
			pkp.localeKeys['submission.list.orderFeatures'] = 'Order Features';
			pkp.localeKeys['catalog.manage.categoryFeatured'] =
				'Featured in category';
			pkp.localeKeys['catalog.manage.seriesFeatured'] = 'Featured in series';
			pkp.localeKeys['catalog.manage.featured'] = 'Featured';
			pkp.localeKeys['catalog.manage.feature.categoryNewRelease'] =
				'New release in category';
			pkp.localeKeys['catalog.manage.feature.seriesNewRelease'] =
				'New release in series';
			pkp.localeKeys['catalog.manage.feature.newRelease'] = 'New Release';
			pkp.localeKeys['submission.list.orderingFeatures'] =
				'Drag-and-drop or tap the up and down buttons to change the order of features on the homepage.';
			pkp.localeKeys['submission.list.orderingFeaturesSection'] =
				'Drag-and-drop or tap the up and down buttons to change the order of features in {$title}.';
			pkp.localeKeys['catalog.manage.isFeatured'] =
				'This monograph is featured. Make this monograph not featured.';
			pkp.localeKeys['catalog.manage.isNotFeatured'] =
				'This monograph is not featured. Make this monograph featured.';
			pkp.localeKeys['catalog.manage.isNewRelease'] =
				'This monograph is a new release. Make this monograph not a new release.';
			pkp.localeKeys['catalog.manage.isNotNewRelease'] =
				'This monograph is not a new release. Make this monograph a new release.';
			pkp.localeKeys['submission.list.viewEntry'] = 'View Entry';
			pkp.localeKeys['submission.list.viewSubmission'] = 'View Submission';

			return {args};
		},
		template: `
			<CatalogListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		id: 'previewCatalogListPanel',
		apiUrl: 'http://httpbin.org/get',
		catalogSortBy: 'datePublished',
		catalogSortDir: '1',
		csrfToken: '1234',
		infoUrl: 'http://httbin.org/get',
		title: 'catalog',
		addEntryForm: {
			method: 'PUT',
			action: '/example/default',
			errors: {},
			fields: [
				{
					name: 'submissionIds',
					component: 'field-select-submissions',
					label: 'Find Submission',
					isRequired: true,
					selected: [],
					value: [],
					groupId: 'default',
				},
			],
			groups: [
				{
					id: 'default',
					pageId: 'default',
				},
			],
			pages: [
				{
					id: 'default',
					submitButton: {
						label: 'Add Entry',
						isPrimary: true,
					},
				},
			],
			primaryLocale: 'en',
			visibleLocales: ['en'],
			supportedFormLocales: [
				{
					key: 'en',
					label: 'English',
				},
			],
			isSaving: false,
		},
		filters: [
			{
				heading: 'Categories',
				filters: [
					{
						title: 'Example Category',
						param: 'categoryIds',
						value: 1,
						sortBy: '',
						sortDir: '',
					},
					{
						title: 'Another Category',
						param: 'categoryIds',
						value: 2,
						sortBy: '',
						sortDir: '',
					},
				],
			},
			{
				heading: 'Series',
				filters: [
					{
						title: 'Library & Information Studies',
						param: 'seriesIds',
						value: 1,
						sortBy: 'seriesPosition',
						sortDir: 'DESC',
					},
					{
						title: 'Political Economy',
						param: 'seriesIds',
						value: 2,
						sortBy: '',
						sortDir: 'ASC',
					},
					{
						title: 'History',
						param: 'seriesIds',
						value: 3,
						sortBy: 'seriesIds',
						sortDir: '',
					},
				],
			},
		],
		items: [...items],
		itemsMax: items.length,
	},
};
