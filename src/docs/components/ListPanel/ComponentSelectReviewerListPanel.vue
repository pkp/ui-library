<script>
import Component from '@/docs/Component.vue';
import PreviewSelectReviewerListPanel from './previews/PreviewSelectReviewerListPanel.vue';
import PreviewSelectReviewerListPanelTemplate from '!raw-loader!./previews/PreviewSelectReviewerListPanel.vue';
import readme from '!raw-loader!./readme-select-reviewer.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'SelectReviewerListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewSelectReviewerListPanel,
					name: 'Base',
					template: this.extractTemplate(
						PreviewSelectReviewerListPanelTemplate
					),
				},
			],
		};
	},
};
</script>
