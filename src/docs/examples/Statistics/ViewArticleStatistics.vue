<template>
	<div class="pkpStatistics">
		<page-header>
			Articles
			<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			<template slot="actions">
				<date-range
					unique-id="article-stats-date-range"
					:date-start="dateStart"
					:date-end="dateEnd"
					:date-end-max="dateEndMax"
					:options="dateRangeOptions"
					:i18n="i18n"
					@set-range="setDateRange"
				/>
				<pkp-button
					:label="i18n.filter"
					icon="filter"
					:is-active="isFilterVisible"
					@click="toggleFilter"
				/>
			</template>
		</page-header>
		<div class="pkpStatistics__container">
			<list-panel-filter
				:is-visible="isFilterVisible"
				:filters="filters"
				:active-filters="activeFilters"
				:i18n="i18n"
				@filter-list="updateFilter"
			/>
			<div class="pkpStatistics__main">
				<div v-if="chartData" class="pkpStatistics__graph">
					<div class="pkpStatistics__graphHeader">
						<h2 class="pkpStatistics__graphTitle" id="article-stats-time-segment">Abstract Views</h2>
						<div class="pkpStatistics__graphSegment">
							<pkp-button
								:label="i18n.daily"
								:aria-pressed="timeSegment === 'day'"
								aria-describedby="article-stats-time-segment"
								:disabled="!isDailySegmentEnabled"
								@click="setTimeSegment('day')"
							/>
							<pkp-button
								:label="i18n.monthly"
								:aria-pressed="timeSegment === 'month'"
								aria-describedby="article-stats-time-segment"
								:disabled="!isMonthlySegmentEnabled"
								@click="setTimeSegment('month')"
							/>
						</div>
					</div>
					<table class="-screenReader" role="region" aria-live="polite">
						<caption>Total views for all articles by month</caption>
						<thead>
							<tr>
								<th scope="col">Date</th>
								<th scope="col">Abstract Views</th>
								<th scope="col">Galley Views</th>
								<th scope="col">Total Views</th>
							</tr>
						</thead>
						<tbody>
							<tr	v-for="segment in timeSegments">
								<th scope="row">{{ segment.dateLabel }}</th>
								<th>{{ segment.abstractViews }}</th>
								<th>{{ segment.totalFileViews }}</th>
								<th>{{ segment.total }}</th>
							</tr>
						</tbody>
					</table>
					<line-chart :chartData="chartData" aria-hidden="true"></line-chart>
				</div>
				<div class="pkpStatistics__table" role="region" aria-live="polite">
					<div class="pkpStatistics__tableHeader">
						<h2 class="pkpStatistics__tableTitle" id="articleDetailTableLabel">
							Article Details
							<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
						</h2>
						<div class="pkpStatistics__tableActions">
							<div class="pkpStatistics__itemsOfTotal">
								{{ __('itemsOfTotal', { count: currentRows.length, total: items.length }) }}
								<a
									v-if="currentRows.length < items.length"
									href="#articleDetailTablePagination"
									class="-screenReader"
								>
									{{ i18n.paginationLabel }}
								</a>
							</div>
						</div>
					</div>
					<pkp-table
						labelled-by="articleDetailTableLabel"
						:columns="tableColumns"
						:rows="currentRows"
					>
						<list-panel-search
							slot="thead-title"
							slot-scope="{ column }"
							:search-phrase="searchPhrase"
							:i18n="i18n"
							@search-phrase-changed="setSearchPhrase"
						/>
					</pkp-table>
					<pagination
						v-if="lastPage > 1"
						id="articleDetailTablePagination"
						:current-page="currentPage"
						:last-page="lastPage"
						:i18n="i18n"
						@set-page="setPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import StatisticsSubmissions from '@/components/Statistics/StatisticsSubmissions.vue';
import articleStats from '../Table/helpers/articleStats.js';
import articleStatsColumns from '../Table/helpers/articleStatsColumns.js';
import timeSegments from './helpers/timeSegments.js';

export default {
	extends: StatisticsSubmissions,
	data: function () {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		return {
			apiUrl: '/articles',
			timeSegment: 'day',
			timeSegments: timeSegments,
			items: articleStats,
			itemsMax: articleStats.length,
			tableColumns: articleStatsColumns.filter(col => !['id', 'author'].includes(col.name)),
			count: 10,
			offset: 0,
			searchPhrase: '',
			dateStart: '2018-12-18',
			dateEnd: '2019-01-18',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2018-10-18',
					dateEnd: '2019-01-18',
					label: 'Last 90 days',
				},
				{
					dateStart: '2018-12-28',
					dateEnd: '2019-01-28',
					label: 'Last 30 days',
				},
				{
					dateStart: '2018-01-01',
					dateEnd: '2018-12-31',
					label: 'Last 12 months',
				},
				{
					dateStart: '',
					dateEnd: '',
					label: 'All dates',
				},
			],
			orderBy: '',
			orderDirection: false,
			filters: {
				example: {
					heading: 'Sections',
					filters: [
						{
							title: 'Articles',
							param: 'sectionIds',
							val: 1,
						},
						{
							title: 'Reviews',
							param: 'sectionIds',
							val: 2,
						},
						{
							title: 'Editorials',
							param: 'sectionIds',
							val: 3,
						},
						{
							title: 'Epäjärjestelmällistyttämättömyydelläänsäkäänköhän',
							param: 'sectionIds',
							val: 4,
						},
					],
				},
			},
			originalItems: [],
			i18n: {
				filter: 'Filter',
				filterRemove: 'Clear filter: {$filterTitle}',
				itemsOfTotal: '{$count} of {$total} articles',
				paginationLabel: 'View more pages',
				goToLabel: 'Go to {$page}',
				pageLabel: 'Page {$page}',
				nextPageLabel: 'Next page',
				previousPageLabel: 'Previous page',
				search: 'Search by title, author and ID',
				clearSearch: 'Clear search phrase',
				dateRange: 'Date Range',
				dateFormatInstructions: 'Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15.',
				changeDateRange: 'Change date range',
				sinceDate: 'Since {$date}',
				untilDate: 'Until {$date}',
				allDates: 'All dates',
				customRange: 'Custom Range',
				fromDate: 'From',
				toDate: 'To',
				apply: 'Apply',
				invalidDate: 'The date format is not valid. Enter each date in the format YYYY-MM-DD.',
				dateDoesNotExist: 'One of the dates entered does not exist.',
				invalidDateRange: 'The start date must be before the end date.',
				invalidEndDateMax: 'The end date may not be later than {$date}',
				invalidStartDateMin: 'The start date may not be earlier than {$date}',
				daily: 'Daily',
				monthly: 'Monthly',
			},
		};
	},
	computed: {
		currentRows: function () {
			return this.items.slice(this.offset, (this.offset + this.count));
		},
	},
	methods: {
		/**
		 * Mock a request to the API
		 */
		get: function () {
			this.isLoading = true;

			console.log('get', {
				activeFilters: this.activeFilters,
				searchPhrase: this.searchPhrase,
			});

			setTimeout(() => {

				if (!this.originalItems.length) {
					this.originalItems = [...this.items];
				}

				this.items = this.originalItems.filter(row => {
					if (this.searchPhrase) {
						if (!row.object.fullTitle.en_US.includes(this.searchPhrase) &&
								row.object.id != this.searchPhrase &&
								!row.object.authorString.includes(this.searchPhrase)) {
							return false;
						}
					}
					if (this.activeFilters.sectionIds && this.activeFilters.sectionIds.length) {
						return this.activeFilters.sectionIds.includes(row.object.sectionId);
					}
					return true;
				});

				this.isLoading = false;
			}, 1000);
		},
	},
};
</script>
