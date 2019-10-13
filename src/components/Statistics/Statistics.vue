<script>
import DateRange from '@/components/DateRange/DateRange.vue';
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import debounce from 'debounce';

export default {
	components: {
		DateRange,
		ListPanelFilter,
		ListPanelSearch,
		PageHeader,
		Pagination,
		PkpButton,
		PkpTable,
		TableCell,
	},
	data: function () {
		return {
			apiUrl: '',
			timeSegment: '',
			timeSegments: null,
			items: [],
			itemsMax: 0,
			tableColumns: [],
			count: 30,
			offset: 0,
			searchPhrase: '',
			dateStart: '',
			dateEnd: '',
			dateEndMax: '',
			dateRangeOptions: [],
			orderBy: '',
			orderDirection: false,
			filters: {},
			activeFilters: {},
			isFilterVisible: false,
			isLoading: false,
			i18n: {},
		};
	},
	computed: {
		/**
		 * The current page of results
		 *
		 * @return Number
		 */
		currentPage: function () {
			return Math.floor(this.offset / this.count) + 1;
		},

		/**
		 * The number of pages of items that are available
		 *
		 * @return Number
		 */
		lastPage: function () {
			return Math.ceil(this.itemsMax / this.count);
		},

		/**
		 * Is the current date range within a range that allows daily
		 * time segments to be shown?
		 *
		 * @return Boolean
		 */
		isDailySegmentEnabled: function () {
			if (!this.dateStart || !this.dateEndMax) {
				return false;
			}
			return this.getDaysBetween(new Date(this.dateStart), new Date(this.dateEndMax)) < 91;
		},

		/**
		 * Is the current date range within a range that allows monthly
		 * time segments to be shown?
		 *
		 * @return Boolean
		 */
		isMonthlySegmentEnabled: function () {
			if (!this.dateStart || !this.dateEnd || !this.isDailySegmentEnabled) {
				return true;
			}
			return new Date(this.dateStart).getMonth() !== new Date(this.dateEnd).getMonth() ||
				new Date(this.dateStart).getYear() !== new Date(this.dateEnd).getYear();
		},

		/**
		 * Are there any filters for this stats panel
		 *
		 * @return Boolean
		 */
		hasFilters: function () {
			return Object.keys(this.filters).length > 0;
		},
	},
	methods: {
		/**
		 * Process the API response
		 *
		 * @param object Response
		 */
		processResponse (response) {
			throw new Error('The method processResponse must be overwritten.');
		},

		/**
		 * Set the date range
		 *
		 * @param string dateStart
		 * @param string dateEnd
		 */
		setDateRange: function (dateStart, dateEnd) {
			this.dateStart = dateStart;
			this.dateEnd = dateEnd;
		},

		/**
		 * Set the time segment for the graph
		 *
		 * @param string timeSegment
		 */
		setTimeSegment: function (timeSegment) {
			this.timeSegment = timeSegment;
		},

		/**
		 * Set the current page
		 *
		 * @param number page
		 */
		setPage: function (page) {
			this.offset = (page - 1) * this.count;
		},

		/**
		 * Set the orderBy and orderDirection values
		 *
		 * @param string orderBy What param to order by
		 * @param boolean orderDirection true = DESC, false = ASC
		 */
		setOrderBy: function (orderBy, orderDirection) {
			this.orderBy = orderBy;
			this.orderDirection = orderDirection;
		},

		/**
		 * Set the search phrase
		 *
		 * @param string val
		 */
		setSearchPhrase: function (val) {
			this.searchPhrase = val;
		},

		/**
		 * Get statistics from the server based on the current params
		 */
		get: debounce(function () {
			let self = this;

			this.isLoading = true;

			// Address issues with multiple async get requests. Store an ID for the
			// most recent get request. When we receive the response, we
			// can check that the response matches the most recent get request, and
			// discard responses that are outdated.
			this._latestGetRequest = $.pkp.classes.Helper.uuid();

			let params = {
				...this.activeFilters,
				count: this.count,
				offset: this.offset,
			};

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			if (this.timeSegment) {
				params.timeSegment = this.timeSegment;
			}

			if (this.searchPhrase) {
				params.searchPhrase = this.searchPhrase;
			}

			if (this.orderBy) {
				params.orderBy = this.orderBy;
				params.orderDirection = this.orderDirection ? 'DESC' : 'ASC';
			}

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: params,
				_uuid: this._latestGetRequest,
				error: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}
					self.ajaxErrorCallback(r);
				},
				success: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}
					self.processResponse(r);
				},
				complete: function (r) {

					// Only process latest request response
					if (self._latestGetRequest !== this._uuid) {
						return;
					}

					self.isLoading = false;
				},
			});
		}, 0),

		/**
		 * Toggle filter visibility
		 */
		toggleFilter: function () {
			this.isFilterVisible = !this.isFilterVisible;
			if (!this.isFilterVisible) {
				this.updateFilter({});
			}
		},

		/**
		 * Update filter parameters
		 */
		updateFilter: function (params) {
			this.activeFilters = params;
		},

		/**
		 * Get the number of days betweeen two dates
		 *
		 * This could probably be moved into a general function somewhere.
		 *
		 * @param Date dateStart
		 * @param Date dateEnd
		 * @return Number
		 */
		getDaysBetween (dateStart, dateEnd) {
			const millisecondsPerDay = 24 * 60 * 60 * 1000;

			// Handle timezone offsets if date goes over Daylight Savings Time
			// See: https://stackoverflow.com/a/11252167
			dateStart.setMinutes(dateStart.getMinutes() - dateStart.getTimezoneOffset());
			dateEnd.setMinutes(dateEnd.getMinutes() - dateEnd.getTimezoneOffset());

			return (dateEnd - dateStart) / millisecondsPerDay;
		},
	},
	watch: {
		activeFilters: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		count: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.get();
		},
		dateEnd: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		dateStart: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		isDailySegmentEnabled: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (!newVal) {
				this.timeSegment = 'month';
			}
		},
		isMonthlySegmentEnabled: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (!newVal) {
				this.timeSegment = 'day';
			}
		},
		orderBy: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		orderDirection: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		offset: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.get();
		},
		searchPhrase: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			debounce(this.get(), 250);
		},
		timeSegment: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
	},
};
</script>

<style lang="less">
@import 'Statistics.less';
</style>
