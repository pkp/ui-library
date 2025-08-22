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
 * @param {Function} onCloseFn - Called when the form can be closed.
 */
export function useFormChanged(form, additionalFields, onCloseFn = () => {}) {
	let initialState = getCurrentState();

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
			return onCloseFn();
		}

		const {openDialog} = useModal();
		return openDialog({
			actions: [
				{
					label: t('common.yes'),
					isWarnable: true,
					callback: (close) => {
						close();
						onCloseFn();
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
			message: t('common.confirmUnsavedChanges'),
			modalStyle: 'negative',
		});
	}

	return {
		setInitialState,
		hasStateChanged,
		confirmClose,
	};
}
