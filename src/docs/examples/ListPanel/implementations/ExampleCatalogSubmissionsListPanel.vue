<script>
import CatalogSubmissionsListPanel from '@/components/ListPanel/submissions/CatalogSubmissionsListPanel.vue';
import BaseSubmissionListPanelData from './helpers/BaseSubmissionListPanelData.js';

const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

// Add data to submission items
BaseSubmissionListPanelData.items = BaseSubmissionListPanelData.items.map((item, i) => {
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

export default {
	extends: CatalogSubmissionsListPanel,
	name: 'ExampleCatalogSubmissionsListPanel',
	data: function () {
		return {
			...BaseSubmissionListPanelData,
			catalogEntryUrl: '/$$$call$$$/modals/submission-metadata/catalog-entry/fetch?stageId=5&submissionId=__id__',
			catalogSortBy: '',
			catalogSortDir: '',
			filters: {
				categoryids: {
					heading: 'Categories',
					filters: [
						{
							title: 'Example Category',
							param: 'categoryIds',
							val: 1,
							sortBy: '',
							sortDir: '',
						},
						{
							title: 'Another Category',
							param: 'categoryIds',
							val: 2,
							sortBy: '',
							sortDir: '',
						},
					],
				},
				seriesIds: {
					heading: 'Series',
					filters: [
						{
							title: 'Library & Information Studies',
							param: 'seriesIds',
							val: 1,
							sortBy: 'seriesPosition',
							sortDir: 'DESC',
						},
						{
							title: 'Political Economy',
							param: 'seriesIds',
							val: 2,
							sortBy: '',
							sortDir: 'ASC',
						},
						{
							title: 'History',
							param: 'seriesIds',
							val: 3,
							sortBy: 'seriesIds',
							sortDir: '',
						},
					],
				},
			},
			i18n: {
				...BaseSubmissionListPanelData.i18n,
				add: 'Add Entry',
				itemCount: '{$count} monographs',
				itemsOfTotal: '{$count} of {$total} monographs',
				featured: 'Featured',
				newRelease: 'New Release',
				featuredCategory: 'Featured in category',
				featuredSeries: 'Feeatured in series',
				newreleaseSeries: 'New release in series',
				catalogEntry: 'Catalog Entry',
				editCatalogEntry: 'Entry',
				viewSubmission: 'View Submission',
				saving: 'Saving',
				orderFeatures: 'Order Features',
				orderingFeatures: 'Drag-and-drop or tap the up and down buttons to change the order of features on the homepage.',
				orderingFeaturesSection: 'Drag-and-drop or tap the up and down buttons to change the order of features in {$title}.',
				saveFeatureOrder: 'Save Order',
				cancel: 'Cancel',
				orderUp: 'Increase position of {$itemTitle}',
				orderDown: 'Decrease position of {$itemTitle}',
			},
		};
	},
};
</script>
