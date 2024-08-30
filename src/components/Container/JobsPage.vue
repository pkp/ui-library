<script>
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'JobsPage',
	components: {
		PkpTable,
		TableCell,
		Pagination,
	},
	mixins: [ajaxError],
	data() {
		return {
			rows: [],
			total: 0,
			currentPage: 1,
			lastPage: 1,
			isLoadingItems: false,
		};
	},
	props: {
		label: {
			type: String,
			default: '',
		},
		i18nDescription: {
			type: String,
			default: '',
		},
		columns: {
			type: Array,
			default: [],
		},
		apiUrl: {
			type: String,
			default: null,
		},
		apiUrlRedispatchAll: {
			type: String,
			default: null,
		},
	},
	computed: {
		description() {
			return this.replaceLocaleParams(this.i18nDescription, {
				total: this.total,
			});
		},
	},
	created() {
		this.loadList();
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
};
</script>
