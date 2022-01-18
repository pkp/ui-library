<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewPanel.vue';
import Template from '!raw-loader!./previews/PreviewPanel.vue';
import PreviewMultipleSections from './previews/PreviewPanelMultipleSections.vue';
import TemplateMultipleSections from '!raw-loader!./previews/PreviewPanelMultipleSections.vue';
import PreviewStacked from './previews/PreviewPanelStacked.vue';
import TemplateStacked from '!raw-loader!./previews/PreviewPanelStacked.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(Template)
				},
				{
					component: PreviewMultipleSections,
					name: 'Many Sections',
					template: this.extractTemplate(TemplateMultipleSections)
				},
				{
					component: PreviewStacked,
					name: 'Stacked Header',
					template: this.extractTemplate(TemplateStacked)
				}
			]
		};
	}
};
</script>
