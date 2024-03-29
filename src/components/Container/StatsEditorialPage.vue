<script>
import StatsPage from '@/components/Container/StatsPage.vue';
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import debounce from 'debounce';

export default {
	name: 'StatsEditorialPage',
	components: {
		DoughnutChart,
		Tooltip,
	},
	extends: StatsPage,
	data() {
		return {
			activeByStage: [],
			averages: {},
			averagesApiUrl: '',
			isLoading: false,
			percentageStats: [],
			tableRows: [],
		};
	},
	computed: {
		/**
		 * Compile the data to pass to the DoughnutChart component
		 *
		 * @return {Object|null}
		 */
		chartData() {
			if (!this.activeByStage.length) {
				return null;
			}
			return {
				labels: this.activeByStage.map((stage) => stage.name),
				datasets: [
					{
						data: this.activeByStage.map((stage) => stage.count),
						backgroundColor: this.activeByStage.map((stage) => stage.color),
					},
				],
			};
		},

		/**
		 * The params to send with each GET request
		 *
		 * @return {Object}
		 */
		getParams() {
			let params = {
				...this.activeFilters,
			};

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			return params;
		},

		/**
		 * Total count of active submissions
		 *
		 * @return {Number}
		 */
		totalActive() {
			return this.activeByStage.reduce((a, b) => a + b.count, 0);
		},
	},
	methods: {
		/**
		 * Get statistics from the server based on the current params
		 */
		get: debounce(async function () {
			let self = this;
			let latestDateRangeGetRequest = $.pkp.classes.Helper.uuid();
			let latestTotalsGetRequest = $.pkp.classes.Helper.uuid();
			let latestAveragesGetRequest = $.pkp.classes.Helper.uuid();
			this.isLoading = true;

			// Track when the API responses come back
			// We won't process any updates to data until both responses
			// are back.
			let dateRangeResponse = [];
			let totalsResponse = [];
			let averagesResponse = {};

			const NetworkError = function (response) {
				this.response = response;
			};

			// Get stats within date range
			const dateRangePromise = new Promise((resolve, reject) =>
				$.ajax({
					url: this.apiUrl,
					type: 'GET',
					data: this.getParams,
					_uuid: latestDateRangeGetRequest,
					error(r) {
						if (latestDateRangeGetRequest !== this._uuid) {
							return;
						}
						self.ajaxErrorCallback(r);
						reject(new NetworkError(r));
					},
					success(r) {
						if (latestDateRangeGetRequest !== this._uuid) {
							return;
						}
						dateRangeResponse = r;
						resolve(r);
					},
				}),
			);

			// Get total stats
			let totalParams = {...this.getParams};
			delete totalParams['dateStart'];
			delete totalParams['dateEnd'];
			const totalsPromise = new Promise((resolve, reject) =>
				$.ajax({
					url: this.apiUrl,
					type: 'GET',
					data: totalParams,
					_uuid: latestTotalsGetRequest,
					error(r) {
						if (latestTotalsGetRequest !== this._uuid) {
							return;
						}
						self.ajaxErrorCallback(r);
						reject(new NetworkError(r));
					},
					success(r) {
						if (latestTotalsGetRequest !== this._uuid) {
							return;
						}
						totalsResponse = r;
						resolve(r);
					},
				}),
			);

			// Get average stats
			const averagesPromise = new Promise((resolve, reject) =>
				$.ajax({
					url: this.averagesApiUrl,
					type: 'GET',
					data: this.getParams,
					_uuid: latestAveragesGetRequest,
					error(r) {
						if (latestAveragesGetRequest !== this._uuid) {
							return;
						}
						self.ajaxErrorCallback(r);
						reject(new NetworkError(r));
					},
					success(r) {
						if (latestAveragesGetRequest !== this._uuid) {
							return;
						}
						averagesResponse = r;
						resolve(r);
					},
				}),
			);

			try {
				await Promise.all([dateRangePromise, totalsPromise, averagesPromise]);
				let tableRows = this.tableRows.map((row) => {
					const dateRange = dateRangeResponse.find((i) => i.key === row.key);
					const total = totalsResponse.find((i) => i.key === row.key);
					if (this.percentageStats.includes(row.key)) {
						row.dateRange = Number(dateRange.value * 100).toFixed(0) + '%';
						row.total = Number(total.value * 100).toFixed(0) + '%';
					} else {
						row.dateRange = dateRange.value;
						row.total = total.value;
					}
					if (
						Object.prototype.hasOwnProperty.call(averagesResponse, row.key) &&
						averagesResponse[row.key] > -1 &&
						total.value > 0
					) {
						row.total = this.t('stats.countWithYearlyAverage', {
							count: row.total,
							average: averagesResponse[row.key],
						});
					}
					return row;
				});
				this.tableRows = [];
				this.tableRows = tableRows;
				this.isLoading = false;
			} catch (error) {
				// Ignores the NetworkError, as it's handled by the ajaxErrorCallback
				if (!(error instanceof NetworkError)) {
					throw error;
				}
			} finally {
				this.isLoading = false;
			}
		}, 0),

		/**
		 * Update the string identifying the current date range when
		 * it changes
		 *
		 * Bound to an event emerging from the DateRange component
		 */
		setCurrentDateRange(range) {
			this.tableColumns[1].label = range;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStats--editorial__stageWrapper {
	position: relative;
	min-height: 256px;
}

.pkpStats--editorial__stageChartWrapper {
	float: left;
	width: 256px;
	.chartjs-render-monitor {
		margin-left: auto;
		margin-right: auto;
		max-width: 256px;
	}
}

.pkpStats--editorial__stageList {
	position: absolute;
	top: 50%;
	left: 256px;
	width: 65%;
	transform: translateY(-50%);
}

.pkpStats--editorial__stage {
	display: inline-block;
	margin-top: 2rem;
	margin-right: 1.5rem;
}

.pkpStats--editorial__stageCount {
	display: block;
	font-size: @font-lead;
	font-weight: @bold;
	line-height: 1em;
}

.pkpStats--editorial__stageLabel {
	display: block;
	font-size: @font-sml;
	line-height: 1.25em;
}

.pkpStats--editorial__stage--total {
	display: block;
	margin-top: 0;

	.pkpStats--editorial__stageCount {
		font-size: 48px;
	}

	.pkpStats--editorial__stageLabel {
		font-size: @font-base;
	}
}

.pkpStats--editorial .pkpStats__sidebarHeader {
	margin-top: 2rem; // align filters with table header
}

.pkpTable--editorialStats th:not(:first-child),
.pkpTable--editorialStats td:not(:first-child) {
	max-width: 6em;
}
</style>
