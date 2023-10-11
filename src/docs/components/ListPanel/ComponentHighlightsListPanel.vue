<script>
import Component from '@/docs/Component.vue';
import PreviewHighlightsListPanel from './previews/PreviewHighlightsListPanel.vue';
import PreviewHighlightsListPanelTemplate from './previews/PreviewHighlightsListPanel.vue?raw';
import readme from './readme-highlights.md?raw';

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
