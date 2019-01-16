import Table from '@/components/Table/Table.vue';
import TableRaw from '!!raw-loader!@/components/Table/Table.vue';
import ViewTable from './ViewTable.vue';
import WithRow from './WithRow.vue';
import WithHeader from './WithHeader.vue';

export default {
	viewComponent: ViewTable,
	baseComponent: Table,
	propDescription: {},
	examples: {
		'with-row': {
			label: 'with Row',
			component: WithRow,
			componentRaw: TableRaw,
		},
		'with-header': {
			label: 'with Header',
			component: WithHeader,
			componentRaw: TableRaw,
		},
	},
};
