<template>
	<div class="pkpStats">
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
					<icon icon="filter" :inline="true"></icon>
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
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></pkp-filter>
				</div>
			</div>
			<div class="pkpStats__content">
				<div class="pkpStats__table" role="region" aria-live="polite">
					<div class="pkpStats__tableHeader">
						<h2 class="pkpStats__tableTitle" id="editorialActivityTabelLabel">
							Trends
							<span
								v-if="isLoading"
								class="pkpSpinner"
								aria-hidden="true"
							></span>
						</h2>
						<div class="pkpStats__tableActions">
							<date-range
								slot="thead-dateRange"
								unique-id="editorial-stats-date-range"
								:date-start="dateStart"
								:date-end="dateEnd"
								:date-end-max="dateEndMax"
								:options="dateRangeOptions"
								:i18n="i18n"
								@set-range="setDateRange"
								@updated:current-range="setCurrentDateRange"
							></date-range>
							<pkp-button
								v-if="filters.length"
								:label="i18n.filter"
								icon="filter"
								:is-active="isSidebarVisible"
								@click="toggleSidebar"
							></pkp-button>
						</div>
					</div>
					<pkp-table
						class="pkpTable--editorialStats"
						labelled-by="editorialActivityTabelLabel"
						:columns="tableColumns"
						:rows="tableRows"
					>
						<template slot-scope="{row, rowIndex}">
							<table-cell
								v-for="(column, columnIndex) in tableColumns"
								:key="column.name"
								:column="column"
								:row="row"
								:tabindex="!rowIndex && !columnIndex ? 0 : -1"
							>
								<template v-if="column.name === 'name'">
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
	</div>
</template>

<script>
import StatsEditorialContainer from '@/components/Container/StatsEditorialContainer.vue';
import debounce from 'debounce';

export default {
	extends: StatsEditorialContainer,
	data: function() {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		const startDate = new Date();
		startDate.setDate(dateEndMax.getDate() - 30);
		return {
			apiUrl: '/api/v1/stats/publications',
			activeByStage: [
				{
					color: '#d00a0a',
					count: 4,
					name: 'Submission'
				},
				{
					color: '#e05c14',
					count: 27,
					name: 'Review'
				},
				{
					color: '#007ab2',
					count: 8,
					name: 'Copyediting'
				},
				{
					color: '#00b28d',
					count: 4,
					name: 'Production'
				}
			],
			dateStart: '2019-04-01',
			dateEnd: '2019-05-01',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2019-01-31',
					dateEnd: '2019-05-01',
					label: 'Last 90 days'
				},
				{
					dateStart: '2018-01-12',
					dateEnd: '2018-12-31',
					label: 'Last year'
				},
				{
					dateStart: '2017-01-12',
					dateEnd: '2018-12-31',
					label: 'Last two years'
				}
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
			percentageStats: [
				'acceptanceRate',
				'declineRate',
				'declinedDeskRate',
				'declinedReviewRate'
			],
			tableColumns: [
				{
					name: 'name',
					label: 'Name',
					value: 'name'
				},
				{
					name: 'dateRange',
					label: '2019-10-10 — 2019-12-10',
					value: 'dateRange'
				},
				{
					name: 'total',
					label: 'Total',
					value: 'total'
				}
			],
			tableRows: [
				{
					key: 'submissionsReceived',
					name: 'Submissions Received',
					dateRange: 12,
					total: 164
				},
				{
					key: 'submissionsAccepted',
					name: 'Submissions Accepted',
					dateRange: 3,
					total: 75
				},
				{
					key: 'submissionsDeclined',
					name: 'Submissions Declined',
					dateRange: 4,
					total: 79
				},
				{
					key: 'submissionsDeclinedDeskReject',
					name: 'Submissions Declined (Desk Reject)',
					dateRange: 3,
					total: 14
				},
				{
					key: 'submissionsDeclinedPostReview',
					name: 'Submissions Declined (After Review)',
					dateRange: 1,
					total: 65
				},
				{
					key: 'submissionsPublished',
					name: 'Submissions Published',
					dateRange: 0,
					total: 66
				},
				{
					key: 'daysToDecision',
					name: 'Days to First Editorial Decision',
					dateRange: 29,
					total: 14
				},
				{
					key: 'daysToAccept',
					name: 'Days to Accept',
					dateRange: 82,
					total: 63
				},
				{
					key: 'daysToReject',
					name: 'Days to Reject',
					dateRange: 87,
					total: 92
				},
				{
					key: 'acceptanceRate',
					name: 'Acceptance Rate',
					dateRange: '42%',
					total: '49%'
				},
				{
					key: 'declineRate',
					name: 'Rejection Rate',
					dateRange: '58%',
					total: '51%'
				},
				{
					key: 'declinedDeskRate',
					name: 'Desk Reject Rate',
					dateRange: '72%',
					total: '9%'
				},
				{
					key: 'declinedReviewRate',
					name: 'After Review Reject Rate',
					dateRange: '49%',
					total: '42%'
				}
			],
			i18n: {
				filter: 'Filter',
				filterRemove: 'Clear filter: {$filterTitle}',
				itemsOfTotal: '{$count} of {$total} articles',
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
				invalidStartDateMin: 'The start date may not be earlier than {$date}'
			}
		};
	},
	methods: {
		/**
		 * Mock requests to the API
		 */
		get: debounce(function() {
			this.isLoading = true;

			setTimeout(() => {
				this.isLoading = false;
			}, 2000);
		})
	}
};
</script>
