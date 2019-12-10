<template>
	<div class="pkpStats">
		<pkp-header>
			Articles
			<template slot="actions">
				<date-range
					unique-id="publication-stats-date-range"
					:date-start="dateStart"
					:date-end="dateEnd"
					:date-end-max="dateEndMax"
					:options="dateRangeOptions"
					:i18n="i18n"
					@set-range="setDateRange"
				/>
				<pkp-button
					v-if="filters.length"
					:label="i18n.filter"
					icon="filter"
					:is-active="isSidebarVisible"
					@click="toggleSidebar"
				/>
			</template>
		</pkp-header>
		<div class="pkpStats__container -pkpClearfix">
			<!-- Filters in the sidebar -->
			<div
				v-if="filters.length"
				ref="sidebar"
				class="pkpStats__sidebar"
				:class="sidebarClasses"
			>
				<pkp-header
					class="pkpStats__sidebarHeader"
					:tabindex="isSidebarVisible ? 0 : -1"
				>
					<icon icon="filter" :inline="true" />
					{{ i18n.filter }}
				</pkp-header>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="pkpStats__filterSet"
				>
					<pkp-header v-if="filterSet.heading">
						{{ filterSet.heading }}
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</div>
			<div class="pkpStats__content">
				<div v-if="chartData" class="pkpStats__graph">
					<div class="pkpStats__graphHeader">
						<h2
							class="pkpStats__graphTitle -screenReader"
							id="publication-stats-graph-title"
						>
							Views
						</h2>
						<div class="pkpStats__graphSelectors">
							<div
								class="pkpStats__graphSelector pkpStats__graphSelector--timelineType"
							>
								<pkp-button
									:label="i18n.abstracts"
									:aria-pressed="timelineType === 'abstract'"
									aria-describedby="publication-stats-graph-title"
									@click="setTimelineType('abstract')"
								/>
								<pkp-button
									:label="i18n.galleys"
									:aria-pressed="timelineType === 'galley'"
									aria-describedby="publication-stats-graph-title"
									@click="setTimelineType('galley')"
								/>
							</div>
							<div
								class="pkpStats__graphSelector pkpStats__graphSelector--timelineInterval"
							>
								<pkp-button
									:label="i18n.daily"
									:aria-pressed="timelineInterval === 'day'"
									aria-describedby="publication-stats-graph-title"
									:disabled="!isDailyIntervalEnabled"
									@click="setTimelineInterval('day')"
								/>
								<pkp-button
									:label="i18n.monthly"
									:aria-pressed="timelineInterval === 'month'"
									aria-describedby="publication-stats-graph-title"
									:disabled="!isMonthlyIntervalEnabled"
									@click="setTimelineInterval('month')"
								/>
							</div>
						</div>
					</div>
					<table class="-screenReader" role="region" aria-live="polite">
						<caption v-if="timelineType === 'galley'">
							Total galley views for articles by month
						</caption>
						<caption v-else>Total abstract views for articles by month</caption>
						<thead>
							<tr>
								<th scope="col">Date</th>
								<th scope="col">Abstract Views</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="segment in timeline" :key="segment.date">
								<th scope="row">{{ segment.label }}</th>
								<td>{{ segment.value }}</td>
							</tr>
						</tbody>
					</table>
					<line-chart :chartData="chartData" aria-hidden="true"></line-chart>
					<span v-if="isLoadingTimeline" class="pkpStats__loadingCover">
						<spinner></spinner>
					</span>
				</div>
				<div class="pkpStats__table" role="region" aria-live="polite">
					<div class="pkpStats__tableHeader">
						<h2 class="pkpStats__tableTitle" id="articleDetailTableLabel">
							Article Details
							<spinner v-if="isLoadingItems"></spinner>
						</h2>
						<div class="pkpStats__tableActions">
							<div class="pkpStats__itemsOfTotal">
								{{
									__('itemsOfTotal', {
										count: items.length,
										total: itemsMax
									})
								}}
								<a
									v-if="items.length < itemsMax"
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
						:class="tableClasses"
						:columns="tableColumns"
						:rows="items"
						:order-by="orderBy"
						:order-direction="orderDirection"
						@order-by="setOrderBy"
					>
						<search
							slot="thead-title"
							class="pkpStats__titleSearch"
							:search-phrase="searchPhrase"
							:search-label="i18n.search"
							:clear-search-label="i18n.clearSearch"
							@search-phrase-changed="setSearchPhrase"
						/>
					</pkp-table>
					<div v-if="!items.length" class="pkpStats__noRecords">
						<template v-if="isLoadingItems">
							<spinner></spinner>
							Loading
						</template>
						<template v-else>
							No articles were found with usage statistics matching these
							parameters.
						</template>
					</div>
					<pagination
						v-if="lastPage > 1"
						id="articleDetailTablePagination"
						:current-page="currentPage"
						:is-loading="isLoadingItems"
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
import StatsPublicationsContainer from '@/components/Container/StatsPublicationsContainer.vue';
import articleStats from '../../Table/helpers/articleStats.js';
import articleStatsColumns from '../../Table/helpers/articleStatsColumns.js';

function getRandomTimeline(startDate, endDate, timelineInterval) {
	let timeline = [];
	let labelSplice = timelineInterval === 'month' ? 2 : 3;
	while (startDate.getTime() < endDate.getTime()) {
		timeline.push({
			date: startDate.toISOString().split('T')[0],
			label: startDate
				.toString()
				.split(' ')
				.slice(1, labelSplice)
				.join(' '),
			value: Math.floor(Math.random() * 2000) + 3000
		});
		if (timelineInterval === 'month') {
			startDate.setMonth(startDate.getMonth() + 1);
		} else {
			startDate.setDate(startDate.getDate() + 1);
		}
	}
	return timeline;
}

export default {
	extends: StatsPublicationsContainer,
	data: function() {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		const startDate = new Date();
		startDate.setDate(dateEndMax.getDate() - 30);
		return {
			apiUrl: '/api/v1/stats/publications',
			timeline: getRandomTimeline(startDate, dateEndMax, 'day'),
			timelineType: 'abstract',
			timelineInterval: 'day',
			items: articleStats.slice(0, 30),
			itemsMax: articleStats.length,
			tableColumns: articleStatsColumns.filter(
				col => !['id', 'author'].includes(col.name)
			),
			dateStart: '2019-04-01',
			dateEnd: '2019-05-01',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2019-04-01',
					dateEnd: '2019-05-01',
					label: 'Last 30 days'
				},
				{
					dateStart: '2019-01-31',
					dateEnd: '2019-05-01',
					label: 'Last 90 days'
				},
				{
					dateStart: '2018-05-02',
					dateEnd: '2019-05-01',
					label: 'Last 12 months'
				},
				{dateStart: '', dateEnd: '', label: 'All Dates'}
			],
			filters: [
				{
					heading: 'Sections',
					filters: [
						{title: 'Articles', param: 'sectionIds', value: 1},
						{title: 'Reviews', param: 'sectionIds', value: 2},
						{title: 'Editorials', param: 'sectionIds', value: 3},
						{
							title: 'Epäjärjestelmällistyttämättömyydelläänsäkäänköhän',
							param: 'sectionIds',
							value: 4
						}
					]
				}
			],
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
				dateFormatInstructions:
					'Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15.',
				changeDateRange: 'Change date range',
				sinceDate: 'Since {$date}',
				untilDate: 'Until {$date}',
				allDates: 'All dates',
				customRange: 'Custom Range',
				fromDate: 'From',
				toDate: 'To',
				apply: 'Apply',
				invalidDate:
					'The date format is not valid. Enter each date in the format YYYY-MM-DD.',
				dateDoesNotExist: 'One of the dates entered does not exist.',
				invalidDateRange: 'The start date must be before the end date.',
				invalidEndDateMax: 'The end date may not be later than {$date}',
				invalidStartDateMin: 'The start date may not be earlier than {$date}',
				daily: 'Daily',
				monthly: 'Monthly',
				abstracts: 'Abstracts',
				galleys: 'Galleys'
			}
		};
	},
	methods: {
		/**
		 * Mock requests to the API
		 */
		getItems: function() {
			this.isLoadingItems = true;

			setTimeout(() => {
				const items = articleStats.filter(row => {
					if (this.searchPhrase) {
						if (
							!row.object.fullTitle.en_US.includes(this.searchPhrase) &&
							row.object.id != this.searchPhrase &&
							!row.object.authorString.includes(this.searchPhrase)
						) {
							return false;
						}
					}
					if (
						this.activeFilters.sectionIds &&
						this.activeFilters.sectionIds.length
					) {
						return this.activeFilters.sectionIds.includes(row.object.sectionId);
					}
					return true;
				});
				this.items = items.slice(this.offset, this.count + this.offset);
				this.itemsMax = items.length;

				this.isLoadingItems = false;
			}, 1000);
		},

		/**
		 * Mock requests to the API
		 */
		getTimeline: function() {
			this.isLoadingTimeline = true;
			setTimeout(() => {
				const dateStart = this.dateStart || '2016-01-01';
				const dateEnd =
					this.dateEnd ||
					new Date(new Date().setDate(new Date().getDate() - 1));
				this.timeline = getRandomTimeline(
					new Date(dateStart),
					new Date(dateEnd),
					this.timelineInterval
				);
				this.isLoadingTimeline = false;
			}, 1000);
		}
	}
};
</script>
