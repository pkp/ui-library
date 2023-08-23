<script>
import PkpForm from '../Form.vue';
import dialog from '@/mixins/dialog.js';

export default {
	name: 'NotifyUsersForm',
	extends: PkpForm,
	mixins: [dialog],
	props: {
		confirmLabel: {
			type: String,
			required: true,
		},
		userGroupCounts: {
			type: Object,
			required: true,
		},
		sendLabel: {
			type: String,
			required: true,
		},
	},
	methods: {
		/**
		 * Require user confirmation before submitting the form
		 */
		nextPage: function (pageId) {
			let totalUserCount = 0;
			if (this.submitValues.userGroupIds) {
				totalUserCount = this.submitValues.userGroupIds.reduce(
					(total, userGroupId) => {
						return total + this.userGroupCounts[userGroupId];
					},
					0
				);
			}
			this.openDialog({
				name: 'confirmNotify',
				title: this.sendLabel,
				message: this.confirmLabel.replace('{$total}', totalUserCount),
				actions: [
					{
						label: this.sendLabel,
						isPrimary: true,
						callback: (close) => {
							this.submit();
							close();
						},
					},
					{
						label: this.__('common.cancel'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		},
	},
};
</script>
