<script>
import Component from '@/docs/Component.vue';
import PkpTable from './ExampleTable.vue';
import Description from './ExampleDescription.vue';
import CustomHeader from './ExampleCustomHeader.vue';
import CustomColumn from './ExampleCustomColumn.vue';
import Sorting from './ExampleSorting.vue';
import Pagination from './ExamplePagination.vue';
import LabelledBy from './ExampleLabelledBy.vue';
import Truncated from './ExampleTruncated.vue';

export default {
	extends: Component,
	components: {
		PkpTable,
		Description,
		CustomHeader,
		CustomColumn,
		Sorting,
		Pagination,
		LabelledBy,
		Truncated
	},
	data() {
		return {
			name: 'Table',
			examples: {
				PkpTable: 'Base',
				Description: 'With Description',
				CustomHeader: 'With Custom Header',
				CustomColumn: 'With Custom Column',
				Sorting: 'With Sorting',
				Pagination: 'With Pagination',
				LabelledBy: 'With LabelledBy',
				Truncated: 'With Truncated Column'
			}
		};
	}
};
</script>
