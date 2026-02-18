import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const usePkpUsageChartStore = defineStore('pkpUsageChart', () => {
	// State
	const chartType = ref('bar');
	const statsData = ref(null);
	const monthLabels = ref([]);
	const chartOptions = ref({});
	const initialized = ref(false);

	// Computed
	const hasData = computed(() => {
		return (
			statsData.value?.data && Object.keys(statsData.value.data).length > 0
		);
	});

	// Actions
	function initialize(config) {
		if (!config) return;
		chartType.value = config.chartType ?? 'bar';
		statsData.value = config.statsData ?? null;
		monthLabels.value = config.monthLabels ?? [];
		chartOptions.value = config.chartOptions ?? {};
		initialized.value = true;
	}

	/**
	 * Transform {year: {month: value}} into 12-month rolling arrays
	 * starting from the month after the current month last year
	 * through the current month this year.
	 *
	 * @returns {{dataArray: number[], labelsArray: string[]}}
	 */
	function buildChartArrays() {
		const dataArray = [];
		const labelsArray = [];
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth(); // 0-indexed

		const data = statsData.value?.data ?? {};

		// Get the data from the last year (months after current month)
		for (let month = currentMonth + 1; month <= 11; month++) {
			if (!(currentYear - 1 in data)) {
				dataArray.push(0);
			} else {
				dataArray.push(data[currentYear - 1][month + 1] ?? 0);
			}
			labelsArray.push(monthLabels.value[month] ?? '');
		}
		// Get the data from the current year (months up to current month)
		for (let month = 0; month <= currentMonth; month++) {
			if (!(currentYear in data)) {
				dataArray.push(0);
			} else {
				dataArray.push(data[currentYear][month + 1] ?? 0);
			}
			labelsArray.push(monthLabels.value[month] ?? '');
		}

		return {dataArray, labelsArray};
	}

	return {
		// State
		chartType,
		statsData,
		monthLabels,
		chartOptions,
		initialized,

		// Computed
		hasData,

		// Actions
		initialize,
		buildChartArrays,
	};
});
