<script>
import Component from '@/docs/Component.vue';
import PreviewMultilingualProgress from './previews/PreviewMultilingualProgress.vue';
import PreviewMultilingualProgressTemplate from './previews/PreviewMultilingualProgress.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Multilingual Progress',
			readme: readme,
			examples: [
				{
					component: PreviewMultilingualProgress,
					name: 'Base',
					template: this.extractTemplate(PreviewMultilingualProgressTemplate),
				},
			],
		};
	},
};
</script>
