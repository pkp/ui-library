<script>
import StatsPage from '@/components/Container/StatsPage.vue';
import ActionPanel from '../ActionPanel/ActionPanel.vue';
import LineChart from '@/components/Chart/LineChart.vue';
import Search from '@/components/Search/Search.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Modal from '@/components/Modal/Modal.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import debounce from 'debounce';

export default {
	name: 'StatsPublicationsPage',
	extends: StatsPage,
	components: {
		ActionPanel,
		LineChart,
		Search,
		List,
		ListItem,
		Modal,
		Tooltip,
	},
	data() {
		return {
			count: 30,
			items: [],
			itemsMax: 0,
			offset: 0,
			searchPhrase: '',
			timeline: [],
			timelineInterval: '',
			timelineType: '',
			orderBy: '',
			orderDirection: false,
			isLoadingTimeline: false,
			latestTimelineGetRequest: '',
			isDownloadingReport: false,
			isModalOpenedDownloadReport: false,
		};
	},
	computed: {
		/**
		 * Compile the data to pass to the LineChart component
		 *
		 * @return Object|null
		 */
		chartData() {
			if (!this.timeline.length) {
				return null;
			}
			return {
				labels: this.timeline.map((segment) => segment.label),
				datasets: [
					{
						data: this.timeline.map((segment) => segment.value),
					},
				],
			};
		},

		/**
		 * The current page of results
		 *
		 * @return Number
		 */
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
		},

		/**
		 * The number of pages of items that are available
		 *
		 * @return Number
		 */
		lastPage() {
			return Math.ceil(this.itemsMax / this.count);
		},

		/**
		 * Is the current date range within a range that allows daily
		 * time segments to be shown?
		 *
		 * @return Boolean
		 */
		isDailyIntervalEnabled() {
			if (!this.dateStart || !this.dateEnd) {
				return false;
			}
			return (
				this.getDaysBetween(
					this.getBrowserSafeDate(this.dateStart),
					this.getBrowserSafeDate(this.dateEnd)
				) < 91
			);
		},

		/**
		 * Is the current date range within a range that allows monthly
		 * time segments to be shown?
		 *
		 * @return Boolean
		 */
		isMonthlyIntervalEnabled() {
			if (!this.dateStart || !this.dateEnd || !this.isDailyIntervalEnabled) {
				return true;
			}
			return (
				this.getDaysBetween(
					this.getBrowserSafeDate(this.dateStart),
					this.getBrowserSafeDate(this.dateEndMax)
				) > 31
			);
		},
	},
	methods: {
		/**
		 * The params to send with each GET request
		 *
		 * @param string
		 * @return Object
		 */
		getParams(type) {
			let params = {
				...this.activeFilters,
			};

			if (type != 'timeline') {
				(params.count = this.count), (params.offset = this.offset);
			}

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			if (this.searchPhrase) {
				params.searchPhrase = this.searchPhrase;
			}

			if (type == 'timeline') {
				if (this.timelineInterval) {
					params.timelineInterval = this.timelineInterval;
				}
				if (this.timelineType == 'files') {
					params.type = this.timelineType;
				}
			}

			if (type != 'timeline' && this.orderBy) {
				params.orderBy = this.orderBy;
				params.orderDirection = this.orderDirection ? 'DESC' : 'ASC';
			}

			return params;
		},

		/**
		 * Get active filter titles of the given filter set to display on the download report modal
		 *
		 * @param Object
		 * @return string
		 */
		getFilterDescription(filterSet) {
			let filterTitles = [];
			Object.values(filterSet.filters).forEach((filter) => {
				if (
					filter.param in this.activeFilters &&
					this.activeFilters[filter.param].includes(filter.value)
				) {
					filterTitles.push(filter.title.trim());
				}
			});
			let description = this.replaceLocaleParams(this.allFiltersLabel, {
				filter: filterSet.heading,
			});
			if (filterTitles.length != 0) {
				description = filterTitles.join(this.__('common.commaListSeparator'));
			}
			return description;
		},

		/**
		 * Get timeline type label
		 *
		 * @return string
		 */
		getTimelineTypeLabel() {
			let tielineTypeLabel = this.viewsLabel;
			if (this.timelineType == 'files') {
				tielineTypeLabel = this.downloadsLabel;
			}
			return tielineTypeLabel;
		},

		/**
		 * Get timeline type label
		 *
		 * @return string
		 */
		getTimelineIntervalLabel() {
			let tielineIntervalLabel = this.monthLabel;
			if (this.timelineInterval == 'day') {
				tielineIntervalLabel = this.dayLabel;
			}
			return tielineIntervalLabel;
		},

		/**
		 * Get description for timeline report to display on the download report modal
		 *
		 * @return string
		 */
		getTimelineDescription() {
			return this.replaceLocaleParams(this.timelineDescriptionLabel, {
				type: this.getTimelineTypeLabel().toLowerCase(),
				interval: this.getTimelineIntervalLabel().toLowerCase(),
			});
		},

		/**
		 * Get date range description to display on the download report modal
		 *
		 * @return string
		 */
		getDateRangeDescription() {
			if (!this.dateStart && !this.dateEnd) {
				return this.allDatesLabel;
			}
			return this.replaceLocaleParams(this.betweenDatesLabel, {
				startDate: this.dateStart,
				endDate: this.dateEnd,
			});
		},

		/**
		 * Get the report parameters
		 *
		 * @param string
		 * @return Object
		 */
		getReportParams(type) {
			let params = {
				...this.activeFilters,
			};

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			if (this.searchPhrase) {
				params.searchPhrase = this.searchPhrase;
			}

			if (type == 'timeline') {
				if (this.timelineInterval) {
					params.timelineInterval = this.timelineInterval;
				}
			}

			if (type != 'timeline' && this.orderBy) {
				params.orderBy = this.orderBy;
				params.orderDirection = this.orderDirection ? 'DESC' : 'ASC';
			}

			return params;
		},

		/**
		 * Get report file name part by type
		 *
		 * @return string
		 */
		getReportFileNamePart(type) {
			return type
				? type == 'timeline'
					? 'submissions_timeline'
					: type
				: 'submissions';
		},

		/**
		 * Download the CSV report based on the current params
		 *
		 * @param string
		 */
		downloadReport(type) {
			this.isDownloadingReport = true;

			let downloadFileName =
				[
					'stats',
					this.getReportFileNamePart(type),
					new Date().toISOString().slice(0, -5).replace(':', '-'),
				].join('_') + '.csv';

			let dateRangeRow =
				'"' +
				this.dateRangeLabel +
				'","' +
				this.getDateRangeDescription() +
				'"\n';
			let filtersRow = [];
			Object.values(this.filters).forEach((filterSet) => {
				filtersRow.push(
					'"' +
						filterSet.heading +
						'","' +
						this.getFilterDescription(filterSet) +
						'"'
				);
			});
			let searchPhraseRow = this.searchPhrase
				? '"' + this.searchPhraseLabel + '","' + this.searchPhrase + '"\n'
				: '';

			let timelineTypeRow =
				'"' +
				this.timelineTypeLabel +
				'","' +
				this.getTimelineTypeLabel() +
				'"\n';
			let timelineIntervalRow =
				'"' +
				this.timelineIntervalLabel +
				'","' +
				this.getTimelineIntervalLabel() +
				'"\n';

			$.ajax({
				url:
					this.apiUrl +
					(type ? '/' + type : '') +
					(type == 'timeline' && this.timelineType == 'files'
						? '?type=files'
						: ''),
				type: 'GET',
				context: this,
				headers: {
					Accept: 'text/csv; charset=utf-8',
					'Content-Type': 'text/csv;·charset_utf-8',
				},
				data: this.getReportParams(type),
				error: this.ajaxErrorCallback,
				success(r) {
					r =
						dateRangeRow +
						(filtersRow.length > 0 ? filtersRow.join('\n') + '\n' : '') +
						searchPhraseRow +
						(type == 'timeline' ? timelineTypeRow + timelineIntervalRow : '') +
						r;
					var blob = new Blob([r]);
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = downloadFileName;
					link.click();
				},
				complete(r) {
					this.isDownloadingReport = false;
					this.$modal.hide('export');
				},
			});
		},

		/**
		 * Get statistics from the server based on the current params
		 */
		get: debounce(function () {
			this.getItems();
			this.getTimeline();
		}, 0),

		/**
		 * Set items and itemsMax from the API call result
		 */
		setItems(result) {
			let self = this;
			self.items = result.items.map((row) => {
				row.total = row.abstractViews + row.galleyViews;
				return row;
			});
			self.itemsMax = result.itemsMax;
		},

		/**
		 * Get the list of items from the server based on the current params
		 */
		getItems() {
			let self = this;

			this.isLoadingItems = true;
			this.latestItemsGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: this.getParams(),
				_uuid: this.latestItemsGetRequest,
				error(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.setItems(r);
				},
				complete(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.isLoadingItems = false;
				},
			});
		},

		/**
		 * Get the timeline data from the server based on the current params
		 */
		getTimeline() {
			let self = this;

			this.isLoadingTimeline = true;
			this.latestTimelineGetRequest = $.pkp.classes.Helper.uuid();

			$.ajax({
				url: this.apiUrl + '/timeline',
				type: 'GET',
				data: this.getParams('timeline'),
				_uuid: this.latestTimelineGetRequest,
				error(r) {
					if (self.latestTimelineGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success(r) {
					if (self.latestTimelineGetRequest !== this._uuid) {
						return;
					}
					self.timeline = r;
				},
				complete(r) {
					if (self.latestTimelineGetRequest !== this._uuid) {
						return;
					}
					self.isLoadingTimeline = false;
				},
			});
		},

		/**
		 * Set the orderBy and orderDirection values
		 *
		 * @param string orderBy What param to order by
		 * @param boolean orderDirection true = DESC, false = ASC
		 */
		setOrderBy(orderBy, orderDirection) {
			this.orderBy = orderBy;
			this.orderDirection = orderDirection;
		},

		/**
		 * Set the current page
		 *
		 * @param number page
		 */
		setPage(page) {
			this.offset = (page - 1) * this.count;
		},

		/**
		 * Set the search phrase
		 *
		 * @param string val
		 */
		setSearchPhrase(val) {
			this.searchPhrase = val;
		},

		/**
		 * Set the timeline type for the graph
		 *
		 * @param string timelineType
		 */
		setTimelineType(timelineType) {
			this.timelineType = timelineType;
		},

		/**
		 * Set the time segment for the graph
		 *
		 * @param string timelineInterval
		 */
		setTimelineInterval(timelineInterval) {
			this.timelineInterval = timelineInterval;
		},
	},
	mounted() {
		/**
		 * Load the items
		 */
		this.getItems();
	},
	watch: {
		count(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getItems();
		},
		isDailyIntervalEnabled(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (!newVal) {
				this.timelineInterval = 'month';
			}
		},
		isMonthlyIntervalEnabled(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (!newVal) {
				this.timelineInterval = 'day';
			}
		},
		orderBy(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.getItems();
		},
		orderDirection(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.getItems();
		},
		offset(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getItems();
		},
		searchPhrase(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			debounce(this.get(), 250);
		},
		timelineInterval(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getTimeline();
		},
		timelineType(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getTimeline();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStats__sidebarHeader + .pkpStats__filterSet .pkpHeader {
	padding-top: 0;
}

.pkpStats__reportParams {
	th {
		font-weight: @bold;
		border-right: @grid-border;
	}
}

.pkpStats__reportAction {
	margin: 2rem 0;
}
</style>
