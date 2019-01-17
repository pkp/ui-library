export let props = {
	count: 1,
	total: 3,
	i18n: {
		multilingualProgress: '{$count}/{$total} items completed.'
	}
};

export const propDocs = [
	{
		key: 'count',
		description: 'The number of completed multilingual items.'
	},
	{
		key: 'total',
		description:
			'The total number of multilingual items available to be completed.'
	},
	{
		key: 'i18n',
		description:
			'A translation object containing one property, `multilingualProgress`, in the following form: `{$count}/{$total} items completed.`'
	}
];

export default {
	props,
	propDocs
};
