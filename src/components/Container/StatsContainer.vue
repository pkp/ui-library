<script>
import DateRange from '@/components/DateRange/DateRange.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import Icon from '@/components/Icon/Icon.vue';
import LineChart from '@/components/Chart/LineChart.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpTable from '@/components/Table/Table.vue';
import Search from '@/components/Search/Search.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import TableCell from '@/components/Table/TableCell.vue';
import debounce from 'debounce';

export default {
	components: {
		DateRange,
		PkpFilter,
		Icon,
		LineChart,
		Pagination,
		PkpButton,
		PkpHeader,
		PkpTable,
		Search,
		Spinner,
		TableCell
	},
	data() {
		return {
			apiUrl: '',
			timeline: [],
			timelineInterval: '',
			timelineType: '',
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
			filters: [],
			activeFilters: {},
			isSidebarVisible: false,
			isLoadingItems: false,
			isLoadingTimeline: false,
			latestItemsGetRequest: '',
			latestTimelineGetRequest: '',
			i18n: {}
		};
	},
	computed: {
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
		 * Compile the data to pass to the LineChart component
		 *
		 * @return Object|null
		 */
		chartData() {
			if (!this.timeline.length) {
				return null;
			}
			return {
				labels: this.timeline.map(segment => segment.label),
				datasets: [
					{
						data: this.timeline.map(segment => segment.value)
					}
				]
			};
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
				this.getDaysBetween(new Date(this.dateStart), new Date(this.dateEnd)) <
				91
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
				new Date(this.dateStart).getMonth() !==
					new Date(this.dateEnd).getMonth() ||
				new Date(this.dateStart).getYear() !== new Date(this.dateEnd).getYear()
			);
		},

		/**
		 * Add a class to the sidebar when it is visible
		 *
		 * @return Array
		 */
		sidebarClasses() {
			let classes = [];
			if (this.isSidebarVisible) {
				classes.push('-isVisible');
			}
			return classes;
		},

		/**
		 * The params to send with each GET request
		 *
		 * @return Object
		 */
		getParams() {
			let params = {
				...this.activeFilters,
				count: this.count,
				offset: this.offset
			};

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			if (this.timelineInterval) {
				params.timelineInterval = this.timelineInterval;
			}

			if (this.searchPhrase) {
				params.searchPhrase = this.searchPhrase;
			}

			if (this.orderBy) {
				params.orderBy = this.orderBy;
				params.orderDirection = this.orderDirection ? 'DESC' : 'ASC';
			}

			return params;
		}
	},
	methods: {
		/**
		 * Check if a filter is currently active
		 *
		 * @param {String} param
		 * @param {mixed} value
		 * @return {Boolean}
		 */
		isFilterActive: function(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			}
			if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			}
			return this.activeFilters[param] === value;
		},

		/**
		 * Set the date range
		 *
		 * @param string dateStart
		 * @param string dateEnd
		 */
		setDateRange(dateStart, dateEnd) {
			this.dateStart = dateStart;
			this.dateEnd = dateEnd;
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

		/**
		 * Set the current page
		 *
		 * @param number page
		 */
		setPage(page) {
			this.offset = (page - 1) * this.count;
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
		 * Set the search phrase
		 *
		 * @param string val
		 */
		setSearchPhrase(val) {
			this.searchPhrase = val;
		},

		/**
		 * Get statistics from the server based on the current params
		 */
		get: debounce(function() {
			this.getItems();
			this.getTimeline();
		}, 0),

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
				data: this.getParams,
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
					self.items = r.items.map(row => {
						row.total = row.abstractViews + row.galleyViews;
						return row;
					});
					self.itemsMax = r.itemsMax;
				},
				complete(r) {
					if (self.latestItemsGetRequest !== this._uuid) {
						return;
					}
					self.isLoadingItems = false;
				}
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
				url: this.apiUrl + '/' + this.timelineType,
				type: 'GET',
				data: this.getParams,
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
				}
			});
		},

		/**
		 * Toggle filter visibility
		 */
		toggleSidebar() {
			this.isSidebarVisible = !this.isSidebarVisible;
			if (!this.isSidebarVisible) {
				this.activeFilters = {};
				this.get();
			}
		},

		/**
		 * Add a filter
		 *
		 * Adds the value to the array of existing values for
		 * this param. Use this method for filters which accept
		 * more than one value for the param. For example, a
		 * list of valid stageIds.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter: function(param, value) {
			if (this.isFilterActive(param, value)) {
				return;
			}
			let filters = {...this.activeFilters};
			if (filters[param] === undefined) {
				filters[param] = [];
			}
			filters[param].push(value);
			this.activeFilters = filters;
			this.get();
		},

		/**
		 * Remove a filter
		 *
		 * Removes one value from the array of values for this
		 * param. Use this method for filters that use addFilter.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter: function(param, value) {
			if (this.activeFilters[param] === undefined) {
				return;
			}
			let filters = {...this.activeFilters};
			filters[param] = filters[param].filter(filterVal => filterVal !== value);
			this.activeFilters = filters;
			this.get();
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
		getDaysBetween(dateStart, dateEnd) {
			const millisecondsPerDay = 24 * 60 * 60 * 1000;

			// Handle timezone offsets if date goes over Daylight Savings Time
			// See: https://stackoverflow.com/a/11252167
			dateStart.setMinutes(
				dateStart.getMinutes() - dateStart.getTimezoneOffset()
			);
			dateEnd.setMinutes(dateEnd.getMinutes() - dateEnd.getTimezoneOffset());

			return (dateEnd - dateStart) / millisecondsPerDay;
		},

		/**
		 * Set the tabindex on items in the sidebar to allow/prevent
		 * them from accepting focus
		 *
		 * @param {Boolean} enable
		 */
		setSidebarFocus() {
			if (!this.$refs.sidebar) {
				return;
			}
			const tabIndex = this.isSidebarVisible ? 0 : -1;
			this.$refs.sidebar
				.querySelectorAll('button, [href], input, select, textarea')
				.forEach(el => (el.tabIndex = tabIndex));
		}
	},
	watch: {
		activeFilters(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		count(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getItems();
		},
		dateEnd(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
		},
		dateStart(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.offset = 0;
			this.get();
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
		isSidebarVisible(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.setSidebarFocus();

			// move focus into the sidebar when it is made visible
			if (newVal) {
				this.$nextTick(() => {
					if (newVal && Object.keys(this.$refs).includes('sidebar')) {
						this.setFocusIn(this.$refs.sidebar);
					}
				});
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
		}
	},
	mounted() {
		/**
		 * Load the items
		 */
		this.getItems();

		/**
		 * Set the initial tabindex attributes in the sidebar
		 */
		this.setSidebarFocus();
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStats > .pkpHeader {
	padding: 0.5rem 0;
}

.pkpStats__content {
	margin-left: 0;
	transition: margin-left 0.2s;
}

.pkpStats__sidebar {
	position: absolute;
	left: -9999px;
	opacity: 0;
	width: 0;

	+ .pkpStats__content {
		float: right;
		width: 100%;
		transition: width 0.2s;
	}

	.pkpHeader,
	.pkpFilter {
		margin-left: -@base;
	}
}

.pkpStats__sidebar.-isVisible {
	float: left;
	position: relative;
	left: 0;
	width: 25%;
	opacity: 1;
	transition: opacity 0.2s ease-in-out 0.2s, left 0s ease-in-out 0.1s,
		width 0.2s ease-in-out 0s;

	+ .pkpStats__content {
		width: 75%;
	}
}

.pkpStats__sidebarHeader {
	margin-top: 1rem;
	padding: 0 1rem;

	&:focus {
		box-shadow: inset 2px 0 0 @primary;
		outline: 0;
	}

	.pkpHeader__title {
		font-size: @font-sml;
	}
}

.pkpStats__filterSet {
	margin: 1rem 0;

	.pkpHeader {
		padding: 0 1rem;
		line-height: 1.2em;
		color: @text-light;

		&:focus {
			outline: 0;
		}
	}

	.pkpHeader__title {
		font-size: @font-tiny;
	}
}

.pkpStats__tableHeader {
	margin-top: 2rem;
}

.pkpStats__tableTitle {
	display: inline-block;
	margin: 0;
	font-size: @font-base;
	line-height: 1.5em;

	.pkpSpinner {
		margin-left: 0.5rem;
	}
}

.pkpStats__tableActions {
	float: right;
	margin-left: 1rem;
}

.pkpStats__itemsOfTotal {
	font-size: @font-tiny;
}

.pkpStats__titleSearch {
	display: inline-block;
	float: none;
	margin-top: 0;
	margin-left: 1rem;
	max-width: 20em;

	.pkpSearch__input {
		font-size: @font-tiny;
		line-height: 2.5em;
		padding-left: 2.5rem;
	}
}

.pkpStats__itemLink {
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @primary;
		text-decoration: underline;
		outline: 5px solid transparent;
	}
}

.pkpStats__itemAuthors {
	font-weight: @bold;
}

.pkpStats__noRecords {
	padding: @double @base;
	border: @grid-border;
	border-top: none;
	font-size: @font-sml;
	text-align: center;
	color: @text-light;
}

.pkpStats__graph {
	background: @bg-anchor;
	color: #fff;
	border-radius: @radius;

	.chartjs-render-monitor {
		border-radius: @radius;
	}
}

.pkpStats__graphHeader {
	padding: @base;
}

.pkpStats__graphSelectors {
	display: flex;
	align-items: center;
}

.pkpStats__graphSelector {
	display: flex;

	.pkpButton {
		position: relative;
		z-index: 1;
		background: transparent;
		border: 1px solid #437b96;
		box-shadow: 0 1px 0 #000;
		font-size: @font-tiny;
		line-height: 2em;
		color: #fff;

		&:before {
			content: '';
			position: relative;
			display: inline-block;
			width: 0.75em;
			height: 0.75em;
			margin-right: 0.25em;
			border: 1px solid #fff;
			border-radius: 50%;
		}

		&:first-child {
			position: relative;
			left: 1px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:last-child {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:hover,
		&:focus {
			color: #fff;
			border-color: #fff;
			z-index: 2;
		}

		&[aria-pressed='true'] {
			background: @primary;

			&:before {
				background: #fff;
				box-shadow: inset 0 0 0 1px @primary;
			}
		}

		&[disabled] {
			background: transparent;
			opacity: 0.5;
		}
	}
}

.pkpStats__graphSelector--timelineInterval {
	margin-left: auto;
}
</style>
