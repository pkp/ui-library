<script>
import Example from '@/docs/Example.vue';
import BaseSelectReviewerListPanel from '@/components/SelectListPanel/users/SelectReviewerListPanel.vue';
import fileContent from '!raw-loader!@/components/SelectListPanel/users/SelectReviewerListPanel.vue';
import config from './config';
import listPanelConfig from '@/docs/components/ListPanel/config';
import selectReviewerListPanelConfig from './helpers/selectReviewerListPanel';

const SelectReviewerListPanel = {
	...BaseSelectReviewerListPanel,
	data() {
		return {
			...listPanelConfig.data,
			...selectReviewerListPanelConfig,
			inputName: 'exampleSelectSubmission',
			i18n: {
				...selectReviewerListPanelConfig.i18n
			}
		};
	}
};

export default {
	extends: Example,
	components: {
		SelectReviewerListPanel
	},
	data() {
		return {
			...config,
			component: 'select-reviewer-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
