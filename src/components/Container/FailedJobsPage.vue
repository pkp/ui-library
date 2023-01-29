<script>
import Page from './Page.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'FailedJobsPage',
	extends: Page,
	components: {
		PkpTable,
		TableCell,
		Pagination
	},
	data() {
		return {
			columns: [],
			rows: [],
			label: '',
			total: 0,
			currentPage: 1,
			lastPage: 1,
			isLoadingItems: false,
			apiUrl: null
		};
	},
	mixins: [ajaxError],
	computed: {
		description() {
			return this.__('admin.jobs.failed.totalCount', {total: this.total});
		}
	},
	methods: {
		handlePagination(page) {
			this.isLoadingItems = true;
			this.loadList(page);
		},
		updateJobList(data) {
			this.rows = this.rows.filter(row => row.id !== data.id);
			this.total = this.total - 1;
		},
		redispatch(data) {
			$.ajax({
				url: data._hrefs._redispatch,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				error: this.ajaxErrorCallback,
				success: response => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.updateJobList(data);
				}
			});
		},
		remove(data) {
			$.ajax({
				url: data._hrefs._delete,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE'
				},
				error: this.ajaxErrorCallback,
				success: response => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.updateJobList(data);
				}
			});
		},
		loadList(page) {
			page = page || 1;

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {page: page},
				error: this.ajaxErrorCallback,
				success: response => {
					this.rows = response.data;
					this.total = response.total;
					this.currentPage = response.pagination.currentPage;
					this.lastPage = response.pagination.lastPage;
					this.isLoadingItems = false;
				}
			});
		}
	},
	created() {
		this.loadList();
	}
};
</script>
