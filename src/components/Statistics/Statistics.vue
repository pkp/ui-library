<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';

export default {
	components: {
		ListPanelFilter,
		ListPanelSearch,
		PageHeader,
		Pagination,
		PkpButton,
		PkpTable,
	},
	data: function () {
		return {
			stats: [],
			tableColumns: [],
			currentPage: 1,
			perPage: 30,
			searchPhrase: '',
			filters: [],
			activeFilters: {},
			isFilterVisible: false,
			isLoading: false,
			i18n: {},
		};
	},
	computed: {
		lastPage: function () {
			return Math.floor(this.stats.length / this.perPage);
		},
		currentRows: function () {
			const start = (this.currentPage * this.perPage) - this.perPage;
			return this.stats.slice(start, (start + this.perPage));
		},
	},
	methods: {
		setPage: function (page) {
			this.currentPage = page;
		},
		setSearchPhrase: function (val) {
			this.searchPhrase = val;
		},
		get: function () {
			this.isLoading = true;

			console.log('get', {
				activeFilters: this.activeFilters,
				searchPhrase: this.searchPhrase,
			});

			this.isLoading = false;
		},

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
	},
	watch: {
		activeFilters: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.get();
		},
		searchPhrase: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.currentPage = 1;
			this.get();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpStatistics .pkpPageHeader {
	padding-left: 0;
	padding-right: 0;
}

.pkpStatistics .pkpListPanel__filter.-isVisible {
	float: left;
	position: relative;
	left: auto;
	width: 192px;
	border-top: @grid-border;

	+ .pkpStatistics__main  {
		margin-left: 192px;
	}
}

.pkpStatistics__main {
	margin-left: 0;
	transition: margin-left 0.2s;
}

.pkpStatistics__tableHeader {
	margin-top: 2rem;
}

.pkpStatistics__tableTitle {
	display: inline-block;
	margin: 0;
	font-size: @font-base;
	line-height: 1.5em;

	.pkpSpinner {
		margin-left: 0.5rem;
	}
}

.pkpStatistics__tableActions {
	float: right;
	margin-left: 1rem;
}

.pkpStatistics__itemsOfTotal {
	font-size: @font-tiny;
}

.pkpStatistics .pkpTable {

	.pkpListPanel__search {
		display: inline-block;
		float: none;
		margin-top: 0;
		margin-left: 1rem;
		max-width: 20em;
	}

	.pkpListPanel__searchInput {
		font-size: @font-tiny;
		line-height: 2.5em;
		padding-left: 2.5rem;
	}
}

// TEMP
.pkpStatistics__graph {
	background: @bg-anchor;
	text-align: center;
	padding: 5rem;
	color: #fff;
}
</style>
