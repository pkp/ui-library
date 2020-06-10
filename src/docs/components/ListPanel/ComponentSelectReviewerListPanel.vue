<script>
import Component from '@/docs/Component.vue';
import PreviewSelectReviewerListPanel from './previews/PreviewSelectReviewerListPanel.vue';
import PreviewSelectReviewerListPanelTemplate from '!raw-loader!./previews/PreviewSelectReviewerListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'SelectReviewerListPanel',
			examples: [
				{
					component: PreviewSelectReviewerListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewSelectReviewerListPanelTemplate)
				}
			]
		};
	}
};
</script>
