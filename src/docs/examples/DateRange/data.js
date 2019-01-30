import DateRange from '@/components/DateRange/DateRange.vue';
import ViewDateRange from './ViewDateRange.vue';

export default {
	viewComponent: ViewDateRange,
	baseComponent: DateRange,
	propDescription: {
		uniqueId: 'A unique string to be used in <code>id</code> attributes. These ids are used internally for accessible labeling of the date range fields. This string should be unique on the page where the component is rendered.',
		dateEnd: 'The current end date value. Expects <code>YYYY-MM-DD</code>.',
		dateEndMax: 'The latest allowed end date value. Expects <code>YYYY-MM-DD</code>.',
		dateStart: 'The current start date value. Expects <code>YYYY-MM-DD</code>.',
		dateStartMin: 'The earliest allowed start date value. <code>YYYY-MM-DD</code>.',
		options: 'An array of quick options that the user can select instead of setting a custom range.',
	},
};
