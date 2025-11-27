import {onMounted, onUnmounted, inject} from 'vue';
import {useModal} from './useModal';
import {t} from '@/utils/i18n';

/**
 * useFormChanged
 *
 * Tracks whether a form has unsaved changes and shows a confirmation dialog
 * before closing.
 *
 * @param {Ref} form - Reactive form object (expects `.value.fields`).
 * @param {Array} additionalFields - Extra fields to include in tracking. (e.g. [Ref])
 * @param {Object} options
 * @param {Boolean} options.warnOnClose - If true, shows a confirmation prompt when closing with unsaved changes.
 */
export function useFormChanged(
	form,
	additionalFields,
	{warnOnClose = false} = {},
) {
	let initialState = getCurrentState();
	let beforeUnloadHandler;
	let closeConfirmed = false;
	const registerCloseCallback = inject('registerCloseCallback');
	const closeModal = inject('closeModal');
	let unregisterCloseCallback = null;

	function getCurrentState() {
		const fields = (form.value?.fields || []).concat(additionalFields || []);
		return JSON.stringify(
			fields.map((field) => field.value).filter((v) => v != null && v !== ''),
		);
	}

	// mark current state of the form, useful after resetting or saving the form
	function setInitialState() {
		initialState = getCurrentState();
	}

	// check if form has unsaved changes
	function hasStateChanged() {
		return getCurrentState() !== initialState;
	}

	// confirm before closing if changes exist
	function confirmClose() {
		if (!hasStateChanged()) {
			return closeModal();
		}

		const {openDialog} = useModal();
		return openDialog({
			actions: [
				{
					label: t('common.yes'),
					isWarnable: true,
					callback: (close) => {
						close();
						closeConfirmed = true;
						closeModal();
					},
				},
				{
					label: t('common.no'),
					callback: (close) => {
						close();
					},
				},
			],
			title: t('common.warning'),
			message: t('form.dataHasChanged'),
			modalStyle: 'negative',
		});
	}

	onMounted(() => {
		if (!warnOnClose) return;

		// ask before leaving the page (close tab, refresh, navigate) if unsaved changes exist
		beforeUnloadHandler = (event) => {
			if (hasStateChanged()) {
				event.preventDefault();
				event.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', beforeUnloadHandler);

		// show a warning before closing the modal if there are unsaved changes
		if (registerCloseCallback) {
			unregisterCloseCallback = registerCloseCallback(() => {
				if (hasStateChanged() && !closeConfirmed) {
					confirmClose();
				}
				return !hasStateChanged() || closeConfirmed;
			});
		}
	});

	onUnmounted(() => {
		if (!warnOnClose) return;

		if (beforeUnloadHandler) {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
			beforeUnloadHandler = null;
		}

		if (unregisterCloseCallback) {
			unregisterCloseCallback();
		}
	});

	return {
		setInitialState,
		hasStateChanged,
		confirmClose,
	};
}
