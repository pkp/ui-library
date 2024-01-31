import DOMPurify from 'dompurify';

const allowed_html =
	'a[href|target|title],em,strong,cite,code,ul,ol,li[class],dl,dt,dd,b,i,u,img[src|alt],sup,sub,br,p';

const ALLOWED_TAGS = [];
const ALLOWED_ATTR = [];

allowed_html.split(',').forEach((tagWithAttribute) => {
	const parts = tagWithAttribute.split('[');
	const tag = parts[0];
	ALLOWED_TAGS.push(tag);

	if (parts.length > 1) {
		const attributes = parts[1].substring(0, parts[1].length - 1).split('|');
		attributes.forEach((attribute) => ALLOWED_ATTR.push(attribute));
	}
});

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
