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

	const sideModalStack = ref([]);

	function openSideModal(_component, props) {
		let component = null;
		if (typeof _component !== 'string') {
			component = markRaw(_component);
		} else {
			component = _component;
		}
		sideModalStack.value.push({
			opened: true,
			component,
			props,
		});
	}

	function closeSideModal() {
		const modalToClose = sideModalStack.value[sideModalStack.value.length - 1];
		modalToClose.opened = false;
		console.log(modalToClose?.props?.options?.modalHandler);
		//if (modalToClose?.props?.options?.modalHandler) {
		//console.log('triggereing modalCLose from store');
		//	modalToClose.props?.options?.modalHandler.modalClose();
		//}
		// TODO improve to avoid edge cases from fast clicking
		sideModalStack.value.pop();

		/*setTimeout(() => {
			sideModalStack.value.pop();
		}, 300);*/
	}

	const sideModal1 = computed(() => {
		return sideModalStack.value[0] || null;
	});
	const sideModal2 = computed(() => {
		return sideModalStack.value[1] || null;
	});
	const sideModal3 = computed(() => {
		return sideModalStack.value[2] || null;
	});

	/** POC, its disabled for now, it will handle legacy modals in future to improve their accessibility */
	pkp.eventBus.$on('open-modal-vue', (_args) => {
		openSideModal(_args.component, {
			options: _args.options,
		});
	});

	pkp.eventBus.$on('close-modal-vue', () => {
		closeSideModal();
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
