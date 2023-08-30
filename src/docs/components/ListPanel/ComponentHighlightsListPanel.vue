<script>
import Component from '@/docs/Component.vue';
import PreviewHighlightsListPanel from './previews/PreviewHighlightsListPanel.vue';
import PreviewHighlightsListPanelTemplate from '!raw-loader!./previews/PreviewHighlightsListPanel.vue';
import readme from '!raw-loader!./readme-highlights.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'HighlightsListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewHighlightsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewHighlightsListPanelTemplate),
				},
			],
		};
	},
};
</script>
