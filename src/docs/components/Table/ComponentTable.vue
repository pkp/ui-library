<script>
import Component from '@/docs/Component.vue';
import PreviewTable from './previews/PreviewTable.vue';
import PreviewTableTemplate from './previews/PreviewTable.vue?raw';
import PreviewSorting from './previews/PreviewSorting.vue';
import PreviewSortingTemplate from './previews/PreviewSorting.vue?raw';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from './previews/PreviewPagination.vue?raw';
import PreviewLabelledBy from './previews/PreviewLabelledBy.vue';
import PreviewLabelledByTemplate from './previews/PreviewLabelledBy.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Table',
			readme: readme,
			examples: [
				{
					component: PreviewTable,
					name: 'Base',
					template: this.extractTemplate(PreviewTableTemplate),
				},
				{
					component: PreviewSorting,
					name: 'With Sorting',
					template: this.extractTemplate(PreviewSortingTemplate),
				},
				{
					component: PreviewPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewPaginationTemplate),
				},
				{
					component: PreviewLabelledBy,
					name: 'With LabelledBy',
					template: this.extractTemplate(PreviewLabelledByTemplate),
				},
			],
		};
	},
};
</script>
