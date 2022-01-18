<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileAttacher.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFileAttacher.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'File Attacher',
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
