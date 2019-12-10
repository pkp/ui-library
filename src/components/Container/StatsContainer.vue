<script>
import DateRange from '@/components/DateRange/DateRange.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import Icon from '@/components/Icon/Icon.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpTable from '@/components/Table/Table.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import TableCell from '@/components/Table/TableCell.vue';

export default {
	components: {
		DateRange,
		PkpFilter,
		Icon,
		Pagination,
		PkpButton,
		PkpHeader,
		PkpTable,
		Spinner,
		TableCell
	},
	data() {
		return {
			apiUrl: '',
			tableColumns: [],
			dateStart: '',
			dateEnd: '',
			dateEndMax: '',
			dateRangeOptions: [],
			filters: [],
			activeFilters: {},
			isSidebarVisible: false,
			isLoadingItems: false,
			latestItemsGetRequest: '',
			i18n: {}
		};
	},
	computed: {
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
		 * Add classes to the table when it is loading
		 *
		 * @return Array
		 */
		tableClasses() {
			let classes = [];
			if (this.isLoadingItems) {
				classes.push('-isLoading');
			}
			return classes;
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
		}
	},
	mounted() {
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

// Fade the graph and table when loading
.pkpStats__graph {
	position: relative;
}

.pkpStats__loadingCover {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1;

	> .pkpSpinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&:before {
			width: 100px;
			height: 100px;
			border-top-color: #fff;
			border-left-color: #fff;
			animation-duration: 0.8s;
		}
	}
}

.pkpStats__table .pkpTable.-isLoading tbody {
	opacity: 0.5;
}
</style>
