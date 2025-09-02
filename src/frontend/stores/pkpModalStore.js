import {defineStore} from 'pinia';
import {ref} from 'vue';
import {t} from '@/utils/i18n';
export const usePkpModalStore = defineStore('pkpModal', () => {
	/** Default network error */
	function openDialogNetworkError(fetchError) {
		const msg =
			fetchError?.data?.errorMessage ||
			fetchError?.data?.error ||
			t('common.unknownError');

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
			modalStyle: 'negative',
		});
	}

	/**
	 * Side Modal Level
	 *
	 */

	// object structure: { modalId, props, opened, component}
	const modal1 = ref(null);

	// object structure: { modalId, props, opened, component}
	const modal2 = ref(null);

	// object structure: { modalId, props, opened, component}
	const modal3 = ref(null);

	// object structure: { modalId, props, opened, component}
	const modal4 = ref(null);

	// creating unique modalId to ensure correct modal is being closed
	let modalIdCounter = 1;

	/**
	 *
	 * @param {*} props
	 * @param {*} options - modalId: explicit ID coming from legacy stack, onClose: function to be called after modal is closed
	 */
	function openDialog(props = {}, options = {}) {
		modalIdCounter++;

		// modalId is either calculated internally or its comming from the legacy handler if its legacy modal
		const modalId = options?.modalId ? options?.modalId : modalIdCounter;

		const opts = {
			modalId,
			opened: true,
			props,
			onClose: options.onClose,
		};

		// At this point we support two levels of side modals
		//
		// toBeClosed is used for edge case when modal close is delayed in 'onFormSuccess_' in ModalHandler to indicate
		// form was successfully submitted. This does not work well in scenario when follow-up modal is immediately opened and
		// is supposed to replace it (selecting issue & confirm publishing article modals)
		if (!modal1.value?.opened || modal1.value?.toBeClosed) {
			modal1.value = opts;
		} else if (!modal2.value?.opened || modal2.value?.toBeClosed) {
			modal2.value = opts;
		} else if (!modal3.value?.opened || modal3.value?.toBeClosed) {
			modal3.value = opts;
		} else if (!modal4.value?.opened || modal4.value?.toBeClosed) {
			modal4.value = opts;
		}
	}

	function closeTopDialog() {
		if (modal4.value?.opened) {
			closeModalById(modal4.value.modalId);
		} else if (modal3.value?.opened) {
			closeModalById(modal3.value.modalId);
		} else if (modal2.value?.opened) {
			closeModalById(modal2.value.modalId);
		} else if (modal1.value?.opened) {
			closeModalById(modal1.value.modalId);
		}
	}

	function closeModalById(_modalId, returnData) {
		let modalToClose = null;
		if (modal1?.value?.modalId === _modalId && modal1?.value?.opened) {
			modalToClose = modal1;
		}

		if (modal2?.value?.modalId === _modalId && modal2?.value?.opened) {
			modalToClose = modal2;
		}

		if (modal3?.value?.modalId === _modalId && modal3?.value?.opened) {
			modalToClose = modal3;
		}

		if (modal4?.value?.modalId === _modalId && modal4?.value?.opened) {
			modalToClose = modal4;
		}

		// it might have been replaced with other modal
		if (!modalToClose) {
			return;
		}
		modalToClose.value.opened = false;
		if (modalToClose.value.onClose) {
			modalToClose.value.onClose(returnData);
		}
		// To keep the side modal animation nice, it needs to keep the component&props around for bit longer
		setTimeout(() => {
			if (!modalToClose.value?.opened) {
				modalToClose.value = null;
			}
		}, 700);
	}

	return {
		/** opening dialog */
		openDialogNetworkError,
		openDialog,
		closeTopDialog,
		modal1,
		modal2,
		modal3,
		modal4,
	};
});
