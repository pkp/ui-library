import DOMPurify from 'dompurify';

const sanitizeConfig = {
	USE_PROFILES: {html: true},
};

export const stripUnsafeHtml = {
	// Called only once, when the directive is first bound to the element.
	// This is where you can do one-time setup work.
	bind(el, binding) {
		// Handle null and undefined values by defaulting to an empty string
		const value = binding.value == null ? '' : String(binding.value);
		const cleanContent = DOMPurify.sanitize(value, sanitizeConfig);
		el.innerHTML = cleanContent;
	},
	// Called whenever the bound value changes.
	update(el, binding) {
		// Only re-sanitize and update if the value has changed, handling null and undefined
		if (binding.value !== binding.oldValue) {
			const value = binding.value == null ? '' : String(binding.value);
			const cleanContent = DOMPurify.sanitize(value, sanitizeConfig);
			el.innerHTML = cleanContent;
		}
	},
};
