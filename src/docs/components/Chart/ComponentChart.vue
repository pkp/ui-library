<script>
import Component from '@/docs/Component.vue';
import PreviewChart from './previews/PreviewChart.vue';
import PreviewChartTemplate from './previews/PreviewChart.vue?raw';
import PreviewDoughnut from './previews/PreviewDoughnut.vue';
import PreviewDoughnutTemplate from './previews/PreviewDoughnut.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Chart',
			readme: readme,
			examples: [
				{
					component: PreviewChart,
					name: 'Base',
					template: this.extractTemplate(PreviewChartTemplate),
				},
				{
					component: PreviewDoughnut,
					name: 'Doughnut',
					template: this.extractTemplate(PreviewDoughnutTemplate),
				},
			],
		};
	},
};
</script>
