<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewActionPanel.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewActionPanel.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'ActionPanel',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Base',
					template: this.extractTemplate(PreviewTemplate)
				}
			]
		};
	}
};
</script>
