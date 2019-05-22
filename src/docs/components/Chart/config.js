export let props = {
	chartData: {
		labels: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		datasets: [
			{
				label: 'Total Views',
				data: [40, 20, 12, 39, -10, 40, 39, 80, 40, 20, 12, 11]
			}
		]
	},
	chartOptions: {}
};

export const propDocs = [
	{
		key: 'chartData',
		description:
			'An object representing the data to be charted. This object corresponds to the <code>data</code> property in <a href="https://www.chartjs.org/docs/latest/#creating-a-chart">this example</a> in the Chart.js docs.'
	},
	{
		key: 'chartOptions',
		description:
			'Optional. An object representing the configuration options for the chart. Options passed with this prop will be merged with defaults.<br><br>This object corresponds to the <code>options</code> property in <a href="https://www.chartjs.org/docs/latest/getting-started/usage.html#creating-a-chart">this example</a> in the Chart.js docs. There are many <a href="https://www.chartjs.org/docs/latest/">configuration options</a>.'
	}
];

export default {
	props,
	propDocs
};
