import Table from '@/components/Table/Table.vue';
import ViewTable from './ViewTable.vue';
import WithColumn from './WithColumn.vue';
import WithColumnRaw from '!!raw-loader!./WithColumn.vue';
import WithDescription from './WithDescription.vue';
import WithDescriptionRaw from '!!raw-loader!./WithDescription.vue';
import WithHeader from './WithHeader.vue';
import WithHeaderRaw from '!!raw-loader!./WithHeader.vue';
import WithLabelledBy from './WithLabelledBy.vue';
import WithLabelledByRaw from '!!raw-loader!./WithLabelledBy.vue';
import WithPagination from './WithPagination.vue';
import WithPaginationRaw from '!!raw-loader!./WithPagination.vue';
import WithSorting from './WithSorting.vue';
import WithSortingRaw from '!!raw-loader!./WithSorting.vue';
import WithTruncated from './WithTruncated.vue';
import WithTruncatedRaw from '!!raw-loader!./WithTruncated.vue';

export default {
	viewComponent: ViewTable,
	baseComponent: Table,
	propDescription: {
		columns: 'An array of configuration objects for each column.',
		describedBy: 'The id of one or more HTML elements that describe the table, to be used in an <code>aria-describedby</code> attribute. This prop is not required unless additional information about the table is available and not included in the <code>description</code> prop.',
		description: 'An optional description of the table.',
		label: 'A name for the table. If no <code>label</code> is provided, you must make use of the <code>labelledBy</code> prop.',
		labelledBy: 'The id of one or more HTML elements that name the table, to be used in an <code>aria-labelledby</code> attribute. This prop should not be used if a <code>label</code> is provided.',
		orderBy: 'The name of the column that the rows are ordered by.',
		orderDirection: 'The direction that rows are ordered by as a boolean.',
		rows: 'The items to display in the table.',
	},
	examples: {
		'with-description': {
			label: 'with Description',
			component: WithDescription,
			componentRaw: WithDescriptionRaw,
		},
		'with-header': {
			label: 'with Custom Header',
			component: WithHeader,
			componentRaw: WithHeaderRaw,
		},
		'with-column': {
			label: 'with Custom Column',
			component: WithColumn,
			componentRaw: WithColumnRaw,
		},
		'with-sorting': {
			label: 'with Sorting',
			component: WithSorting,
			componentRaw: WithSortingRaw,
		},
		'with-labelled-by': {
			label: 'with Labelled By',
			component: WithLabelledBy,
			componentRaw: WithLabelledByRaw,
		},
		'with-pagination': {
			label: 'with Pagination',
			component: WithPagination,
			componentRaw: WithPaginationRaw,
		},
		'with-truncated': {
			label: 'with Truncated',
			component: WithTruncated,
			componentRaw: WithTruncatedRaw,
		},
	},
};
