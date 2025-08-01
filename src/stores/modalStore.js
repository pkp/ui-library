import {defineStore} from 'pinia';
import {ref, markRaw, computed} from 'vue';
import {t} from '@/utils/i18n';
export const useModalStore = defineStore('modal', () => {
	/**
	 * Dialog Level
	 *
	 * Because Modal from headlessui requires to be correctly nested
	 * Dialog is also available inside SideModalBody and level helps to track
	 * which of the existing dialogs should open
	 */

	const dialogLevel = computed(() => {
		if (sideModal4?.value?.opened) {
			return 4;
		} else if (sideModal3?.value?.opened) {
			return 3;
		} else if (sideModal2?.value?.opened) {
			return 2;
		} else if (sideModal1?.value?.opened) {
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
	const sideModal1 = ref(null);

	// object structure: { modalId, props, opened, component}
	const sideModal2 = ref(null);

	// object structure: { modalId, props, opened, component}
	const sideModal3 = ref(null);

	// object structure: { modalId, props, opened, component}
	const sideModal4 = ref(null);

	// creating unique modalId to ensure correct modal is being closed
	let modalIdCounter = 1;

	/**
	 *
	 * @param {*} _component
	 * @param {*} props
	 * @param {*} options - modalId: explicit ID coming from legacy stack, onClose: function to be called after modal is closed
	 */
	function openSideModal(_component, props = {}, options = {}) {
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
		if (!sideModal1.value?.opened || sideModal1.value?.toBeClosed) {
			sideModal1.value = opts;
		} else if (!sideModal2.value?.opened || sideModal2.value?.toBeClosed) {
			sideModal2.value = opts;
		} else if (!sideModal3.value?.opened || sideModal3.value?.toBeClosed) {
			sideModal3.value = opts;
		} else if (!sideModal4.value?.opened || sideModal4.value?.toBeClosed) {
			sideModal4.value = opts;
		}
	}

	function closeSideModal(component, returnData) {
		if (sideModal1?.value?.component === component) {
			closeSideModalById(false, sideModal1?.value?.modalId, returnData);
		} else if (sideModal2?.value?.component === component) {
			closeSideModalById(false, sideModal2?.value?.modalId, returnData);
		} else if (sideModal3?.value?.component === component) {
			closeSideModalById(false, sideModal3?.value?.modalId, returnData);
		} else if (sideModal4?.value?.component === component) {
			closeSideModalById(false, sideModal4?.value?.modalId, returnData);
		}
	}

	function isSideModalOpened(component) {
		if (sideModal1?.value?.component === component) {
			return true;
		} else if (sideModal2?.value?.component === component) {
			return true;
		} else if (sideModal3?.value?.component === component) {
			return true;
		} else if (sideModal4?.value?.component === component) {
			return true;
		}
		return false;
	}

	function closeSideModalById(
		triggerLegacyCloseHandler = true,
		_modalId,
		returnData,
	) {
		let modalToClose = null;
		if (sideModal1?.value?.modalId === _modalId && sideModal1?.value?.opened) {
			modalToClose = sideModal1;
		}

		if (sideModal2?.value?.modalId === _modalId && sideModal2?.value?.opened) {
			modalToClose = sideModal2;
		}

		if (sideModal3?.value?.modalId === _modalId && sideModal3?.value?.opened) {
			modalToClose = sideModal3;
		}

		if (sideModal4?.value?.modalId === _modalId && sideModal4?.value?.opened) {
			modalToClose = sideModal4;
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

		// When closing legacy modal its always important to do legacy handler clean up.
		// Therefore it depends if the close request is coming from the legacy handler, in such
		// case the clean up will be done as part of that.
		// Or whether close is triggered by clicking on close button or outside of the modal, which needs
		// to trigger handler modalClose explicitelly
		if (
			triggerLegacyCloseHandler &&
			modalToClose.value?.props?.legacyOptions?.modalHandler
		) {
			modalToClose.value?.props?.legacyOptions?.modalHandler.modalClose();
		}
	}

	// Listener for open modal requests coming from legacy handler.
	pkp?.eventBus?.$on('open-modal-vue', (_args) => {
		const props = _args.options?.props || {};
		openSideModal(
			_args.component,
			{...props, legacyOptions: _args.options},
			{modalId: _args.modalId},
		);
	});

	// For special case when the closing modal is delayed, but we know it will be closed.
	// Therefore any quick subsequent modal open should replace this one rather than creating second level
	pkp?.eventBus?.$on('close-modal-vue-soon', (_args) => {
		const modalId = _args.modalId;
		if (sideModal1.value?.modalId === modalId) {
			sideModal1.value.toBeClosed = true;
		}
		if (sideModal2.value?.modalId === modalId) {
			sideModal2.value.toBeClosed = true;
		}

		if (sideModal3.value?.modalId === modalId) {
			sideModal3.value.toBeClosed = true;
		}

		if (sideModal4.value?.modalId === modalId) {
			sideModal4.value.toBeClosed = true;
		}
	});

	// Listener for close modal requests coming from legacy handler.
	pkp?.eventBus?.$on('close-modal-vue', (_args) => {
		closeSideModalById(false, _args.modalId);
	});

	// Listener for open dialog modals coming from legacy handler.
	pkp?.eventBus?.$on('open-dialog-vue', (_args) => {
		openDialog(_args.dialogProps);
	});

	// Listener for close dialog modals coming from legacy handler.
	pkp?.eventBus?.$on('close-dialog-vue', (_args) => {
		closeDialog(false);
	});

	return {
		/** dialog level */
		dialogLevel,
		/** opening dialog */
		dialogProps,
		dialogOpened,
		openDialogNetworkError,
		openDialog,
		closeDialog,
		openSideModal,
		closeSideModal,
		closeSideModalById,
		isSideModalOpened,
		sideModal1,
		sideModal2,
		sideModal3,
		sideModal4,
	};
});
