/**
 * Escape HTML in a string, for example HTML in names and other
 * user-provided information.
 */
function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export const usePkpEscapeHtml = () => ({
	escapeHtml,
});
