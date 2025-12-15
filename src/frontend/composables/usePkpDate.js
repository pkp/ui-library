import {formatShortDateTime} from '@/utils/dateUtils';

/**
 * Provides date formatting and calculation functions
 * @returns {Object} Object containing date utility functions
 */
export function usePkpDate() {
	return {
		/**
		 * Format a date with time in a short format according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted date and time string
		 */
		formatShortDateTime,
	};
}
