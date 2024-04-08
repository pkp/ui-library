import {defineStore} from 'pinia';
import {ref, computed, markRaw} from 'vue';
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
	function closeDialog(triggerLegacyCloseHandler = true) {
		if (triggerLegacyCloseHandler && dialogProps.value.closeLegacyHandler) {
			dialogProps.value.closeLegacyHandler();
		}
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

	const sideModalStack = ref([]);
	const sideModal1 = ref(null);
	const sideModal2 = ref(null);

	let modalIdCounter = 1;

	function openSideModal(_component, props, _modalId = null) {
		modalIdCounter++;
		let component = null;
		if (typeof _component !== 'string') {
			component = markRaw(_component);
		} else {
			component = _component;
		}
		const modalId = _modalId ? _modalId : modalIdCounter;

		const opts = {
			modalId,
			opened: true,
			component,
			props,
		};

		if (!sideModal1.value?.opened || sideModal1.value?.toBeClosed) {
			sideModal1.value = opts;
		} else if (!sideModal2.value?.opened) {
			sideModal2.value = opts;
		}
	}

	function closeSideModal(triggerLegacyCloseHandler = true, _modalId) {
		let modalToClose = null;
		if (sideModal1?.value?.modalId === _modalId) {
			modalToClose = sideModal1;
		}

		if (sideModal2?.value?.modalId === _modalId) {
			modalToClose = sideModal2;
		}
		modalToClose.value.opened = false;
		setTimeout(() => {
			if (!modalToClose.value.opened) {
				modalToClose.value = null;
			}
		}, 300);

		if (
			triggerLegacyCloseHandler &&
			modalToClose.value?.props?.options?.modalHandler
		) {
			modalToClose.value?.props?.options?.modalHandler.modalClose();
		}
		// TODO improve to avoid edge cases from fast clicking
	}

	const sideModal3 = computed(() => {
		return sideModalStack.value[2] || null;
	});

	/** POC, its disabled for now, it will handle legacy modals in future to improve their accessibility */
	pkp.eventBus.$on('open-modal-vue', (_args) => {
		openSideModal(
			_args.component,
			{
				options: _args.options,
			},
			_args.options.modalId,
		);
	});

	pkp.eventBus.$on('close-modal-vue-soon', (_args) => {
		const modalId = _args.modalId;
		if (sideModal1.value?.modalId === modalId) {
			sideModal1.value.toBeClosed = true;
		}
		if (sideModal2.value?.modalId === modalId) {
			sideModal2.value.toBeClosed = true;
		}
	});

	pkp.eventBus.$on('close-modal-vue', (_args) => {
		closeSideModal(false, _args.modalId);
	});

	pkp.eventBus.$on('open-dialog-vue', (_args) => {
		openDialog(_args.dialogProps);
	});

	pkp.eventBus.$on('close-dialog-vue', (_args) => {
		closeDialog(false);
	});

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
		openSideModal,
		closeSideModal,
		sideModal1,
		sideModal2,
		sideModal3,
	};
});
