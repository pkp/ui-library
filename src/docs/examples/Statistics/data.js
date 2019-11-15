import Statistics from '@/components/Statistics/Statistics.vue';
import ViewArticleStatistics from './ViewArticleStatistics.vue';
import ViewEditorialStatistics from './ViewEditorialStatistics.vue';
import EditorialStatisticsRaw from '!!raw-loader!./ViewEditorialStatistics.vue';

export default {
	viewComponent: ViewArticleStatistics,
	baseComponent: Statistics,
	propDescription: {
		apiUrl: 'A URL to the API endpoint where requests for statistics data should be sent.',
		timeSegment: 'How stats in the graph should be grouped by time. It should be <code>day</code> or <code>month</code>. Default: <code>day</code>',
		items: 'An array of statistics records. These will be displayed in the table.',
		itemsMax: 'Count of total available records matching the current parameters.',
		tableColumns: 'An array of config objects defining the columns to display in the table.',
		count: 'Request this number of statistics records.',
		offset: 'The number of records to skip. Used to fetch subsequent pages of results.',
		searchPhrase: 'Limit the requested <code>items</code> to those matching this value. Each API endpoint that accepts a <code>searchPhrase</code> will determine what columns of a record are searchable. Consult the documentation for that API endpoint to know whether a <code>searchPhrase</code> is supported and what information is searched.',
		dateStart: 'Request stats after this date. Expects: <code>YYYY-MM-DD</code>',
		dateEnd: 'Request stats before this date. Expects: <code>YYYY-MM-DD</code>',
		dateEndMax: 'Limit the <code>dateEnd</code> that can be selected. Usually this is yesterday\'s date. Expects: <code>YYYY-MM-DD</code>',
		dateRangeOptions: 'An array of quick options that the user can select instead of setting a custom range. See <a href="/#/components/DateRange">DateRange</a>.',
		orderBy: 'Order the statistics records by this parameter. Should match an <code>orderBy</code> param accepted by the API endpoint.',
		orderDirection: 'Order the statistics records by this parameter. Should be <code>ASC</code> or <code>DESC</code>. Default: <code>DESC</code>',
		filters: 'A configuration object representing the supported filters.',
		activeFilters: 'An object representing the currently active filters.',
		isFilterVisible: 'A boolean flag used internally to track whether the filters panel is open or closed.',
		isLoading: 'A boolean flag used internally to track whether new statistics records are loading.',
		originalItems: 'This is used for this demo only. It does not exist in the <code>Statistics</code> component.',
	},
	implementations: {
		'editorial': {
			label: 'Editorial Activity',
			component: ViewEditorialStatistics,
			componentRaw: EditorialStatisticsRaw,
		},
	},
};
