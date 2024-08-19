import CounterReportsListPanel from './CounterReportsListPanel.vue';

import CounterReportMock from '@/mocks/counterReport';
import FormCounterReportMock from '@/components/Form/mocks/form-counter-report';

export default {
	title: 'ListPanel/CounterReportsListPanel',
	component: CounterReportsListPanel,
};

const counterReports = [
	{
		...CounterReportMock,
		Report_ID: 'PR',
		begin_date: '2023-09-01',
		end_date: '2024-07-31',
		customer_id: 0,
		metric_type: {
			0: 'Total_Item_Investigations',
			1: 'Unique_Item_Investigations',
			2: 'Total_Item_Requests',
			3: 'Unique_Item_Requests',
		},
	},
];

export const Base = {
	render: (args) => ({
		components: {CounterReportsListPanel},
		setup() {
			return {args};
		},
		template: `
			<CounterReportsListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		form: {...FormCounterReportMock},
		items: [...counterReports],
		itemsMax: counterReports.length,
		title: 'Counter R5 Reports',
		id: 'previewCounterReportsListPanel',
		apiUrl: '',
		editCounterReportLabel: 'Edit',
		usagePossible: true,
	},
};
