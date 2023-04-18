<script>
import Component from '@/docs/Component.vue';
import PreviewTable from './previews/PreviewTable.vue';
import PreviewTableTemplate from '!raw-loader!./previews/PreviewTable.vue';
import PreviewSorting from './previews/PreviewSorting.vue';
import PreviewSortingTemplate from '!raw-loader!./previews/PreviewSorting.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from '!raw-loader!./previews/PreviewPagination.vue';
import PreviewLabelledBy from './previews/PreviewLabelledBy.vue';
import PreviewLabelledByTemplate from '!raw-loader!./previews/PreviewLabelledBy.vue';
import readme from '!raw-loader!./readme.md';

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
