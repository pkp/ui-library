import LineChart from '@/components/Chart/LineChart.vue';
import ViewLineChart from './ViewLineChart.vue';
import ViewDoughnutChart from './ViewDoughnutChart.vue';
import ViewDoughnutChartRaw from '!!raw-loader!./ViewDoughnutChart.vue';

export default {
	viewComponent: ViewLineChart,
	baseComponent: LineChart,
	propDescription: {
		chartData: 'An object representing the data to be charted. This object corresponds to the <code>data</code> property in <a href="https://www.chartjs.org/docs/latest/#creating-a-chart">this example</a> in the Chart.js docs.',
		chartOptions: 'Optional. An object representing the configuration options for the chart. Options passed with this prop will be merged with defaults.<br><br>This object corresponds to the <code>options</code> property in <a href="https://www.chartjs.org/docs/latest/getting-started/usage.html#creating-a-chart">this example</a> in the Chart.js docs. There are many <a href="https://www.chartjs.org/docs/latest/">configuration options</a>.',
	},
	examples: {
		'doughnut': {
			label: 'Doughnut Chart',
			component: ViewDoughnutChart,
			componentRaw: ViewDoughnutChartRaw,
		},
	},
};
