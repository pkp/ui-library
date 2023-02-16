<script>
import JobsPage from './JobsPage.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';

export default {
	name: 'FailedJobsPage',
	extends: JobsPage,
	components: {
		TableCell,
		ButtonRow,
	},
	data() {
		return {
			apiUrlRedispatchAll: null,
		};
	},
	methods: {
		removeJob(data) {
			this.rows = this.rows.filter((row) => row.id !== data.id);
			this.total = this.total - 1;
		},
		redispatch(data) {
			$.ajax({
				url: data._hrefs._redispatch,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.removeJob(data);
				},
			});
		},
		remove(data) {
			$.ajax({
				url: data._hrefs._delete,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.removeJob(data);
				},
			});
		},
		requeueAll() {
			this.isLoadingItems = true;
			$.ajax({
				url: this.apiUrlRedispatchAll,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.loadList(1);
				},
			});
		},
	},
};
</script>
