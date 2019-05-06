export let props = {
	uniqueId: 'example-view-date-range',
	dateEnd: '2019-01-18',
	dateEndMax: '',
	dateStart: '2018-10-18',
	dateStartMin: '',
	options: [
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
	],
	i18n: {
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
		invalidDateRange: 'The start date must be before the end date.'
	}
};

export const propDocs = [
	{
		key: 'uniqueId',
		description:
			'A unique string to be used in <code>id</code> attributes. These ids are used internally for accessible labeling of the date range fields. This string should be unique on the page where the component is rendered.'
	},
	{
		key: 'dateEnd',
		description: 'The current end date value. Expects <code>YYYY-MM-DD</code>.'
	},
	{
		key: 'dateEndMax',
		description:
			'The latest allowed end date value. Expects <code>YYYY-MM-DD</code>.'
	},
	{
		key: 'dateStart',
		description:
			'The current start date value. Expects <code>YYYY-MM-DD</code>.'
	},
	{
		key: 'dateStartMin',
		description:
			'The earliest allowed start date value. <code>YYYY-MM-DD</code>.'
	},
	{
		key: 'options',
		description:
			'An array of quick options that the user can select instead of setting a custom range.'
	}
];

export const emitDocs = [
	{
		key: 'set-range',
		description: 'The start and end dates for the date range.'
	}
];

export default {
	emitDocs,
	props,
	propDocs
};
