<script>
import Component from '@/docs/Component.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from '!raw-loader!./previews/PreviewPagination.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Pagination',
			readme: readme,
			examples: [
				{
					component: PreviewPagination,
					name: 'Base',
					template: this.extractTemplate(PreviewPaginationTemplate)
				}
			]
		};
	}
};
</script>
