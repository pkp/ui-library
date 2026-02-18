<template>
	<div v-if="store.hasData" :style="props.styles">
		<canvas ref="canvasRef"></canvas>
	</div>
	<div v-else-if="noStatsMessage">
		{{ noStatsMessage }}
	</div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {
	Chart,
	BarElement,
	BarController,
	LineElement,
	LineController,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
} from 'chart.js';
import deepmerge from '@fastify/deepmerge';
import {usePkpUsageChartStore} from './usePkpUsageChartStore';

Chart.register(
	BarElement,
	BarController,
	LineElement,
	LineController,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
);

const merge = deepmerge();

const props = defineProps({
	chartType: {type: String, required: true},
	statsData: {type: Object, default: null},
	monthLabels: {type: Array, required: true},
	chartOptions: {type: Object, default: () => ({})},
	noStatsMessage: {type: String, default: ''},
	styles: {type: Object, default: () => ({})},
});

const store = usePkpUsageChartStore();
const canvasRef = ref(null);
let chartInstance = null;

// Initialize store from props if not already initialized
if (!store.initialized) {
	store.initialize({
		chartType: props.chartType,
		statsData: props.statsData,
		monthLabels: props.monthLabels,
		chartOptions: props.chartOptions,
	});
}

const defaultChartOptions = computed(() => ({
	plugins: {
		legend: {
			display: false,
		},
	},
	tooltip: {
		titleFontColor: '#333',
		bodyFontColor: '#333',
		footerFontColor: '#333',
		backgroundColor: '#ddd',
		cornerRadius: 2,
	},
	elements: {
		line: {
			borderColor: 'rgba(0,0,0,0.4)',
			borderWidth: 2,
			borderJoinStyle: 'round',
			backgroundColor: 'rgba(0,0,0,0.3)',
			tension: 0.5,
			fill: true,
		},
		bar: {
			backgroundColor: 'rgba(0,0,0,0.3)',
		},
		point: {
			radius: 2,
			hoverRadius: 6,
			borderWidth: 2,
			hitRadius: 5,
		},
	},
	scales: {
		x: {
			grid: {
				color: store.chartType === 'bar' ? 'transparent' : 'rgba(0,0,0,0.05)',
				drawTicks: false,
			},
		},
		y: {
			grid: {
				color: 'rgba(0,0,0,0.05)',
				drawTicks: false,
			},
			ticks: {
				beginAtZero: true,
			},
		},
	},
}));

const mergedOptions = computed(() =>
	merge(defaultChartOptions.value, props.chartOptions),
);

onMounted(() => {
	if (!canvasRef.value || !store.hasData) return;

	const {dataArray, labelsArray} = store.buildChartArrays();

	chartInstance = new Chart(canvasRef.value, {
		type: store.chartType,
		data: {
			labels: labelsArray,
			datasets: [
				{
					label: store.statsData?.label ?? '',
					data: dataArray,
				},
			],
		},
		options: mergedOptions.value,
	});
});

onUnmounted(() => {
	if (chartInstance) {
		chartInstance.destroy();
		chartInstance = null;
	}
});
</script>
