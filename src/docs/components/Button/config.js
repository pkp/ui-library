export let props = {
	element: 'button',
	href: '',
	label: 'Submit',
	icon: '',
	isPrimary: false,
	isWarnable: false,
	isActive: false,
	isLink: false
};

export const propDocs = [
	{
		key: 'element',
		description:
			'Whether to use a <code>button</code> or <code>a</code> HTML tag. Default: <code>button</code>'
	},
	{
		key: 'href',
		description:
			'URL when using a link element. <code>element</code> must be set to <code>a</code>'
	},
	{
		key: 'label',
		description: 'A label describing the button action.'
	},
	{
		key: 'icon',
		description: 'Add an icon before the button label.'
	},
	{
		key: 'isPrimary',
		description:
			'Use when this button represents the default or expected action in a group of actions. A single group of actions should never have more than one primary button.'
	},
	{
		key: 'isWarnable',
		description:
			'Use when this button represents an action such as delete, go back, revert or cancel.'
	},
	{
		key: 'isActive',
		description:
			'Use when the button controls another element, and that element is active. Think of it like an <a href="https://www.google.co.uk/search?q=on+air+sign&tbm=isch">On Air</a> button.'
	},
	{
		key: 'isLink',
		description:
			'Use when you want the button to look more like a traditional link than a button.'
	}
];

export const emitDocs = [
	{
		key: 'click',
		description: 'When the button is clicked.',
		value: null
	},
	{
		key: 'focus',
		description: 'When the button receives focus.',
		value: null
	},
	{
		key: 'blur',
		description: 'When focus moves away from the button.',
		value: null
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
