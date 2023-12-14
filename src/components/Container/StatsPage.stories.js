import StatsPage from './StatsPage.vue';
import StatsEditorialPage from '@/components/Container/StatsEditorialPage.vue';
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';
import ArticleStatsMock from '@/components/Table/mocks/articleStats.js';
import ArticleStatsColumnsMock from '@/components/Table/mocks/articleStatsColumns.js';
import debounce from 'debounce';

export default {
	title: 'Pages/StatsPage',
	component: StatsPage,
};

const EditorialStatsPageWithDataAndTemplate = {
	extends: StatsEditorialPage,
	template: `	<div class="pkpStats">
		<h1 class="-screenReader">Editorial Activity</h1>
		<div v-if="activeByStage" class="pkpStats__graph">
			<div class="pkpStats--editorial__stageWrapper -pkpClearfix">
				<div class="pkpStats--editorial__stageChartWrapper">
					<doughnut-chart :chart-data="chartData"></doughnut-chart>
				</div>
				<div class="pkpStats--editorial__stageList">
					<h2
						class="pkpStats--editorial__stage pkpStats--editorial__stage--total"
					>
						<span class="pkpStats--editorial__stageCount">
							{{ totalActive }}
						</span>
						<span class="pkpStats--editorial__stageLabel">
							Active Submissions
						</span>
					</h2>
					<div
						v-for="stage in activeByStage"
						:key="stage.name"
						class="pkpStats--editorial__stage"
					>
						<span class="pkpStats--editorial__stageCount">
							{{ stage.count }}
						</span>
						<span class="pkpStats--editorial__stageLabel">
							{{ stage.name }}
						</span>
					</div>
				</div>
			</div>
		</div>
		<pkp-header>
			<h1 id="editorialActivityTabelLabel">
				Trends
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</h1>
			<template #actions>
				<date-range
					unique-id="editorial-stats-date-range"
					:date-start="dateStart"
					:date-end="dateEnd"
					:date-end-max="dateEndMax"
					:options="dateRangeOptions"
					date-range-label="Date Range"
					date-format-instructions-label="Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15."
					change-date-range-label="Change date range"
					since-date-label="Since {$date}"
					until-date-label="Until {$date}"
					all-dates-label="All dates"
					custom-range-label="Custom Range"
					from-date-label="From"
					to-date-label="To"
					apply-label="Apply"
					invalid-date-label="The date format is not valid. Enter each date in the format YYYY-MM-DD."
					date-does-not-exist-label="One of the dates entered does not exist."
					invalid-date-range-label="The start date must be before the end date."
					invalid-start-date-min-label="The start date may not be earlier than {$date}."
					invalid-end-date-max-label="The end date may not be later than {$date}."
					@set-range="setDateRange"
					@updated:current-range="setCurrentDateRange"
				></date-range>
				<pkp-button
					v-if="filters.length"
					:is-active="isSidebarVisible"
					@click="toggleSidebar"
				>
					<icon icon="filter" :inline="true" />
					{{ t('common.filter') }}
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
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="pkpStats__filterSet"
				>
					<pkp-header v-if="filterSet.heading">
						<h2>{{ filterSet.heading }}</h2>
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></pkp-filter>
				</div>
			</div>
			<div class="pkpStats__content">
				<div class="pkpStats__table" role="region" aria-live="polite">
					<pkp-table
						class="pkpTable--editorialStats"
						labelled-by="editorialActivityTabelLabel"
						:columns="tableColumns"
						:rows="tableRows"
					>
						<template #default="{row, rowIndex}">
							<table-cell
								v-for="(column, columnIndex) in tableColumns"
								:key="column.name"
								:column="column"
								:row="row"
								:tabindex="!rowIndex && !columnIndex ? 0 : -1"
							>
								<template #default v-if="column.name === 'name'">
									{{ row.name }}
									<tooltip
										v-if="row.description"
										:label="'Description for ' + row.name"
										:tooltip="row.description"
									></tooltip>
								</template>
							</table-cell>
						</template>
					</pkp-table>
				</div>
			</div>
		</div>
	</div>`,
	data() {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		const startDate = new Date();
		startDate.setDate(dateEndMax.getDate() - 30);
		return {
			apiUrl: '/api/v1/stats/publications',
			activeByStage: [
				{
					color: '#d00a0a',
					count: 4,
					name: 'Submission',
				},
				{
					color: '#e05c14',
					count: 27,
					name: 'Review',
				},
				{
					color: '#006798',
					count: 8,
					name: 'Copyediting',
				},
				{
					color: '#00b28d',
					count: 4,
					name: 'Production',
				},
			],
			dateStart: '2019-04-01',
			dateEnd: '2019-05-01',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2019-01-31',
					dateEnd: '2019-05-01',
					label: 'Last 90 days',
				},
				{
					dateStart: '2018-01-12',
					dateEnd: '2018-12-31',
					label: 'Last year',
				},
				{
					dateStart: '2017-01-12',
					dateEnd: '2018-12-31',
					label: 'Last two years',
				},
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
							value: 4,
						},
					],
				},
			],
			itemsOfTotalLabel: '{$count} of {$total} articles',
			percentageStats: [
				'acceptanceRate',
				'declineRate',
				'declinedDeskRate',
				'declinedReviewRate',
			],
			tableColumns: [
				{
					name: 'name',
					label: 'Name',
					value: 'name',
				},
				{
					name: 'dateRange',
					label: '2019-10-10 — 2019-12-10',
					value: 'dateRange',
				},
				{
					name: 'total',
					label: 'Total',
					value: 'total',
				},
			],
			tableRows: [
				{
					key: 'submissionsReceived',
					name: 'Submissions Received',
					dateRange: 12,
					total: 164,
				},
				{
					key: 'submissionsAccepted',
					name: 'Submissions Accepted',
					dateRange: 3,
					total: 75,
				},
				{
					key: 'submissionsDeclined',
					name: 'Submissions Declined',
					dateRange: 4,
					total: 79,
				},
				{
					key: 'submissionsDeclinedDeskReject',
					name: 'Submissions Declined (Desk Reject)',
					dateRange: 3,
					total: 14,
				},
				{
					key: 'submissionsDeclinedPostReview',
					name: 'Submissions Declined (After Review)',
					dateRange: 1,
					total: 65,
				},
				{
					key: 'submissionsPublished',
					name: 'Submissions Published',
					dateRange: 0,
					total: 66,
				},
				{
					key: 'daysToDecision',
					name: 'Days to First Editorial Decision',
					dateRange: 29,
					total: 14,
				},
				{
					key: 'daysToAccept',
					name: 'Days to Accept',
					dateRange: 82,
					total: 63,
				},
				{
					key: 'daysToReject',
					name: 'Days to Reject',
					dateRange: 87,
					total: 92,
				},
				{
					key: 'acceptanceRate',
					name: 'Acceptance Rate',
					dateRange: '42%',
					total: '49%',
				},
				{
					key: 'declineRate',
					name: 'Rejection Rate',
					dateRange: '58%',
					total: '51%',
				},
				{
					key: 'declinedDeskRate',
					name: 'Desk Reject Rate',
					dateRange: '72%',
					total: '9%',
				},
				{
					key: 'declinedReviewRate',
					name: 'After Review Reject Rate',
					dateRange: '49%',
					total: '42%',
				},
			],
		};
	},
	methods: {
		/**
		 * Mock requests to the API
		 * TODO use MSW API mocking instead
		 */
		get: debounce(function () {
			this.isLoading = true;

			setTimeout(() => {
				this.isLoading = false;
			}, 2000);
		}),
	},
};

export const EditorialStatsPage = {
	render: (args) => ({
		components: {
			EditorialStatsPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<EditorialStatsPageWithDataAndTemplate />
		`,
	}),

	args: {},
};

/***
 *
 * Publication stats
 *
 */

function getRandomTimeline(startDate, endDate, timelineInterval) {
	let timeline = [];
	let labelSplice = timelineInterval === 'month' ? 2 : 3;
	while (startDate.getTime() < endDate.getTime()) {
		timeline.push({
			date: startDate.toISOString().split('T')[0],
			label: startDate.toString().split(' ').slice(1, labelSplice).join(' '),
			value: Math.floor(Math.random() * 2000) + 3000,
		});
		if (timelineInterval === 'month') {
			startDate.setMonth(startDate.getMonth() + 1);
		} else {
			startDate.setDate(startDate.getDate() + 1);
		}
	}
	return timeline;
}

const PublicationStatsPageWithDataAndTemplate = {
	extends: StatsPublicationsPage,
	template: `		<div class="pkpStats">
		<pkp-header>
			<h1>Articles</h1>
			<spinner v-if="isLoadingTimeline" />
			<template #actions>
				<date-range
					unique-id="publication-stats-date-range"
					:date-start="dateStart"
					:date-end="dateEnd"
					:date-end-max="dateEndMax"
					:options="dateRangeOptions"
					date-range-label="Date Range"
					date-format-instructions-label="Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15."
					change-date-range-label="Change date range"
					since-date-label="Since {$date}"
					until-date-label="Until {$date}"
					all-dates-label="All dates"
					custom-range-label="Custom Range"
					from-date-label="From"
					to-date-label="To"
					apply-label="Apply"
					invalid-date-label="The date format is not valid. Enter each date in the format YYYY-MM-DD."
					date-does-not-exist-label="One of the dates entered does not exist."
					invalid-date-range-label="The start date must be before the end date."
					invalid-start-date-min-label="The start date may not be earlier than {$date}."
					invalid-end-date-max-label="The end date may not be later than {$date}."
					@set-range="setDateRange"
				/>
				<pkp-button
					v-if="filters.length"
					:is-active="isSidebarVisible"
					@click="toggleSidebar"
				>
					<icon icon="filter" :inline="true" />
					{{ t('common.filter') }}
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
						{{ t('common.filter') }}
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
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</div>
			<div class="pkpStats__content">
				<div v-if="chartData" class="pkpStats__graph">
					<div class="pkpStats__graphHeader">
						<h2
							id="publication-stats-graph-title"
							class="pkpStats__graphTitle -screenReader"
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
					<line-chart :chart-data="chartData" aria-hidden="true"></line-chart>
					<span v-if="isLoadingTimeline" class="pkpStats__loadingCover">
						<spinner></spinner>
					</span>
				</div>
				<div class="pkpStats__table" role="region" aria-live="polite">
					<pkp-header>
						<h2 id="articleDetailTableLabel" class="pkpStats__tableTitle">
							Article Details
							<spinner v-if="isLoadingItems"></spinner>
						</h2>
						<template #actions>
							<div class="pkpStats__itemsOfTotal">
								{{
									replaceLocaleParams(itemsOfTotalLabel, {
										count: items.length,
										total: itemsMax,
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
						<template #thead-title>
							<search
								class="pkpStats__titleSearch"
								:search-phrase="searchPhrase"
								search-label="Search by title, author and ID"
								@search-phrase-changed="setSearchPhrase"
							/>
						</template>
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
`,
	data() {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		const startDate = new Date();
		startDate.setDate(dateEndMax.getDate() - 30);
		return {
			apiUrl: '/api/v1/stats/publications',
			timeline: getRandomTimeline(startDate, dateEndMax, 'day'),
			timelineType: 'abstract',
			timelineInterval: 'day',
			items: ArticleStatsMock.slice(0, 30),
			itemsMax: ArticleStatsMock.length,
			tableColumns: ArticleStatsColumnsMock.filter(
				(col) => !['id', 'author'].includes(col.name),
			),

			dateStart: '2019-04-01',
			dateEnd: '2019-05-01',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2019-04-01',
					dateEnd: '2019-05-01',
					label: 'Last 30 days',
				},
				{
					dateStart: '2019-01-31',
					dateEnd: '2019-05-01',
					label: 'Last 90 days',
				},
				{
					dateStart: '2018-05-02',
					dateEnd: '2019-05-01',
					label: 'Last 12 months',
				},
				{dateStart: '', dateEnd: '', label: 'All Dates'},
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
							value: 4,
						},
					],
				},
			],
			originalItems: [],
		};
	},
	methods: {
		/**
		 * Mock requests to the API
		 */
		getItems: function () {
			this.isLoadingItems = true;

			setTimeout(() => {
				const items = ArticleStatsMock.filter((row) => {
					if (this.searchPhrase) {
						if (
							!row.object.fullTitle.en.includes(this.searchPhrase) &&
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
		getTimeline: function () {
			this.isLoadingTimeline = true;
			setTimeout(() => {
				const dateStart = this.dateStart || '2016-01-01';
				const dateEnd =
					this.dateEnd ||
					new Date(new Date().setDate(new Date().getDate() - 1));
				this.timeline = getRandomTimeline(
					this.getBrowserSafeDate(dateStart),
					this.getBrowserSafeDate(dateEnd),
					this.timelineInterval,
				);
				this.isLoadingTimeline = false;
			}, 1000);
		},
	},
};

export const PublicationStatsPage = {
	render: (args) => ({
		components: {
			PublicationStatsPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<PublicationStatsPageWithDataAndTemplate />
		`,
	}),

	args: {},
};
