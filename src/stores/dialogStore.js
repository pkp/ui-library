import {defineStore} from 'pinia';
import {ref} from 'vue';
import {t} from '@/utils/i18n';
export const useDialogStore = defineStore('dialog', () => {
	const currentLevel = ref(0);
	const dialogProps = ref({});
	const dialogOpened = ref(false);

	function openDialog(_dialogProps) {
		dialogProps.value = _dialogProps;
		dialogOpened.value = true;
	}

	function openDialogNetworkError(fetchError) {
		const msg = fetchError?.data?.errorMessage || t('common.unknownError');

		openDialog({
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
	}

	function closeDialog() {
		dialogProps.value = {};
		dialogOpened.value = false;
	}

	return {
		currentLevel,
		dialogProps,
		dialogOpened,
		openDialogNetworkError,
		openDialog,
		closeDialog,
	};
});
