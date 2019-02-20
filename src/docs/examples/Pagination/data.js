import Pagination from '@/components/Pagination/Pagination.vue';
import ViewPagination from './ViewPagination.vue';
import ViewPaginationRaw from '!!raw-loader!./ViewPagination.vue';
import ViewAdjacentPages from './ViewAdjacentPages.vue';

export default {
	viewComponent: ViewPagination,
	baseComponent: Pagination,
	propDescription: {
		currentPage: 'The page that is currently being displayed.',
		lastPage: 'The last page that is available.',
		showAdjacentPages: 'How many pages to show beside the current one. Default is <code>1</code>.',
	},
	examples: {
		'adjacent-pages': {
			label: 'Adjacent Pages',
			component: ViewAdjacentPages,
			componentRaw: ViewPaginationRaw,
		},
	},
};
