/**
 * Composable for showing notification messages to the user
 *
 * @returns {Object} The notify function
 */
export function useNotify() {
	/**
	 * Display a notification message
	 *
	 * @param {String} message - The message to display
	 * @param {String} level - The notification level ('success', 'warning', or empty for neutral)
	 */
	function notify(message, level = '') {
		pkp.eventBus.$emit('notify', message, level);
	}

	return {notify};
}
