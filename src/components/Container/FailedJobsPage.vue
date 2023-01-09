<script>
import Page from './Page.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/Table/Table.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog';

export default {
	name: 'FailedJobsPage',
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
			isLoadingItems: false,
			apiUrl: null
		};
	},
	mixins: [ajaxError, dialog],
	methods: {
		handlePagination: function(page) {
			this.isLoadingItems = true;
			const paged = new URL(window.location.href);
			paged.searchParams.set('page', page);
			window.location = paged;
		},
		refreshComponent: function(data) {
			this.rows = this.rows.filter(row => row.id !== data.id);
			this.total = this.total - 1;
			this.description = this.__('admin.jobs.failed.totalCount', {
				total: this.total
			});
			this.$forceUpdate();
		},
		redispatch: function(data) {
			$.ajax({
				url: this.apiUrl + '/redispatch/' + data.id,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				error: this.ajaxErrorCallback,
				success: response => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.refreshComponent(data);
				}
			});
		},
		remove: function(data) {
			$.ajax({
				url: this.apiUrl + '/failed/delete/' + data.id,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE'
				},
				error: this.ajaxErrorCallback,
				success: response => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.refreshComponent(data);
				}
			});
		},
		showExceptionTrace: function(data) {
			this.openDialog({
				name: 'jobException',
				title: this.__('admin.jobs.action.view.error.title'),
				message: data.exception,
				actions: [
					{
						label: this.__('common.ok'),
						callback: () => this.$modal.hide('jobException')
					}
				]
			});
		}
	},
	created() {
		pkp.eventBus.$on('redispatch-job', data => {
			this.redispatch(data);
		});

		pkp.eventBus.$on('remove-job', data => {
			this.remove(data);
		});

		pkp.eventBus.$on('show-job-exception', data => {
			this.showExceptionTrace(data);
		});
	}
};
</script>
