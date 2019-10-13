<template>
	<div class="pkpStatistics pkpStatistics--editorial">
		<page-header>
			Editorial Activity
		</page-header>
		<div class="pkpStatistics__container">
			<div v-if="submissionsStage" class="pkpStatistics__graph">
				<div class="pkpStatistics--editorial__stageWrapper -pkpClearfix">
					<div class="pkpStatistics--editorial__stageChartWrapper">
						<doughnut-chart :chart-data="pieData"></doughnut-chart>
					</div>
					<div class="pkpStatistics--editorial__stageList">
						<div class="pkpStatistics--editorial__stage pkpStatistics--editorial__stage--total">
							<span class="pkpStatistics--editorial__stageCount">{{ submissionsStage.reduce((a, b) => a + b.value, 0 ) }}</span>
							<span class="pkpStatistics--editorial__stageLabel">Active submissions</span>
						</div>
						<div v-for="stage in submissionsStage" class="pkpStatistics--editorial__stage">
							<span class="pkpStatistics--editorial__stageCount">{{ stage.value }}</span>
							<span class="pkpStatistics--editorial__stageLabel">{{ stage.name }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="pkpStatistics__main">
				<div class="pkpStatistics__table" role="region" aria-live="polite">
					<div class="pkpStatistics__tableHeader">
						<h2 class="pkpStatistics__tableTitle" id="trendsDetailTableLabel">
							Trends
							<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
						</h2>
						<div class="pkpStatistics__tableActions">
							<date-range
								unique-id="editorial-stats-date-range"
								:date-start="dateStart"
								:date-end="dateEnd"
								:date-end-max="dateEndMax"
								:options="dateRangeOptions"
								:i18n="i18n"
								@set-range="setDateRange"
							/>
						</div>
					</div>
					<pkp-table
						labelled-by="trendsDetailTableLabel"
						:columns="tableColumns"
						:rows="currentRows"
					></pkp-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import StatisticsEditorial from '@/components/Statistics/StatisticsEditorial.vue';
import submissionsStage from './helpers/submissionsStage';
import editorialStats from './helpers/editorialStats.js';
import editorialStatsColumns from './helpers/editorialStatsColumns.js';

export default {
	extends: StatisticsEditorial,
	data: function () {
		const dateEndMax = new Date(new Date().setDate(new Date().getDate() - 1));
		return {
			apiUrl: '/articles',
			items: editorialStats,
			itemsMax: editorialStats.length,
			tableColumns: editorialStatsColumns,
			count: 10,
			offset: 0,
			searchPhrase: '',
			dateStart: '2018-01-01',
			dateEnd: '2018-12-31',
			dateEndMax: dateEndMax.toISOString().split('T')[0],
			dateRangeOptions: [
				{
					dateStart: '2018-10-18',
					dateEnd: '2019-01-18',
					label: 'Last 90 days',
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
			submissionsStage: submissionsStage,
			i18n: {
				activeSubmissions: 'Active Submissions',
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
			},
		};
	},
	computed: {
		pieData: function () {
			return {
				labels: this.submissionsStage.map(stage => stage.name),
				datasets: [
					{
						label: this.i18n.activeSubmissions,
						data: this.submissionsStage.map(stage => stage.value),
						backgroundColor: this.submissionsStage.map(stage => stage.color),
					},
				],
			};
		},
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
