<script>
import Page from './Page.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/Table/Table.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'JobsPage',
	extends: Page,
	components: {
		PkpTable,
		Pagination,
	},
	data() {
		return {
			i18nDescription: '',
			columns: [],
			rows: [],
			label: '',
			total: 0,
			currentPage: 1,
			lastPage: 1,
			isLoadingItems: false,
			apiUrl: null,
		};
	},
	mixins: [ajaxError],
	computed: {
		description() {
			return this.replaceLocaleParams(this.i18nDescription, {
				total: this.total,
			});
		},
	},
	methods: {
		handlePagination(page) {
			this.isLoadingItems = true;
			this.loadList(page);
		},
		loadList(page) {
			page = page || 1;

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				data: {page: page},
				error: this.ajaxErrorCallback,
				success: (response) => {
					this.rows = response.data;
					this.total = response.total;
					this.currentPage = response.pagination.currentPage;
					this.lastPage = response.pagination.lastPage;
					this.isLoadingItems = false;
				},
			});
		},
	},
	created() {
		this.loadList();
	},
};
</script>
