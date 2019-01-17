<script>
import Example from '@/docs/Example.vue';
import BaseSelectSubmissionsListPanel from '@/components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';
import fileContent from '!raw-loader!@/components/SelectListPanel/submissions/SelectSubmissionsListPanel.vue';
import config from './config';
import listPanelConfig from '@/docs/components/ListPanel/config';
import submissionsListPanelConfig from '@/docs/components/ListPanel/helpers/submissionsListPanel';

const SelectSubmissionsListPanel = {
	...BaseSelectSubmissionsListPanel,
	data() {
		return {
			...listPanelConfig.data,
			...submissionsListPanelConfig,
			inputName: 'exampleSelectSubmission',
			i18n: {
				...submissionsListPanelConfig.i18n,
				id: 'ID',
				title: 'Submissions',
				viewSubmission: 'View {$title}',
				selectAllLabel: 'Select All'
			}
		};
	}
};

export default {
	extends: Example,
	components: {
		SelectSubmissionsListPanel
	},
	data() {
		return {
			...config,
			component: 'select-submissions-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
