import {defineStore} from 'pinia';

export const useDialogStore = defineStore('dialog', {
	state: () => {
		return {
			dialogProps: {},
			dialogOpened: false,
		};
	},
	actions: {
		openDialog(dialogProps) {
			this.dialogProps = dialogProps;
			this.dialogOpened = true;
		},
		openDialogNetworkError(fetchError) {
			const msg =
				fetchError?.data?.errorMessage || this.t('common.unknownError');

			this.openDialog({
				name: 'ajaxError',
				title: this.t('common.error'),
				message: msg,
				actions: [
					{
						label: this.t('common.ok'),
						callback: (close) => close(),
					},
				],
			});
		},
		closeDialog() {
			this.dialogProps = {};
			this.dialogOpened = false;
		},
	},
});
