<script type="text/javascript">
import Page from './Page.vue';
import NotifyUsersForm from '@/components/Form/context/NotifyUsersForm.vue';

export default {
	name: 'AccessPage',
	extends: Page,
	components: {
		NotifyUsersForm,
	},
	data() {
		return {
			totalBulkJobs: 0,
		};
	},
	methods: {
		/**
		 * Reload the page to send another email
		 */
		reload() {
			window.location.reload();
		},
	},
	mounted() {
		pkp.eventBus.$on('form-success', (formId, data) => {
			if (formId !== pkp.const.FORM_NOTIFY_USERS) {
				return;
			}

			this.totalBulkJobs = data.totalBulkJobs;
		});
	},
	destroyed() {
		pkp.eventBus.$off('form-success');
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.notifyUsers__progress__spinner {
	margin-right: 0.25em;
}
</style>
