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
