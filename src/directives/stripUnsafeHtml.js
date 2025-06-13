import DOMPurify from 'dompurify';

const sanitizeConfig = {
	USE_PROFILES: {html: true},
	ADD_ATTR: ['target'],
};

/**Add commentMore actions
 *  Anytime you open a link in a new tab, you risk giving the new page access to your original page via window.opener (in some older browsers)
 *	The fix is to add rel="noopener" whenever you see target="_blank".
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
		// 1) collect & normalize existing tokens, drop any bare "opener"
		const tokens = (node.getAttribute('rel') || '')
			.toLowerCase()
			.split(/\s+/)
			.filter((t) => t && t !== 'opener');

		// 2) enforce noopener
		tokens.push('noopener');

		// 3) dedupe & reassign
		node.setAttribute('rel', Array.from(new Set(tokens)).join(' '));
	}
});

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
