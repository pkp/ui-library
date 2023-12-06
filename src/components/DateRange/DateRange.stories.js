import DateRange from './DateRange.vue';
import {ref} from 'vue';

export default {
	title: 'Components/DateRange',
	component: DateRange,
};

export const Default = {
	render: (args) => ({
		components: {DateRange},
		setup() {
			const dateEnd = ref('2019-01-18');
			const dateStart = ref('2018-10-18');

			function setRange(_dateStart, _dateEnd) {
				dateStart.value = _dateStart;
				dateEnd.value = _dateEnd;
			}
			return {dateEnd, dateStart, setRange, args};
		},
		template: `
			<DateRange
				v-bind="args"

				:date-end="dateEnd"
				:date-start="dateStart"

				@set-range="setRange"
			/>
		`,
	}),

	args: {
		dateEndMax: '',
		dateStartMin: '',
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
		uniqueId: 'example-view-date-range',
		dateRangeLabel: 'Date Range',
		dateFormatInstructionsLabel:
			'Enter each date in the format YYYY-MM-DD. For example, if you want the date for 15 January, 2019, enter 2019-01-15.',
		changeDateRangeLabel: 'Change date range',
		sinceDateLabel: 'Since {$date}',
		untilDateLabel: 'Until {$date}',
		allDatesLabel: 'All dates',
		customRangeLabel: 'Custom Range',
		fromDateLabel: 'From',
		toDateLabel: 'To',
		applyLabel: 'Apply',
		invalidDateLabel:
			'The date format is not valid. Enter each date in the format YYYY-MM-DD.',
		dateDoesNotExistLabel: 'One of the dates entered does not exist.',
		invalidDateRangeLabel: 'The start date must be before the end date.',
		invalidStartDateMinLabel: 'The start date may not be earlier than {$date}.',
		invalidEndDateMaxLabel: 'The end date may not be later than {$date}.',
	},
	parameters: {
		docs: {
			story: {
				height: '400px',
			},
		},
	},
};
