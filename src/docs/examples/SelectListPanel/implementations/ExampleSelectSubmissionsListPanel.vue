<script>
import SelectSubmissionsListPanel from '@/components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import BaseSubmissionObject from '@/docs/examples/ListPanel/implementations/helpers/BaseSubmissionObject.js';

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
			inputName: 'exampleSelectSubmission',
			collection: {
				items: [
					BaseSubmissionObject,
					{
						...BaseSubmissionObject,
						fullTitle: {
							en_US: 'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus',
						},
						authorString: 'Catherine Kwantes',
						urlWorkflow: '/workflow/access/2',
					},
					{
						...BaseSubmissionObject,
						id: 3,
						fullTitle: {
							en_US: 'Metus ut elit est ultrices vivamus mauris est quisque arcu',
						},
						authorString: 'Domatilia Sokoloff',
						urlWorkflow: '/workflow/access/3',
						urlPublished: '/article/view/3',
					},
				],
				maxItems: 10,
			},
			i18n: {
				id: 'ID',
				title: 'Example Select Submissions List',
				search: 'Search',
				itemsOfTotal: '{$count} of {$total} items',
				itemCount: '{$count} items',
				loadMore: 'Load more',
				loading: 'Loading',
				viewSubmission: 'View {$title}',
			},
		};
	},
};
</script>
