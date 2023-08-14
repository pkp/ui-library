<script>
import Component from '@/docs/Component.vue';
import PreviewSearch from './previews/PreviewSearch.vue';
import PreviewSearchTemplate from './previews/PreviewSearch.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Search',
			readme: readme,
			examples: [
				{
					component: PreviewSearch,
					name: 'Base',
					template: this.extractTemplate(PreviewSearchTemplate),
				},
			],
		};
	},
};
</script>
