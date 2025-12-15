import {t, localize} from '@/utils/i18n.js';

/**
 * Returns the translation key unchanged (helper for cases where you need the key itself)
 * @param {string} translationKey - Translation key
 * @returns {string} The unchanged translation key
 */
function tk(translationKey) {
	return translationKey;
}

/**
 * Provides internationalization functions for translating content
 */
export function usePkpLocalize() {
	return {
		/**
		 * Translate a string using the translation keys
		 * @type {Function}
		 * @param {string} key - Translation key
		 * @param {Object} [params] - Optional parameters for variable replacement
		 * @returns {string} Translated string
		 */
		t,

		/**
		 * Returns a translation key unchanged
		 * @type {Function}
		 * @param {string} translationKey - Translation key
		 * @returns {string} The unchanged translation key
		 */
		tk,

		/**
		 * Get localized content from a multilingual object
		 * @type {Function}
		 * @param {Object} multilingualObject - Object with locale keys
		 * @param {string} [locale] - Specific locale to use
		 * @returns {string} Localized content
		 */
		localize,
	};
}
