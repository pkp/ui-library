import DOMPurify from 'dompurify';

const sanitizeConfig = {
	USE_PROFILES: {html: true},
};

/**
 * Strip HTML tags from a string
 * This will not run the content though DOM and remove all tags which is safe appraoch to remove all tags
 *
 * @param {string} dirtyString - The string to strip HTML tags from
 * @returns {string} The string with HTML tags removed
 */
export function stripHtmlTags(dirtyString) {
	const doc = new DOMParser().parseFromString(dirtyString, 'text/html');
	return doc.body.textContent || '';
}

/**
 * Escapes HTML to display as plain text in the DOM, preserving all tags and attributes
 * This will not run the content though DOM and escape the html string which is safe of XSS attacks
 *
 * @param {string} dirtyString - The string to escape
 * @returns {string} The escaped string
 */
export function escapeHtml(dirtyString) {
	if (typeof dirtyString !== 'string') {
		return '';
	}

	const div = document.createElement('div');
	div.appendChild(document.createTextNode(dirtyString));

	return div.innerHTML;
}

export function sanitizeHtml(value) {
	return DOMPurify.sanitize(value, sanitizeConfig);
}

export const stripUnsafeHtml = {
	// Called only once, when the directive is first bound to the element.
	// This is where you can do one-time setup work.
	mounted(el, binding) {
		// Handle null and undefined values by defaulting to an empty string
		const value = binding.value == null ? '' : String(binding.value);
		const cleanContent = sanitizeHtml(value);
		el.innerHTML = cleanContent;
	},
	// Called whenever the bound value changes.
	updated(el, binding) {
		// Only re-sanitize and update if the value has changed, handling null and undefined
		if (binding.value !== binding.oldValue) {
			const value = binding.value == null ? '' : String(binding.value);
			const cleanContent = sanitizeHtml(value);
			el.innerHTML = cleanContent;
		}
	},
};

export default stripUnsafeHtml;
