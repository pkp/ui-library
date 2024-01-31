import DOMPurify from 'dompurify';

if (typeof pkp === 'undefined' || !pkp?.serverContext?.configAllowedHtml) {
	throw new Error('pkp.serverContext.configAllowedHtml is not configured');
}

const allowed_html = pkp.serverContext.configAllowedHtml;

// additional tags and attrs used in po files
const allowedTagsPO = ['button'];
const allowedAttrsPO = [];

let ALLOWED_TAGS = [];
let ALLOWED_ATTR = [];

allowed_html.split(',').forEach((tagWithAttribute) => {
	const parts = tagWithAttribute.split('[');
	const tag = parts[0];
	ALLOWED_TAGS.push(tag);

	if (parts.length > 1) {
		const attributes = parts[1].substring(0, parts[1].length - 1).split('|');
		attributes.forEach((attribute) => ALLOWED_ATTR.push(attribute));
	}
});

ALLOWED_TAGS = [...ALLOWED_TAGS, ...allowedTagsPO];
ALLOWED_ATTR = [...ALLOWED_ATTR, ...allowedAttrsPO];

// DOMPurify does not support defining tags along with attributes, its separate lists
// https://github.com/cure53/DOMPurify/issues/272
const sanitizeConfig = {
	ALLOWED_TAGS,
	ALLOWED_ATTR,
};

export const allowedHtmlDirective = {
	beforeMount(el, binding) {
		// Sanitize the content before inserting it into the element
		const cleanContent = DOMPurify.sanitize(binding.value, sanitizeConfig);
		el.innerHTML = cleanContent;
	},
	updated(el, binding) {
		// Re-sanitize the content if the bound value changes
		if (binding.value !== binding.oldValue) {
			const cleanContent = DOMPurify.sanitize(binding.value, sanitizeConfig);
			el.innerHTML = cleanContent;
		}
	},
};
