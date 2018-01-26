<script>
import SubmissionsListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import BaseSubmissionListPanelData from './helpers/BaseSubmissionListPanelData.js';

// Update stage names in items to reflect internal/external review
BaseSubmissionListPanelData.items = BaseSubmissionListPanelData.items.map(function (item) {
	item.stages = item.stages.map(function (stage) {
		if (stage.id === 2) {
			stage.label = 'Internal Review';
		} else if (stage.id === 3) {
			stage.label = 'External Review';
		}
		return stage;
	});
	return item;
});

export default {
	extends: SubmissionsListPanel,
	name: 'OJSExampleSubmissionsListPanel',
	data: function () {
		return {
			...BaseSubmissionListPanelData,
			filters: {
				...BaseSubmissionListPanelData.filters,
				stageIds: {
					heading: BaseSubmissionListPanelData.filters.stageIds.heading,
					filters: [
						BaseSubmissionListPanelData.filters.stageIds.filters[0],
						{
							title: 'Internal Review',
							param: 'stageIds',
							val: 2,
						},
						{
							...BaseSubmissionListPanelData.filters.stageIds.filters[1],
							title: 'External Review',
						},
						BaseSubmissionListPanelData.filters.stageIds.filters[2],
						BaseSubmissionListPanelData.filters.stageIds.filters[3],
					],
				},
			},
		};
	},
};
</script>
