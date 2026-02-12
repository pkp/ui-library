/**
 * Format a file size in bytes to a human-readable string
 *
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
	if (bytes == null || bytes === 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const size = bytes / Math.pow(k, i);

	return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Parse error responses from Dropzone uploads.
 *
 * Handles different error formats:
 * - String errors from Dropzone.js
 * - Object errors with errorMessage property from API
 * - Object errors with validation fields from API
 *
 * @param {string|Object} error - The error from Dropzone or API
 * @returns {string[]} Array of error messages
 */
export function parseDropzoneError(error) {
	if (typeof error === 'string') {
		return [error];
	}
	if (error?.errorMessage !== undefined) {
		return [error.errorMessage];
	}
	if (typeof error === 'object' && error !== null) {
		return Object.keys(error)
			.map((key) => error[key])
			.flat();
	}
	return [];
}
