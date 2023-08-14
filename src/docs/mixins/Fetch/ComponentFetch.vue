<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFetch.vue';
import PreviewTemplate from './previews/PreviewFetch.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Fetch',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Fetch',
					template: this.extractTemplate(PreviewTemplate),
				},
			],
		};
	},
};
</script>
