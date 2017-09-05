<script>
import SubmissionsListPanel from './../../../../components/ListPanel/submissions/SubmissionsListPanel.vue';
import BaseSubmissionListPanelData from './helpers/BaseSubmissionListPanelData.js';

export default {
	extends: SubmissionsListPanel,
	name: 'OJSExampleSubmissionsListPanel',
	data: function () {
		return {
			...BaseSubmissionListPanelData,
			filters: {
				...BaseSubmissionListPanelData.filters,
				sectionIds: {
					heading: 'Sections',
					filters: [
						{
							title: 'Articles',
							param: 'sectionIds',
							val: '1',
						},
						{
							title: 'Reviews',
							param: 'sectionIds',
							val: '2',
						},
					],
				},
			},
		};
	},
};
</script>
