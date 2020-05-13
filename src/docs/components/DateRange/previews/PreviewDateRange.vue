<template>
	<div class="previewDateRange">
		<date-range
			:dateEnd="dateEnd"
			dateEndMax=""
			:dateStart="dateStart"
			dateStartMin=""
			:options="[
				{
					dateStart: '2018-10-18',
					dateEnd: '2019-01-18',
					label: 'Last 90 days'
				},
				{
					dateStart: '2018-12-28',
					dateEnd: '2019-12-01',
					label: 'Last 30 days'
				},
				{
					dateStart: '2018-01-01',
					dateEnd: '2018-12-31',
					label: 'Last 12 months'
				},
				{
					dateStart: '',
					dateEnd: '',
					label: 'All dates'
				}
			]"
			uniqueId="example-view-date-range"
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
			@set-range="setRange"
		/>
	</div>
</template>

<script>
import DateRange from '@/components/DateRange/DateRange.vue';

export default {
	components: {
		DateRange
	},
	data() {
		return {
			dateEnd: '2019-01-18',
			dateStart: '2018-10-18'
		};
	},
	methods: {
		setRange(dateStart, dateEnd) {
			this.dateStart = dateStart;
			this.dateEnd = dateEnd;
		}
	}
};
</script>
