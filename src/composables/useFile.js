import {formatFileSize} from '@/utils/fileUtils';

/**
 * Provides file-related utility functions
 * @returns {Object} Object containing file utility functions
 */
export function useFile() {
	return {
		/**
		 * Format a file size in bytes to a human-readable string
		 * @type {Function}
		 * @param {number} bytes - The file size in bytes
		 * @returns {string} Formatted size string (e.g., "1.5 MB")
		 */
		formatFileSize,
	};
}
