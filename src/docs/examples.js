import ViewBadge from './examples/Badge/ViewBadge.vue';
import BadgeRaw from '!!raw-loader!@/components/Badge/Badge.vue';
import ViewButton from './examples/Button/ViewButton.vue';
import ButtonRaw from '!!raw-loader!@/components/Button/Button.vue';
import ViewDateRange from './examples/DateRange/ViewDateRange.vue';
import DateRangeRaw from '!!raw-loader!@/components/DateRange/DateRange.vue';
import ViewIcon from './examples/Icon/ViewIcon.vue';
import IconRaw from '!!raw-loader!@/components/Icon/Icon.vue';
import ViewList from './examples/List/ViewList.vue';
import ViewListRaw from '!!raw-loader!./examples/List/ViewList.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelRaw from '!!raw-loader!@/components/ListPanel/ListPanel.vue';
import ViewPageHeader from './examples/PageHeader/ViewPageHeader.vue';
import ViewPageHeaderRaw from '!!raw-loader!./examples/PageHeader/ViewPageHeader.vue';
import ViewPagination from './examples/Pagination/ViewPagination.vue';
import ViewPaginationRaw from '!!raw-loader!./examples/Pagination/ViewPagination.vue';
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectListPanelRaw from '!!raw-loader!@/components/SelectListPanel/SelectListPanel.vue';
import ArticleStatistics from './examples/Statistics/ArticleStatistics.vue';
import ArticleStatisticsRaw from '!!raw-loader!./examples/Statistics/ArticleStatistics.vue';
import ViewTable from './examples/Table/ViewTable.vue';
import ViewTableRaw from '!!raw-loader!./examples/Table/ViewTable.vue';

export default {
	Badge: {
		component: ViewBadge,
		componentRaw: BadgeRaw,
		label: 'Badge',
		url: '/components/Badge',
	},
	Button: {
		component: ViewButton,
		componentRaw: ButtonRaw,
		label: 'Button',
		url: '/components/Button',
	},
	DateRange: {
		component: ViewDateRange,
		componentRaw: DateRangeRaw,
		label: 'DateRange',
		url: '/components/DateRange',
	},
	Icon: {
		component: ViewIcon,
		componentRaw: IconRaw,
		label: 'Icon',
		url: '/components/Icon',
	},
	List: {
		component: ViewList,
		componentRaw: ViewListRaw,
		label: 'List',
		url: '/components/List',
	},
	ListPanel: {
		component: ListPanel,
		componentRaw: ListPanelRaw,
		label: 'ListPanel',
		url: '/components/ListPanel',
	},
	PageHeader: {
		component: ViewPageHeader,
		componentRaw: ViewPageHeaderRaw,
		label: 'PageHeader',
		url: '/components/PageHeader',
	},
	Pagination: {
		component: ViewPagination,
		componentRaw: ViewPaginationRaw,
		label: 'Pagination',
		url: '/components/Pagination',
	},
	SelectListPanel: {
		component: SelectListPanel,
		componentRaw: SelectListPanelRaw,
		label: 'SelectListPanel',
		url: '/components/SelectListPanel',
	},
	Statistics: {
		component: ArticleStatistics,
		componentRaw: ArticleStatisticsRaw,
		label: 'Statistics',
		url: '/components/Statistics',
	},
	Table: {
		component: ViewTable,
		componentRaw: ViewTableRaw,
		label: 'Table',
		url: '/components/Table',
	},
};
