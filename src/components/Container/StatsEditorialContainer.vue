<script>
import StatsContainer from '@/components/Container/StatsContainer.vue';
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import debounce from 'debounce';

export default {
	extends: StatsContainer,
	components: {
		DoughnutChart,
		Tooltip
	},
	data() {
		return {
			activeByStage: [],
			isLoading: false,
			percentageStats: [],
			tableRows: []
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
				labels: this.activeByStage.map(stage => stage.name),
				datasets: [
					{
						data: this.activeByStage.map(stage => stage.count),
						backgroundColor: this.activeByStage.map(stage => stage.color)
					}
				]
			};
		},

		/**
		 * The params to send with each GET request
		 *
		 * @return {Object}
		 */
		getParams() {
			let params = {
				...this.activeFilters
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
		}
	},
	methods: {
		/**
		 * Get statistics from the server based on the current params
		 */
		get: debounce(function() {
			let self = this;
			this.isLoading = true;
			this.latestDateRangeGetRequest == $.pkp.classes.Helper.uuid();
			this.latestTotalsGetRequest == $.pkp.classes.Helper.uuid();

			// Track when the API responses come back
			// We won't process any updates to data until both responses
			// are back.
			let dateRangeFinished = false;
			let totalsFinished = false;
			let dateRangeResponse = [];
			let totalsResponse = [];

			// Get stats within date range
			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: this.getParams,
				_uuid: this.latestDateRangeGetRequest,
				error(r) {
					if (self.latestDateRangeGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestDateRangeGetRequest !== this._uuid) {
						return;
					}
					dateRangeResponse = r;
				},
				complete(r) {
					if (self.latestDateRangeGetRequest !== this._uuid) {
						return;
					}
					dateRangeFinished = true;
				}
			});

			// Get total stats
			let totalParams = {...this.getParams};
			delete totalParams['dateStart'];
			delete totalParams['dateEnd'];
			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: totalParams,
				_uuid: this.latestTotalsGetRequest,
				error(r) {
					if (self.latestTotalsGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestTotalsGetRequest !== this._uuid) {
						return;
					}
					totalsResponse = r;
				},
				complete(r) {
					if (self.latestTotalsGetRequest !== this._uuid) {
						return;
					}
					totalsFinished = true;
				}
			});

			// Update stats when both responses are back
			const interval = setInterval(() => {
				if (!dateRangeFinished || !totalsFinished) {
					return;
				}
				let tableRows = this.tableRows.map(row => {
					const dateRange = dateRangeResponse.find(i => i.key === row.key);
					const total = totalsResponse.find(i => i.key === row.key);
					if (this.percentageStats.includes(row.key)) {
						row.dateRange = dateRange.value * 100 + '%';
						row.total = total.value * 100 + '%';
					} else {
						row.dateRange = dateRange.value;
						row.total = total.value;
					}
					return row;
				});
				this.tableRows = [];
				this.tableRows = tableRows;
				this.isLoading = false;
				clearInterval(interval);
			}, 20);
		}, 0),

		/**
		 * Update the string identifying the current date range when
		 * it changes
		 *
		 * Bound to an event emerging from the DateRange component
		 */
		setCurrentDateRange(range) {
			this.tableColumns[1].label = range;
		}
	}
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

.pkpTable--editorialStats {
	margin-top: 0.5em;
}

.pkpTable--editorialStats th:not(:first-child),
.pkpTable--editorialStats td:not(:first-child) {
	max-width: 6em;
}
</style>
