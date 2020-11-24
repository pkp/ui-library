<script type="text/javascript">
import Page from './Page.vue';
import NotifyUsersForm from '@/components/Form/context/NotifyUsersForm.vue';
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';

export default {
	name: 'AccessPage',
	extends: Page,
	components: {
		NotifyUsersForm,
		ProgressBar
	},
	data() {
		return {
			completedJobs: 0,
			progressUrl: '',
			queueId: '',
			totalJobs: 0
		};
	},
	methods: {
		/**
		 * Process an email jobs queue
		 *
		 * @param string queueId
		 */
		processQueue(queueId) {
			var self = this;
			$.ajax({
				url: this.progressUrl.replace('{queueId}', queueId),
				method: 'PUT',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT'
				},
				error: this.ajaxErrorCallback,
				success(r) {
					self.completedJobs = self.totalJobs - r.pendingJobs;
					if (r.pendingJobs) {
						self.processQueue(queueId);
					}
				}
			});
		},

		/**
		 * Reload the page to send another email
		 */
		reload() {
			window.location.reload();
		}
	},
	mounted() {
		pkp.eventBus.$on('form-success', (formId, data) => {
			if (formId !== pkp.const.FORM_NOTIFY_USERS) {
				return;
			}

			this.queueId = data.queueId;
			this.totalJobs = data.totalJobs;
			this.processQueue(this.queueId);
		});
	},
	destroyed() {
		pkp.eventBus.$off('form-success');
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.notifyUsers__progress__spinner {
	margin-right: 0.25em;
}
</style>
