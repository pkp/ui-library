import Table from '@/components/Table/Table.vue';
import ViewTable from './ViewTable.vue';
import WithColumn from './WithColumn.vue';
import WithColumnRaw from '!!raw-loader!./WithColumn.vue';
import WithHeader from './WithHeader.vue';
import WithHeaderRaw from '!!raw-loader!./WithHeader.vue';

export default {
	viewComponent: ViewTable,
	baseComponent: Table,
	propDescription: {},
	examples: {
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
	},
};
