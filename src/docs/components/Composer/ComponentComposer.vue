<script>
import Component from '@/docs/Component.vue';
import PreviewComposer from './previews/PreviewComposer.vue';
import PreviewComposerTemplate from './previews/PreviewComposer.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewComposerTemplate),
				},
			],
		};
	},
};
</script>
