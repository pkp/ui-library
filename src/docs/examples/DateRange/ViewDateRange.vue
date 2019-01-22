<template>
	<div class="viewDateRange">
		<date-range
			:uniqueId="uniqueId"
			:dateStart="dateStart"
			:dateEnd="dateEnd"
			:options="options"
			:i18n="i18n"
			@setRange="setRange"
		/>
	</div>
</template>

<script>
import DateRange from '@/components/DateRange/DateRange.vue';

export default {
	components: {
		DateRange,
	},
	data: function () {
		return {
			uniqueId: 'example-view-date-range',
			dateStart: '2018-10-18',
			dateEnd: '2019-01-18',
			options: [
				{
					dateStart: '2018-10-18',
					dateEnd: '2019-01-18',
					label: 'Last 90 days',
				},
				{
					dateStart: '2018-12-28',
					dateEnd: '2019-12-01',
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
			i18n: {
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
			},
		};
	},
	methods: {
		setRange: function (dateStart, dateEnd) {
			this.dateStart = dateStart;
			this.dateEnd = dateEnd;
		},
	},
};
</script>
