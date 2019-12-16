<script>
import Example from '@/docs/Example.vue';
import LineChart from '@/components/Chart/LineChart.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		LineChart
	},
	data() {
		return {
			...config,
			component: 'line-chart'
		};
	}
};
</script>
