import {
	formatShortDate,
	formatShortDateTime,
	formatLongDate,
	formatLongDateTime,
	formatTime,
} from '@/utils/dateUtils';

/**
 * Provides date formatting and calculation functions
 * @returns {Object} Object containing date utility functions
 */
export function usePkpDate() {
	return {
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
		 * Format a date in a long format according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted date string
		 */
		formatLongDate,
		/**
		 * Format a date with time in a long format according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted date and time string
		 */
		formatLongDateTime,
		/**
		 * Format a time according to user locale
		 * @type {Function}
		 * @param {Date|string} date - The date to format
		 * @returns {string} Formatted time string
		 */
		formatTime,
	};
}
