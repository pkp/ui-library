<script>
import Component from '@/docs/Component.vue';
import PreviewSearch from './previews/PreviewSearch.vue';
import PreviewSearchTemplate from '!raw-loader!./previews/PreviewSearch.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewSearchTemplate)
				}
			]
		};
	}
};
</script>
