export let props = {
	tooltip:
		'Use tooltips to provide short, helpful advice on what is expected of the user. Do not use tooltips for required information.',
	label: 'Tooltip for the demonstration component.'
};

export const propDocs = [
	{
		key: 'tooltip',
		description: 'The message to display in the popup.'
	},
	{
		key: 'label',
		description:
			'A label for the button that screenreaders will use to understand it. This should refer to the thing it is describing. A tooltip for the submission subtitle field might say "Tooltip for subtitle".'
	}
];

export default {
	props,
	propDocs
};
