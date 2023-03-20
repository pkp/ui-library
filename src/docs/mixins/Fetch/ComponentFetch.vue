<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFetch.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFetch.vue';
import readme from '!raw-loader!./readme.md';

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
