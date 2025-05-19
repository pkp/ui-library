/**
 * Provides functions to check which PKP application is currently running
 */
export function useApp() {
	/**
	 * Check if the current application is Open Journal Systems
	 * @returns {boolean} True if the application is OJS
	 */
	function isOJS() {
		return pkp.context.app === 'ojs2';
	}

	/**
	 * Check if the current application is Open Monograph Press
	 * @returns {boolean} True if the application is OMP
	 */
	function isOMP() {
		return pkp.context.app === 'omp';
	}

	/**
	 * Check if the current application is Open Preprint Systems
	 * @returns {boolean} True if the application is OPS
	 */
	function isOPS() {
		return pkp.context.app === 'ops';
	}

	/**
	 * Get the list of supported locales for the current application.
	 *
	 * @returns {Object} An object of supported locale codes (e.g., {en: 'English', fr_CA: 'French'}).
	 */
	function getSupportedLocales() {
		return pkp.context.supportedLocales;
	}

	/**
	 * Get the list of form supported locales for the current application.
	 *
	 * @returns {Object} An object of supported locale codes (e.g., {en: 'English', fr_CA: 'French'}).
	 */
	function getSupportedFormLocales() {
		return pkp.context.supportedFormLocales;
	}

	/**
	 * Get the primary locale of the application.
	 *
	 * @returns {string} The current locale code (e.g., 'en').
	 */
	function getPrimaryLocale() {
		return pkp.context.primaryLocale;
	}

	/**
	 * Get the current locale of the application.
	 *
	 * @returns {string} The current locale code (e.g., 'en').
	 */
	function getCurrentLocale() {
		return pkp.context.currentLocale;
	}

	/**
	 * Get the help URL for the current application.
	 *
	 * @returns {string} The URL to the help documentation.
	 */
	function getHelpUrl() {
		return pkp.context.helpUrl;
	}

	return {
		isOJS,
		isOMP,
		isOPS,
		getSupportedLocales,
		getSupportedFormLocales,
		getCurrentLocale,
		getPrimaryLocale,
		getHelpUrl,
	};
}
