<script>
import Statistics from '@/components/Statistics/Statistics.vue';
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';

export default {
	extends: Statistics,
	data () {
		return {
			editorialChartData: null,
			editorialItems: null,
			submissionsStage: null,
			userItems: null,
		};
	},
	components: {
		DoughnutChart,
	},
	methods: {
		/**
		 * Process the API response
		 *
		 * @param object Response
		 */
		processResponse ({ editorialChartData, editorialItems, submissionsStage, userItems }) {
			Object.assign(this, { editorialChartData, editorialItems, submissionsStage, userItems });
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStatistics--editorial__stageWrapper {
	position: relative;
	min-height: 256px;
}

.pkpStatistics--editorial__stageChartWrapper {
	float: left;
	width: 256px;

	.chartjs-render-monitor {
		margin-left: auto;
		margin-right: auto;
		max-width: 256px;
	}
}

.pkpStatistics--editorial__stageList {
	position: absolute;
	top: 50%;
	left: 256px;
	width: 65%;
	transform: translateY(-50%);
}

.pkpStatistics--editorial__stage {
	display: inline-block;
	margin-top: 2rem;
	margin-right: 1.5rem;
}

.pkpStatistics--editorial__stageCount {
	display: block;
	font-size: @font-lead;
	font-weight: @bold;
	line-height: 1em;
}

.pkpStatistics--editorial__stageLabel {
	display: block;
	font-size: @font-sml;
	line-height: 1.25em;
}

.pkpStatistics--editorial__stage--total {
	display: block;
	margin-top: 0;

	.pkpStatistics--editorial__stageCount {
		font-size: 48px;
	}

	.pkpStatistics--editorial__stageLabel {
		font-size: @font-base;
	}
}

.pkpStatistics--editorial .pkpTable {
	margin-top: 0.5rem;
}
</style>
