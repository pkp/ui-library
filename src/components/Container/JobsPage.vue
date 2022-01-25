<script>
import Page from './Page.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/Table/Table.vue';

export default {
	name: 'JobsPage',
	extends: Page,
	components: {
		PkpTable,
		Pagination
	},
	data() {
		return {
			columns: [],
			rows: [],
			label: '',
			description: '',
			total: 0,
			currentPage: 1,
			lastPage: 1,
			isLoadingItems: false
		};
	},
	methods: {
		handlePagination: function(page) {
			this.isLoadingItems = true;
			window.location = this.url + '?page=' + page;
		}
	}
};
</script>
