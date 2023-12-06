import {defineStore} from 'pinia';
import {t} from '@/utils/i18n';
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
			const msg = fetchError?.data?.errorMessage || t('common.unknownError');

			this.openDialog({
				name: 'ajaxError',
				title: t('common.error'),
				message: msg,
				actions: [
					{
						label: t('common.ok'),
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
