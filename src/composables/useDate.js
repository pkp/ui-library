import {
	formatShortDate,
	formatShortDateTime,
	calculateDaysBetweenDates,
	getDateCurrentLocale,
	relativeStringTimeFromNow,
} from '@/utils/dateUtils';

/**
 * Provides date formatting and calculation functions
 * @returns {Object} Object containing date utility functions
 */
export function useDate() {
	return {
		/**
		 * Calculate the number of days between two dates
		 * @type {Function}
		 * @param {Date|string} startDate - The start date
		 * @param {Date|string} endDate - The end date
		 * @returns {number} Number of days between dates
		 */
		calculateDaysBetweenDates,

		/**
		 * Format a date in a short format according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted date string
		 */
		formatShortDate,

		/**
		 * Format a date with time in a short format according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted date and time string
		 */
		formatShortDateTime,

		/**
		 * Get the current locale for date formatting
		 * @type {Function}
		 * @returns {string} Current locale code
		 */
		getDateCurrentLocale,

		/**
		 * Get a relative time string from a date (e.g., "2 days ago")
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Relative time string
		 */
		relativeStringTimeFromNow,
	};
}
