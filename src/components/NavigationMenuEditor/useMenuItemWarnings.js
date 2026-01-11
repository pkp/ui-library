import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

/**
 * Composable for handling menu item warning dialogs
 * Provides methods to show submenu and conditional display warnings
 *
 * @returns {Object} Methods for showing warning dialogs
 */
export function useMenuItemWarnings() {
	const {t} = useLocalize();
	const {openDialog} = useModal();

	/**
	 * Show submenu warning dialog
	 * Displayed when a menu item has children
	 *
	 * @param {string} warningMessage - The warning message to display
	 */
	function showSubmenuWarning(warningMessage) {
		openDialog({
			title: t('common.notice'),
			message: warningMessage,
			actions: [
				{
					label: t('common.ok'),
					callback: (close) => close(),
				},
			],
		});
	}

	/**
	 * Show conditional display warning dialog
	 * Displayed for items that may not be visible to all users
	 *
	 * @param {string} conditionalWarning - The conditional warning message
	 */
	function showConditionalWarning(conditionalWarning) {
		const message =
			conditionalWarning ||
			t('manager.navigationMenus.form.conditionalDisplay');
		openDialog({
			title: t('common.notice'),
			message: message,
			actions: [
				{
					label: t('common.ok'),
					callback: (close) => close(),
				},
			],
		});
	}

	return {
		showSubmenuWarning,
		showConditionalWarning,
	};
}
