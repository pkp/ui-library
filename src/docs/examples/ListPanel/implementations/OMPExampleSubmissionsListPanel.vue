<script>
import SubmissionsListPanel from './../../../../components/ListPanel/submissions/SubmissionsListPanel.vue';
import BaseSubmissionListPanelData from './helpers/BaseSubmissionListPanelData.js';

// Modify for internal/external review stages
let filters = {
	...BaseSubmissionListPanelData.filters,
};
filters.stageIds.filters = [
	filters.stageIds.filters[0],
	{
		title: 'Internal Review',
		param: 'stageIds',
		val: 2,
	},
	{
		...filters.stageIds.filters[1],
		title: 'External Review',
	},
	filters.stageIds.filters[2],
	filters.stageIds.filters[3],
];

// Update stage names in collection to reflect internal/external review
BaseSubmissionListPanelData.collection.items = BaseSubmissionListPanelData.collection.items.map(function (item) {
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
			filters: filters,
		};
	},
};
</script>
