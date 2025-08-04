import {defineStore} from 'pinia';
import {ref, markRaw, computed} from 'vue';
import {t} from '@/utils/i18n';
export const usePkpModalStore = defineStore('pkpModal', () => {
	/**
	 * Dialog Level
	 *
	 * Because Modal from headlessui requires to be correctly nested
	 * Dialog is also available inside ModalBody and level helps to track
	 * which of the existing dialogs should open
	 */

	const dialogLevel = computed(() => {
		if (modal4?.value?.opened) {
			return 4;
		} else if (modal3?.value?.opened) {
			return 3;
		} else if (modal2?.value?.opened) {
			return 2;
		} else if (modal1?.value?.opened) {
			return 1;
		}
		return 0;
	});
	/** dialogProps coming from openDialog */
	const dialogProps = ref({});
	const dialogOpened = ref(false);

	function openDialog(_dialogProps) {
		if (_dialogProps.bodyComponent) {
			_dialogProps.bodyComponent = markRaw(_dialogProps.bodyComponent);
		}
		dialogProps.value = _dialogProps;
		dialogOpened.value = true;
	}
	function closeDialog(triggerLegacyCloseHandler = true) {
		if (triggerLegacyCloseHandler && dialogProps.value.closeLegacyHandler) {
			dialogProps.value.closeLegacyHandler();
		}
		dialogProps.value = {};
		dialogOpened.value = false;
	}

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
	 * @param {*} _component
	 * @param {*} props
	 * @param {*} options - modalId: explicit ID coming from legacy stack, onClose: function to be called after modal is closed
	 */
	function openModal(_component, props = {}, options = {}) {
		modalIdCounter++;
		let component = null;
		if (typeof _component !== 'string') {
			// avoid making vue component object reactive which would be unnecessary performance hit
			component = markRaw(_component);
		} else {
			component = _component;
		}

		// modalId is either calculated internally or its comming from the legacy handler if its legacy modal
		const modalId = options?.modalId ? options?.modalId : modalIdCounter;

		const opts = {
			modalId,
			opened: true,
			component,
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

	function closeModal(component, returnData) {
		if (modal1?.value?.component === component) {
			closeModalById(modal1?.value?.modalId, returnData);
		} else if (modal2?.value?.component === component) {
			closeModalById(modal2?.value?.modalId, returnData);
		} else if (modal3?.value?.component === component) {
			closeModalById(modal3?.value?.modalId, returnData);
		} else if (modal4?.value?.component === component) {
			closeModalById(modal4?.value?.modalId, returnData);
		}
	}

	function isModalOpened(component) {
		if (modal1?.value?.component === component) {
			return true;
		} else if (modal2?.value?.component === component) {
			return true;
		} else if (modal3?.value?.component === component) {
			return true;
		} else if (modal4?.value?.component === component) {
			return true;
		}
		return false;
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
		}, 450);
	}

	return {
		/** dialog level */
		dialogLevel,
		/** opening dialog */
		dialogProps,
		dialogOpened,
		openDialogNetworkError,
		openDialog,
		closeDialog,
		openModal,
		closeModal,
		closeModalById,
		isModalOpened,
		modal1,
		modal2,
		modal3,
		modal4,
	};
});
