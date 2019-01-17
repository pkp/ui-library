<script>
import Component from '@/docs/Component.vue';
import SelectListPanel from './ExampleSelectListPanel.vue';
import SelectListPanelRadio from './ExampleSelectListPanelRadio.vue';
import SelectListPanelSelectAll from './ExampleSelectListPanelSelectAll.vue';
import SelectSubmissionsListPanel from './ExampleSelectSubmissionsListPanel.vue';
import SelectReviewerListPanel from './ExampleSelectReviewerListPanel.vue';

export default {
	extends: Component,
	components: {
		SelectListPanel,
		SelectListPanelRadio,
		SelectListPanelSelectAll,
		SelectSubmissionsListPanel,
		SelectReviewerListPanel
	},
	data() {
		return {
			name: 'SelectListPanel',
			examples: {
				SelectListPanel: 'Base',
				SelectListPanelRadio: 'Radio Buttons',
				SelectListPanelSelectAll: 'Select All'
			},
			implementations: {
				SelectSubmissionsListPanel: 'SelectSubmissionsListPanel',
				SelectReviewerListPanel: 'SelectReviewerListPanel'
			}
		};
	}
};
</script>
