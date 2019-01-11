export let props = {
	label: '32 submissions',
	isPrimary: false,
	isWarnable: false,
	isButton: false,
	hasDot: false,
	stage: ''
};

export const propDocs = [
	{
		key: 'label',
		description: 'A hidden label for users without sight.'
	},
	{
		key: 'isPrimary',
		description: 'Badges which should stand out from adjacent badges.'
	},
	{
		key: 'isWarnable',
		description: 'Badges which describe an alert or warning.'
	},
	{
		key: 'isButton',
		description:
			'If the badge can be used to perform an action, set this to true.'
	},
	{
		key: 'hasDot',
		description: 'Adds a small dot to the left of the <code>content</code>.'
	},
	{
		key: 'stage',
		description:
			'Pass a stage name to use a special design for stage badges. Supports: <code>submission</code>, <code>review</code>, <code>copyediting</code>, <code>production</code>.'
	}
];

export const emitDocs = [
	{
		key: 'click',
		description:
			'This event will be emitted when the badge is clicked and `isButton` is `true`.',
		value: null
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
