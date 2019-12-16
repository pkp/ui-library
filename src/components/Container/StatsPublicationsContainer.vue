<script>
import StatsContainer from '@/components/Container/StatsContainer.vue';
import LineChart from '@/components/Chart/LineChart.vue';
import Search from '@/components/Search/Search.vue';
import debounce from 'debounce';

export default {
	extends: StatsContainer,
	components: {
		LineChart,
		Search
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
			latestTimelineGetRequest: ''
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
				labels: this.timeline.map(segment => segment.label),
				datasets: [
					{
						data: this.timeline.map(segment => segment.value)
					}
				]
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
				this.getDaysBetween(
					new Date(this.dateStart),
					new Date(this.dateEndMax)
				) > 31
			);
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
		}
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
		}
	}
};
</script>
