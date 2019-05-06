<script>
import Example from '@/docs/Example.vue';
import Chart from '@/components/Chart/LineChart.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		Chart
	},
	data() {
		return {
			...config,
			component: 'chart'
		};
	}
};
</script>
