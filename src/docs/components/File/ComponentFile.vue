<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFile.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFile.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'File',
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
