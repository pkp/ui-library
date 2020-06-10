<script>
import Component from '@/docs/Component.vue';
import PreviewChart from './previews/PreviewChart.vue';
import PreviewChartTemplate from '!raw-loader!./previews/PreviewChart.vue';
import PreviewDoughnut from './previews/PreviewDoughnut.vue';
import PreviewDoughnutTemplate from '!raw-loader!./previews/PreviewDoughnut.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewChartTemplate)
				},
				{
					component: PreviewDoughnut,
					name: 'Doughnut',
					template: this.extractTemplate(PreviewDoughnutTemplate)
				}
			]
		};
	}
};
</script>
