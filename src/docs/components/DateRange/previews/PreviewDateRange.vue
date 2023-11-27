<template>
	<div class="previewDateRange">
		<date-range
			:date-end="dateEnd"
			date-end-max=""
			:date-start="dateStart"
			date-start-min=""
			:options="[
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
			]"
			unique-id="example-view-date-range"
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
			@set-range="setRange"
		/>
	</div>
</template>

<script>
import DateRange from '@/components/DateRange/DateRange.vue';

export default {
	components: {
		DateRange,
	},
	data() {
		return {
			dateEnd: '2019-01-18',
			dateStart: '2018-10-18',
		};
	},
	methods: {
		setRange(dateStart, dateEnd) {
			this.dateStart = dateStart;
			this.dateEnd = dateEnd;
		},
	},
};
</script>
