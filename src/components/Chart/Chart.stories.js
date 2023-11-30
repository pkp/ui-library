import LineChart from './LineChart.vue';
import DoughnutChart from './DoughnutChart.vue';

export default {
	title: 'Components/Chart',
	component: LineChart,
};

export const Line = {
	render: (args) => ({
		components: {LineChart},
		setup() {
			return {args};
		},
		template: `
			<LineChart :chart-data="args.chartData" :chart-options="args.chartOptions" />
		`,
	}),

	args: {
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
				'December',
			],
			datasets: [
				{
					label: 'Total Views',
					data: [40, 20, 12, 39, -10, 40, 39, 80, 40, 20, 12, 11],
				},
			],
		},
		chartOptions: {},
	},
};

export const Doughnut = {
	render: (args) => ({
		components: {DoughnutChart},
		setup() {
			return {args};
		},
		template: `
			<DoughnutChart :chart-data="args.chartData" :chart-options="args.chartOptions" />
		`,
	}),

	args: {
		chartData: {
			labels: ['Submission', 'Review', 'Copyediting', 'Production'],
			datasets: [
				{
					data: [12, 27, 4, 8],
					backgroundColor: ['#d00a0a', '#e05c14', '#006798', '#00b28d'],
				},
			],
		},
		chartOptions: {},
	},
};
