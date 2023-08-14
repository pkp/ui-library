<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewPanel.vue';
import Template from './previews/PreviewPanel.vue?raw';
import PreviewMultipleSections from './previews/PreviewPanelMultipleSections.vue';
import TemplateMultipleSections from './previews/PreviewPanelMultipleSections.vue?raw';
import PreviewStacked from './previews/PreviewPanelStacked.vue';
import TemplateStacked from './previews/PreviewPanelStacked.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Panel',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Base',
					template: this.extractTemplate(Template),
				},
				{
					component: PreviewMultipleSections,
					name: 'Many Sections',
					template: this.extractTemplate(TemplateMultipleSections),
				},
				{
					component: PreviewStacked,
					name: 'Stacked Header',
					template: this.extractTemplate(TemplateStacked),
				},
			],
		};
	},
};
</script>
