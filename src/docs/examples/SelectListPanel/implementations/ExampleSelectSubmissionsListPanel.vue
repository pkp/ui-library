<script>
import SelectSubmissionsListPanel from './../../../../components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';
import ListPanelCount from './../../../../components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from './../../../../components/ListPanel/ListPanelLoadMore.vue';
import BaseSubmissionObject from './../../ListPanel/implementations/helpers/BaseSubmissionObject.js';

export default {
	extends: SelectSubmissionsListPanel,
	name: 'ExampleSelectSubmissionsListPanel',
	components: {
		ListPanelCount,
		ListPanelLoadMore,
	},
	data: function () {
		return {
			id: 'ExampleSelectSubmissionsListPanel',
			collection: {
				items: [
					BaseSubmissionObject,
					{
						...BaseSubmissionObject,
						id: 2,
						title: 'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus',
						author: {
							authorString: 'Catherine Kwantes',
						},
						urlWorkflow: '/workflow/access/2',
					},
					{
						...BaseSubmissionObject,
						id: 3,
						title: 'Metus ut elit est ultrices vivamus mauris est quisque arcu',
						author: {
							authorString: 'Domatilia Sokoloff',
						},
						urlWorkflow: '/workflow/access/3',
						urlPublished: '/article/view/3',
					},
				],
				maxItems: 10,
			},
			i18n: {
				id: 'ID',
				title: 'Example Submissions List',
				search: 'Search',
				itemsOfTotal: '{$count} of {$total} items',
				itemCount: '{$count} items',
				loadMore: 'Load more',
				loading: 'Loading',
				incomplete: 'Incomplete',
			},
		};
	},
};
</script>
