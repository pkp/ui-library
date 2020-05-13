<template>
	<div class="pkpStats">
		<pkp-header>
			<h1>Articles</h1>
			<spinner v-if="isLoadingTimeline" />
			<template slot="actions">
				<date-range
					unique-id="publication-stats-date-range"
					:date-start="dateStart"
					:date-end="dateEnd"
					:date-end-max="dateEndMax"
					:options="dateRangeOptions"
					dateRangeLabel="Date Range"
					dateFormatInstructionsLabel="Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15."
					changeDateRangeLabel="Change date range"
					sinceDateLabel="Since {$date}"
					untilDateLabel="Until {$date}"
					allDatesLabel="All dates"
					customRangeLabel="Custom Range"
					fromDateLabel="From"
					toDateLabel="To"
					applyLabel="Apply"
					invalidDateLabel="The date format is not valid. Enter each date in the format YYYY-MM-DD."
					dateDoesNotExistLabel="One of the dates entered does not exist."
					invalidDateRangeLabel="The start date must be before the end date."
					invalidStartDateMinLabel="The start date may not be earlier than {$date}."
					@set-range="setDateRange"
				/>
				<pkp-button
					v-if="filters.length"
					:is-active="isSidebarVisible"
					@click="toggleSidebar"
				>
					<icon icon="filter" :inline="true" />
					{{ __('common.filter') }}
				</pkp-button>
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
					<h2>
						<icon icon="filter" :inline="true" />
						{{ __('common.filter') }}
					</h2>
				</pkp-header>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="pkpStats__filterSet"
				>
					<pkp-header v-if="filterSet.heading">
						<h3>{{ filterSet.heading }}</h3>
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
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
									:aria-pressed="timelineType === 'abstract'"
									aria-describedby="publication-stats-graph-title"
									@click="setTimelineType('abstract')"
								>
									Abstracts
								</pkp-button>
								<pkp-button
									:aria-pressed="timelineType === 'galley'"
									aria-describedby="publication-stats-graph-title"
									@click="setTimelineType('galley')"
								>
									Files
								</pkp-button>
							</div>
							<div
								class="pkpStats__graphSelector pkpStats__graphSelector--timelineInterval"
							>
								<pkp-button
									:aria-pressed="timelineInterval === 'day'"
									aria-describedby="publication-stats-graph-title"
									:disabled="!isDailyIntervalEnabled"
									@click="setTimelineInterval('day')"
								>
									Daily
								</pkp-button>
								<pkp-button
									:aria-pressed="timelineInterval === 'month'"
									aria-describedby="publication-stats-graph-title"
									:disabled="!isMonthlyIntervalEnabled"
									@click="setTimelineInterval('month')"
								>
									Monthly
								</pkp-button>
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
					<pkp-header>
						<h2 class="pkpStats__tableTitle" id="articleDetailTableLabel">
							Article Details
							<spinner v-if="isLoadingItems"></spinner>
						</h2>
						<template slot="actions">
							<div class="pkpStats__itemsOfTotal">
								{{
									replaceLocaleParams(itemsOfTotalLabel, {
										count: items.length,
										total: itemsMax
									})
								}}
								<a
									v-if="items.length < itemsMax"
									href="#articleDetailTablePagination"
									class="-screenReader"
								>
									View additional pages
								</a>
							</div>
						</template>
					</pkp-header>
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
							search-label="Search by title, author and ID"
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
						@set-page="setPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';
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
	extends: StatsPublicationsPage,
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
			originalItems: []
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
