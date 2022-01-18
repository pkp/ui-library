<script>
import Component from '@/docs/Component.vue';
import PreviewComposer from './previews/PreviewComposer.vue';
import PreviewComposerTemplate from '!raw-loader!./previews/PreviewComposer.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Composer',
			readme: readme,
			examples: [
				{
					component: PreviewComposer,
					name: 'Base',
					template: this.extractTemplate(PreviewComposerTemplate)
				}
			]
		};
	}
};
</script>
