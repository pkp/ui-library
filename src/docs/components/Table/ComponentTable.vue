<script>
import Component from '@/docs/Component.vue';
import PreviewTable from './previews/PreviewTable.vue';
import PreviewTableTemplate from '!raw-loader!./previews/PreviewTable.vue';
import PreviewDescription from './previews/PreviewDescription.vue';
import PreviewDescriptionTemplate from '!raw-loader!./previews/PreviewDescription.vue';
import PreviewCustomHeader from './previews/PreviewCustomHeader.vue';
import PreviewCustomHeaderTemplate from '!raw-loader!./previews/PreviewCustomHeader.vue';
import PreviewCustomColumn from './previews/PreviewCustomColumn.vue';
import PreviewCustomColumnTemplate from '!raw-loader!./previews/PreviewCustomColumn.vue';
import PreviewSorting from './previews/PreviewSorting.vue';
import PreviewSortingTemplate from '!raw-loader!./previews/PreviewSorting.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import PreviewPaginationTemplate from '!raw-loader!./previews/PreviewPagination.vue';
import PreviewLabelledBy from './previews/PreviewLabelledBy.vue';
import PreviewLabelledByTemplate from '!raw-loader!./previews/PreviewLabelledBy.vue';
import PreviewTruncated from './previews/PreviewTruncated.vue';
import PreviewTruncatedTemplate from '!raw-loader!./previews/PreviewTruncated.vue';
import readme from '!raw-loader!./readme.md';

// -                               LabelledBy: 'With LabelledBy',
// -                               Truncated: 'With Truncated Column'

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
					template: this.extractTemplate(PreviewTableTemplate)
				},
				{
					component: PreviewDescription,
					name: 'With Description',
					template: this.extractTemplate(PreviewDescriptionTemplate)
				},
				{
					component: PreviewCustomHeader,
					name: 'With Custom Header',
					template: this.extractTemplate(PreviewCustomHeaderTemplate)
				},
				{
					component: PreviewCustomColumn,
					name: 'With Custom Column',
					template: this.extractTemplate(PreviewCustomColumnTemplate)
				},
				{
					component: PreviewSorting,
					name: 'With Sorting',
					template: this.extractTemplate(PreviewSortingTemplate)
				},
				{
					component: PreviewPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewPaginationTemplate)
				},
				{
					component: PreviewLabelledBy,
					name: 'With LabelledBy',
					template: this.extractTemplate(PreviewLabelledByTemplate)
				},
				{
					component: PreviewTruncated,
					name: 'With Truncated Column',
					template: this.extractTemplate(PreviewTruncatedTemplate)
				}
			]
		};
	}
};
</script>
