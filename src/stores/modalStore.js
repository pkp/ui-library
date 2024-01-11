import {defineStore} from 'pinia';
import {ref} from 'vue';
import {t} from '@/utils/i18n';
export const useModalStore = defineStore('modal', () => {
	/**
	 * Dialog Level
	 *
	 * Because Modal from headlessui requires to be correctly nested
	 * Dialog is also available inside SideModalBody and level helps to track
	 * which of the existing dialogs should open
	 */
	const dialogLevel = ref(0);
	function increaseDialogLevel() {
		dialogLevel.value++;
	}

	function decreaseDialogLevel() {
		dialogLevel.value--;
	}

	/** dialogProps coming from openDialog */
	const dialogProps = ref({});
	const dialogOpened = ref(false);

	function openDialog(_dialogProps) {
		dialogProps.value = _dialogProps;
		dialogOpened.value = true;
	}
	function closeDialog() {
		dialogProps.value = {};
		dialogOpened.value = false;
	}

	/** Default network error */
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

	/**
	 * Side Modal Level
	 *
	 * To recognise how many side modals is opened to adjust styling
	 */
	const modalLevel = ref(0);
	function increaseModalLevel() {
		modalLevel.value++;
	}

	function decreaseModalLevel() {
		modalLevel.value--;
	}

	return {
		/** dialog level */
		decreaseDialogLevel,
		increaseDialogLevel,
		/** opening dialog */
		dialogLevel,
		dialogProps,
		dialogOpened,
		openDialogNetworkError,
		openDialog,
		closeDialog,
		/** side modal level */
		modalLevel,
		increaseModalLevel,
		decreaseModalLevel,
	};
});
