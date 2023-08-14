<script>
import Component from '@/docs/Component.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from './previews/PreviewPagination.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewPaginationTemplate),
				},
			],
		};
	},
};
</script>
