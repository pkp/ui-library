<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewSelectReviewerListPanel from './previews/PreviewSelectReviewerListPanel.vue';
import PreviewSelectReviewerListPanelTemplate from './previews/PreviewSelectReviewerListPanel.vue?raw';
import readme from './readme-select-reviewer.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'SelectReviewerListPanel',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewSelectReviewerListPanel),
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
